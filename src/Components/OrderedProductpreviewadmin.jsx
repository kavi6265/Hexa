<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { database } from "./firebase";
import { ref as dbRef, onValue, update, set, get } from "firebase/database";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import "../css/OrderedProductpreviewadmin.css";

function OrderedProductpreviewadmin() {
  const { orderId, userId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [imageMap, setImageMap] = useState({});
  const [imageUrlCache, setImageUrlCache] = useState({}); // key = original product.productimage value -> resolved URL
  const navigate = useNavigate();

  useEffect(() => {
    if (userId && orderId) {
      loadImageMapping();
      const unsubscribe = fetchOrderDetails(userId, orderId);
      return () => {
        if (typeof unsubscribe === "function") unsubscribe();
      };
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, orderId]);

  // Load imageNames node
  const loadImageMapping = async () => {
    try {
      const imgRef = dbRef(database, "imageNames");
      const snapshot = await get(imgRef);
      if (snapshot.exists()) {
        setImageMap(snapshot.val());
      } else {
        setImageMap({});
      }
    } catch (err) {
      console.error("Error loading imageNames mapping:", err);
      setImageMap({});
    }
  };

  // Fetch order details
  const fetchOrderDetails = (uid, oid) => {
    setLoading(true);
    const orderRef = dbRef(database, `userorders/${uid}/${oid}`);

    const unsubscribe = onValue(
      orderRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setOrder(null);
          setLoading(false);
          return;
        }

        const data = snapshot.val();
        const metaKeys = [
          "orderTotal",
          "orderTimestamp",
          "username",
          "phno",
          "notes",
          "ordered",
          "odered",
          "delivered",
          "address",
          "items",
        ];

        const items =
          data.items ||
          Object.fromEntries(
            Object.entries(data).filter(([k]) => !metaKeys.includes(k))
          );

        const products = Object.values(items).map((item) => ({
          ...item,
          // keep the original productimage string (could be full URL, filename, or numeric ID)
          productimage: item.productimage || "/unknowenprofile.png",
        }));

        setOrder({
          orderId: oid,
          orderTotal: data.orderTotal || 0,
          orderTimestamp: data.orderTimestamp || null,
          products,
          username: data.username || "Unknown",
          phno: data.phno || "",
          notes: data.notes || "",
          ordered: data.ordered || data.odered || false,
          delivered: data.delivered || false,
          address: data.address || "No address provided",
        });

        setLoading(false);
      },
      (error) => {
        console.error("❌ Error fetching order details:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  // When we have order + imageMap, try to prefetch/resolve images
  useEffect(() => {
    if (order && order.products && Object.keys(imageMap).length >= 0) {
      prefetchImages(order.products);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, imageMap]);

  // Prefetch and cache resolved image URLs
  const prefetchImages = async (products) => {
    const storage = getStorage();
    const newCache = { ...imageUrlCache };

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      // use the raw productimage string as cache key (works for "http...", "2131230840", "about_us.png", etc.)
      const key = p.productimage || `__unknown_${i}`;

      if (newCache[key]) continue; // already resolved

      try {
        const resolved = await resolveImageToUrl(key, storage);
        newCache[key] = resolved;
      } catch (err) {
        console.warn("Could not resolve image for", key, err);
        newCache[key] = "/unknowenprofile.png";
      }
    }

    setImageUrlCache(newCache);
  };

  // Try to resolve: (1) full http URL, (2) numeric id -> filename via imageMap -> Storage, (3) filename -> Storage, (4) fallback to /filename in public, finally placeholder.
  const resolveImageToUrl = async (imgValue, storage) => {
    if (!imgValue) return "/unknowenprofile.png";

    // Already a full URL (Firebase download URL or external)
    if (typeof imgValue === "string" && imgValue.startsWith("http")) {
      return imgValue;
    }

    // Determine filename (if numeric id, map it)
    let fileName = imgValue;
    if (/^\d+$/.test(String(imgValue))) {
      fileName = imageMap[String(imgValue)] || null;
    }

    // If mapping produced null, treat original value as filename
    if (!fileName) fileName = String(imgValue);

    // If the value already looks like a public path, return it
    if (fileName.startsWith("/")) return fileName;

    // Candidate storage object paths to try (order matters)
    const candidatePaths = [
      fileName,
      `images/${fileName}`,
      `product_images/${fileName}`,
      `uploads/${fileName}`,
      `assets/${fileName}`,
    ];

    // If fileName has no extension, also try adding common extensions
    if (!/\.(png|jpg|jpeg|webp|gif)$/i.test(fileName)) {
      candidatePaths.unshift(`${fileName}.png`, `${fileName}.jpg`, `${fileName}.jpeg`);
    }

    // Try each candidate path with Firebase Storage
    for (let path of candidatePaths) {
      try {
        const sRef = storageRef(storage, path);
        const url = await getDownloadURL(sRef);
        if (url) return url;
      } catch (err) {
        // console.debug(`Storage lookup failed for ${path}`, err);
        // try next candidate
      }
    }

    // final fallback: attempt to use public folder path (e.g., /about_us.png) — browser will handle 404 and onError will swap to placeholder
    return `/${fileName}`;
  };

  // Mark as delivered
  const markAsDelivered = () => {
    if (!orderId || !userId) return;
    setUpdating(true);

    const orderRef = dbRef(database, `userorders/${userId}/${orderId}`);
    update(orderRef, { delivered: true })
      .then(() => {
        const destRef = dbRef(database, `deliveredordersadmin/${orderId}`);
        if (order) {
          const updatedOrder = { ...order, delivered: true };
          set(destRef, updatedOrder)
            .then(() => {
              setUpdating(false);
              setOrder((prev) => ({ ...prev, delivered: true }));
              alert("✅ Order marked as delivered successfully!");
            })
            .catch((err) => {
              console.error("Error writing to deliveredordersadmin:", err);
              setUpdating(false);
            });
        }
      })
      .catch((err) => {
        console.error("Error updating order:", err);
        setUpdating(false);
      });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const d = new Date(timestamp);
    return d.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const OrderStatusTracker = ({ order }) => {
    const steps = [
      { label: "Order Placed", active: true, icon: "✔" },
      { label: "Processing", active: order?.ordered, icon: "📦" },
      { label: "Delivered", active: order?.delivered, icon: "●" },
    ];
    return (
      <div className="status-tracker">
        {steps.map((s, i) => (
          <div key={i} className="status-step">
            <div className={`circle ${s.active ? "active" : ""}`}>{s.icon}</div>
            <span className={`label ${s.active ? "active" : ""}`}>{s.label}</span>
            {i < steps.length - 1 && (
              <div className={`line ${steps[i + 1].active ? "active" : ""}`} />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Immediate fallback for rendering while async resolution completes
  const immediateSrcFor = (imgVal) => {
    if (!imgVal) return "/unknowenprofile.png";
    const s = String(imgVal);
    if (s.startsWith("http")) return s;
    if (/^\d+$/.test(s)) {
      const fname = imageMap[s];
      if (fname) return `/${fname}`; // public fallback while Storage resolution happens
      return "/unknowenprofile.png";
    }
    if (/\.(png|jpg|jpeg|webp|gif)$/i.test(s)) return `/${s}`;
    return "/unknowenprofile.png";
  };

  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <h1>Order Details</h1>
      </div>

      {loading ? (
        <div className="profile-loading">
          <div className="spinner" />
        </div>
      ) : order ? (
        <div className="order-details-content">
          {/* Order Summary */}
          <div className="order-summary-card">
            <div className="order-header-section">
              <div className="order-id-section">
               <h2>Order #{order.orderId.slice(0, 8)}</h2>
               <span className="order-date">
               {new Date(order.orderTimestamp).toLocaleDateString("en-IN", {
               year: "numeric",
               month: "short",
               day: "numeric",
            })}
              </span>
            </div>
            </div>

            <OrderStatusTracker order={order} />

            <div className="shipping-address-section">
              <h3>
                <i className="bx bx-map"></i> Shipping Address
              </h3>
              <div className="address-details">
                <p className="recipient-name">{order.username}</p>
                <p className="phone-number">
                  <i className="bx bx-phone"></i> {order.phno}
                </p>
                <p className="full-address">
                  <i className="bx bx-home"></i> {order.address}
                </p>
                {order.notes && (
                  <p className="order-notes">
                    <i className="bx bx-note"></i> <strong>Notes:</strong> {order.notes}
                  </p>
                )}
              </div>
            </div>

            {!order.delivered && (
              <div className="admin-actions">
                <button
                  className="mark-as-delivered-btn"
                  onClick={markAsDelivered}
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Mark as Delivered"}
                </button>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="order-items-section">
            <h3>Order Items</h3>
            <div className="order-items-list">
              {order.products.map((product, index) => {
                const key = product.productimage || `__unknown_${index}`;
                const resolved = imageUrlCache[key];
                const src = resolved || immediateSrcFor(product.productimage);

                return (
                  <div key={index} className="order-product-item">
                    <div className="product-image">
                      <img
                        src={src}
                        alt={product.productname}
                        onError={(e) => {
                          // set broken images to placeholder and cache it to avoid repeated failed loads
                          e.target.onerror = null;
                          e.target.src = "/unknowenprofile.png";
                          setImageUrlCache((prev) => ({ ...prev, [key]: "/unknowenprofile.png" }));
                        }}
                      />
                    </div>
                    <div className="product-info">
                      <h4 className="product-name">{product.productname}</h4>
                      <div className="product-meta">
                        <span className="product-price">₹{product.productamt}</span>
                        <span className="product-quantity">Qty: {product.qty}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="payment-summary-section">
            <h3>
              <i className="bx bx-credit-card"></i> Payment Summary
            </h3>
            <div className="payment-details">
              <div className="payment-row">
                <span>Subtotal</span>
                <span className="amount">₹{order.orderTotal}</span>
              </div>
              <div className="payment-row">
                <span>Shipping Fee</span>
                <span className="amount free">FREE</span>
              </div>
              <div className="payment-divider" />
              <div className="payment-row total">
                <span>Total</span>
                <span className="amount total-amount">₹{order.orderTotal}</span>
              </div>
              <div className="payment-method">
                <i className="bx bx-money"></i> Cash on Delivery
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="order-not-found">
          <i className="bx bx-error-circle" />
          <h2>Order Not Found</h2>
          <button className="back-to-orders" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderedProductpreviewadmin;
=======
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { database } from './firebase';
import { ref, onValue, update, set } from 'firebase/database';
import '../css/OrderedProductpreviewadmin.css';

function OrderedProductpreviewadmin(){
    const { orderId, userId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (orderId && userId) {
            fetchOrderDetails(userId, orderId);
        }
    }, [orderId, userId]);

    const fetchOrderDetails = (userId, orderId) => {
        setLoading(true);
        const orderRef = ref(database, `userorders/${userId}/${orderId}`);
        
        onValue(orderRef, (snapshot) => {
            if (snapshot.exists()) {
                const orderData = snapshot.val();
                const orderTotal = orderData.orderTotal;
                const orderTimestamp = orderData.orderTimestamp;
                const username = orderData.username;
                const phno = orderData.phno;
                const notes = orderData.notes;
                const ordered = orderData.odered; 
                const delivered = orderData.delivered;
                const address = orderData.address;
                
                const products = [];
                Object.keys(orderData).forEach(key => {
                    // Skip non-product fields
                    if (!["orderTotal", "orderTimestamp", "username", "phno", "notes", "odered", "delivered", "address"].includes(key)) {
                        products.push(orderData[key]);
                    }
                });
                
                setOrder({
                    orderId,
                    orderTotal,
                    orderTimestamp,
                    products,
                    username,
                    phno,
                    notes,
                    ordered,
                    delivered,
                    address
                });
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching order details:", error);
            setLoading(false);
        });
    };

    // Mark as delivered function
    const markAsDelivered = () => {
        if (!orderId || !userId) return;
        
        setUpdating(true);
        
        // Update the delivered status in the original order
        const orderRef = ref(database, `userorders/${userId}/${orderId}`);
        update(orderRef, { delivered: true })
            .then(() => {
                // Now copy the entire order to deliveredordersadmin
                const orderToDeliveredRef = ref(database, `deliveredordersadmin/${orderId}`);
                
                // Get the current order data and set it in the deliveredordersadmin path
                if (order) {
                    // Create a clean copy of the order, filtering out any undefined values
                    const orderCopy = { 
                        orderId: order.orderId || '',
                        orderTotal: order.orderTotal || 0,
                        orderTimestamp: order.orderTimestamp || Date.now(),
                        products: order.products || [],
                        username: order.username || '',
                        phno: order.phno || '',
                        // Handle potentially undefined notes
                        notes: order.notes || '',
                        ordered: order.ordered || false,
                        delivered: true,
                        address: order.address || ''
                    };
                    
                    set(orderToDeliveredRef, orderCopy)
                        .then(() => {
                            setUpdating(false);
                            // Update local state
                            setOrder(prevOrder => ({ ...prevOrder, delivered: true }));
                            // Optionally navigate away or show success message
                            alert("Order marked as delivered successfully!");
                            // Uncomment to navigate away after marking delivered:
                            // navigate("/admin/orders");
                        })
                        .catch((error) => {
                            console.error("Error copying order to delivered orders:", error);
                            setUpdating(false);
                            alert("Failed to mark order as delivered. Please try again.");
                        });
                }
            })
            .catch((error) => {
                console.error("Error updating order status:", error);
                setUpdating(false);
                alert("Failed to mark order as delivered. Please try again.");
            });
    };

    // Helper function to format timestamp
    const formatDate = (timestamp) => {
        if (!timestamp) return "Unknown date";
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getImageUrl = (imageId) => {
        const IMAGE_ID_MAPPING = {
            
            "2131230840": "about_us.png",
        "2131230841": "afoursheet.png",
        "2131230842": "athreenote.png",
        "2131230843": "athreenotee.jpg",
        "2131230844": "athreenotess.jpg",
        "2131230847": "back.png",
        "2131230848": "backround_btn_profile.png",
        "2131230849": "backroundblack_btn_profile.png",
        "2131230850": "backspalsh.png",
        "2131230851": "badge_background.png",
        "2131230852": "banner_bgprofile.png",
        "2131230853": "baseline_add_24.png",
        "2131230854": "baseline_arrow_back_24.png",
        "2131230855": "baseline_call_24.png",
        "2131230856": "baseline_delete_24.png",
        "2131230857": "baseline_edit_24.png",
        "2131230858": "baseline_email_24.png",
        "2131230859": "baseline_file_download_24.png",
        "2131230860": "baseline_file_upload_24.png",
        "2131230861": "baseline_history_24.png",
        "2131230862": "baseline_home_24.png",
        "2131230863": "baseline_info_24.png",
        "2131230864": "baseline_keyboard_backspace_24.png",
        "2131230865": "baseline_local_printshop_24.png",
        "2131230866": "baseline_location_on_24.png",
        "2131230867": "baseline_lock_reset_24.png",
        "2131230868": "baseline_logout_24.png",
        "2131230869": "baseline_menu_24.png",
        "2131230870": "baseline_menu_book_24.png",
        "2131230871": "baseline_minimize_24.png",
        "2131230872": "baseline_person_24.png",
        "2131230873": "baseline_person_add_alt_1_24.png",
        "2131230874": "baseline_preview_24.png",
        "2131230875": "baseline_privacy_tip_24.png",
        "2131230876": "baseline_remove_red_eye_24.png",
        "2131230877": "baseline_search_24.png",
        "2131230878": "baseline_settings_24.png",
        "2131230879": "baseline_shopping_cart_24.png",
        "2131230880": "baseline_smartphone_24.png",
        "2131230881": "bikelogo.png",
        "2131230882": "bipolar.jpg",
        "2131230883": "black_circle.png",
        "2131230884": "bookimg.png",
        "2131230885": "books.png",
        "2131230886": "borrderlines.png",
        "2131230887": "btn_1.png",
        "2131230888": "btn_3.png",
        "2131230889": "btn_4.png",
        "2131230898": "btnbackroundprofile.png",
        "2131230899": "button_background.png",
        "2131230900": "calculatordeli.png",
        "2131230901": "calculatorr.png",
        "2131230902": "caltrix.jpg",
        "2131230957": "casio991.jpg",
        "2131230958": "circles.png",
        "2131230978": "cx.png",
        "2131230979": "cxd.png",
        "2131230985": "drafte1.png",
        "2131230986": "drafter.png",
        "2131230987": "drafter1.jpg",
        "2131230988": "draftercombo.png",
        "2131230989": "edittext_background.png",
        "2131230990": "edittext_background_wh.png",
        "2131230991": "eraser.png",
        "2131230992": "file_paths.png",
        "2131230993": "files.jpg",
        "2131230994": "flair.jpg",
        "2131230997": "gradient_circle.png",
        "2131230998": "graph.png",
        "2131230999": "graphh.png",
        "2131231000": "graybackround.png",
        "2131231001": "greycircle.png",
        "2131231002": "header_back.png",
        "2131231003": "home_bg_green.png",
        "2131231004": "hotot.jpg",
        "2131231005": "htt.jpg",
        "2131231008": "ic_baseline_email_24.png",
        "2131231009": "ic_baseline_person_24.png",
        "2131231010": "ic_baseline_security_24.png",
        "2131231020": "ic_launcher_background.png",
        "2131231021": "ic_launcher_foreground.png",
        "2131231033": "iconwhapp.png",
        "2131231035": "instalogo.png",
        "2131231036": "jasalogo.png",
        "2131231037": "jasalogo512px.png",
        "2131231038": "labcourt.png",
        "2131231039": "laodingpng.png",
        "2131231040": "lavender_round.png",
        "2131231062": "minus.png",
        "2131231100": "nav_item_background.png",
        "2131231101": "nav_profile.png",
        "2131231102": "nav_share.png",
        "2131231104": "note.png",
        "2131231118": "onebyone.png",
        "2131231119": "onebytwo.png",
        "2131231120": "pdflogo.png",
        "2131231121": "pen.png",
        "2131231122": "pencilcombo.png",
        "2131231123": "pencombo.png",
        "2131231124": "person3.jpg",
        "2131231125": "phonelogo.png",
        "2131231126": "phonepay.png",
        "2131231127": "phto.jpg",
        "2131231128": "pngegg.png",
        "2131231130": "previeew_bg.png",
        "2131231131": "productbackround.png",
        "2131231132": "productimagee.png",
        "2131231133": "profile_bg_green.png",
        "2131231134": "qrcodesalem.jpg",
        "2131231135": "rapcode.png",
        "2131231136": "red_circle.png",
        "2131231137": "review.png",
        "2131231138": "scale.png",
        "2131231139": "search_icon.png",
        "2131231140": "smallnote.jpg",
        "2131231141": "social_btn_background.png",
        "2131231142": "stabler.jpg",
        "2131231143": "stylishblackpen.png",
        "2131231144": "stylishpenblue.jpg",
        "2131231146": "tick.png",
        "2131231147": "tipbox.png",
        "2131231148": "tippencil.png",
        "2131231151": "top_background.png",
        "2131231152": "uioop.png",
        "2131231153": "unknowenprofile.png",
        "2131231154": "upload.png",
        "2131231155": "upload2.png",
        "2131231156": "uploadqr.png",
        "2131231157": "vcc.jpg",
        "2131231158": "welcome.png",
        "2131231159": "white_box.png",
        "2131231160": "whitebg_profile.png",
        "2131231161": "whitebgcircleprofile.png",
        "2131231162": "whiteblack_bg.png",
        "2131231163": "women1.png",
        "2131231164": "xoblue.png",
        "2131231165": "xooblack.png"
            // other mappings
          };
        
        
        const filename = IMAGE_ID_MAPPING[imageId.toString()] || "unknowenprofile.png";
      
       
        return `/${filename}`;
      };

    // Modified to correctly pass product data to ProductView
    const handleProductClick = (product) => {
        // Create a properly formatted product object that ProductView expects
        const formattedProduct = {
            name: product.productname,
            price: `₹${product.productamt}`,
            img: getImageUrl(product.productimage),
            brand: product.productcompany || "Category",
            description: product.productdesc || "No description available"
        };
        
        // Navigate to the product page with the formatted product data
        navigate("/product", { state: { product: formattedProduct } });
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const getOrderStatusClass = () => {
        if (order?.delivered) return "status-pill delivered";
        if (order?.ordered) return "status-pill processing";
        return "status-pill pending";
    };

    const getOrderStatusText = () => {
        if (order?.delivered) return "Delivered";
        if (order?.ordered) return "Processing";
        return "Pending";
    };

    return (
        <div className="order-details-container">
            <div className="order-details-header">
                
                <h1>Order Details</h1>
            </div>

            {loading ? (
                
    <div className="profile-loading">
      <div className="spinner"></div>
      
    </div>
  
            ) : order ? (
                <div className="order-details-content">
                    <div className="order-summary-card">
                        <div className="order-header-section">
                            <div className="order-id-section">
                                <h2>Order #{order.orderId.substring(0, 8)}</h2>
                                <span className="order-date">{formatDate(order.orderTimestamp)}</span>
                            </div>
                            <div className={getOrderStatusClass()}>
                                {getOrderStatusText()}
                            </div>
                        </div>

                        <div className="order-progress-tracker">
                            <div className={`progress-step ${order.ordered || order.delivered ? 'active' : ''}`}>
                                <div className="step-icon"><i className="bx bx-check"></i></div>
                                <div className="step-label">Order Placed</div>
                            </div>
                            <div className={`progress-line ${order.ordered || order.delivered ? 'active' : ''}`}></div>
                            <div className={`progress-step ${order.ordered ? 'active' : ''}`}>
                                <div className="step-icon"><i className="bx bx-package"></i></div>
                                <div className="step-label">Processing</div>
                            </div>
                            <div className={`progress-line ${order.delivered ? 'active' : ''}`}></div>
                            <div className={`progress-step ${order.delivered ? 'active' : ''}`}>
                                <div className="step-icon"><i className="bx bx-truck"></i></div>
                                <div className="step-label">Delivered</div>
                            </div>
                        </div>

                        <div className="shipping-address-section">
                            <h3><i className="bx bx-map"></i> Shipping Address</h3>
                            <div className="address-details">
                                <p className="recipient-name">{order.username}</p>
                                <p className="phone-number"><i className="bx bx-phone"></i> {order.phno}</p>
                                <p className="full-address"><i className="bx bx-home"></i> {order.address}</p>
                                {order.notes && <p className="order-notes"><i className="bx bx-note"></i> <strong>Notes:</strong> {order.notes}</p>}
                            </div>
                        </div>
                        
                        {!order.delivered && (
                            <div className="admin-actions">
                                <button 
                                    className="mark-as-delivered-btn" 
                                    onClick={markAsDelivered}
                                    disabled={updating}
                                >
                                    {updating ? 'Updating...' : 'Mark as Delivered'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="order-items-section">
                        <h3>Order Items</h3>
                        
                        <div className="order-items-list">
                            {order.products.map((product, index) => (
                                <div 
                                    key={index} 
                                    className="order-product-item"
                                    onClick={() => handleProductClick(product)}
                                >
                                    <div className="product-image">
                                        <img 
                                            src={getImageUrl(product.productimage)} 
                                            alt={product.productname} 
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/unknowenprofile.png";
                                            }} 
                                        />
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name">{product.productname}</h4>
                                        <div className="product-meta">
                                            <span className="product-price">₹{product.productamt}</span>
                                            <span className="product-quantity">Qty: {product.qty}</span>
                                        </div>
                                    </div>
                                    <div className="view-product">
                                        <span className="view-product-text">View</span>
                                        <i className="bx bx-right-arrow-alt"></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="payment-summary-section">
                        <h3><i className="bx bx-credit-card"></i> Payment Summary</h3>
                        <div className="payment-details">
                            <div className="payment-row">
                                <span>Subtotal</span>
                                <span className="amount">₹{order.orderTotal}</span>
                            </div>
                            <div className="payment-row">
                                <span>Shipping Fee</span>
                                <span className="amount free">FREE</span>
                            </div>
                            <div className="payment-divider"></div>
                            <div className="payment-row total">
                                <span>Total</span>
                                <span className="amount total-amount">₹{order.orderTotal}</span>
                            </div>
                            <div className="payment-method">
                                <i className="bx bx-money"></i> Cash on Delivery
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
            ) : (
                <div className="order-not-found">
                    <i className="bx bx-error-circle"></i>
                    <h2>Order Not Found</h2>
                    <p>Sorry, we couldn't find the order you're looking for.</p>
                    <button className="back-to-orders" onClick={handleBackClick}>
                        Back to My Orders
                    </button>
                </div>
            )}
        </div>
    );
}

export default OrderedProductpreviewadmin;
>>>>>>> 05bb7da93d7c9f4b56c1121855e32934ac4bad2f
