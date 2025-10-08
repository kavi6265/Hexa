<<<<<<< HEAD
// Cart.js
import React, { useState, useEffect } from "react";
import { database, auth } from "./firebase";
import { ref, remove, update, get, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "../css/Cart.css";
=======
import React, { useState, useEffect } from "react";
import { database, auth } from "./firebase"; 
import { ref, remove, update, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import '../css/Cart.css';

// Import the image mapping
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
};
>>>>>>> 05bb7da93d7c9f4b56c1121855e32934ac4bad2f

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
<<<<<<< HEAD
  const [imageMap, setImageMap] = useState({}); // imageNames node
  const [productsMap, setProductsMap] = useState({}); // products node (id -> product data)
  const navigate = useNavigate();

  // Auth listener
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setCartItems([]);
        setLoading(false);
        navigate("/login");
      } else {
        setLoading(true);
        // when user logs in we rely on listeners below to populate maps and cart
      }
    });
    return () => unsub();
  }, [navigate]);

  // Real-time listener for products node (keeps productsMap up-to-date)
  useEffect(() => {
    const productsRef = ref(database, "products");
    const unsubProducts = onValue(productsRef, (snapshot) => {
      const map = {};
      snapshot.forEach((child) => {
        const p = child.val() || {};
        // Normalize fields that might contain image info
        map[child.key] = {
          id: child.key,
          img: p.imageUrl || p.image || p.img || p.imagePath || null,
          filename: p.filename || null,
          name: p.name || p.title || null,
          price: p.price ?? null,
          raw: p // store raw object if needed
        };
      });
      setProductsMap(map);
    }, (err) => {
      console.error("products onValue error:", err);
    });

    return () => {
      unsubProducts();
    };
  }, []);

  // Real-time listener for imageNames node (your mapping)
  useEffect(() => {
    const imagesRef = ref(database, "imageNames");
    const unsubImages = onValue(imagesRef, (snapshot) => {
      if (snapshot.exists()) {
        setImageMap(snapshot.val());
      } else {
        setImageMap({});
      }
    }, (err) => {
      console.error("imageNames onValue error:", err);
    });

    return () => unsubImages();
  }, []);

  // Real-time listener for the user's cart (updates when items added/removed)
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const userCartRef = ref(database, `userscart/${user.uid}`);
    const unsubCart = onValue(userCartRef, (snapshot) => {
      const items = [];
      snapshot.forEach((child) => {
        items.push({
          id: child.key,
          ...child.val()
        });
      });
      setCartItems(items);
      calculateTotal(items);
      setLoading(false);
    }, (err) => {
      console.error("userscart onValue error:", err);
      setLoading(false);
    });

    return () => unsubCart();
  }, [user]);

  // Helpers
  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const qty = Number(item.qty) || 1;
      const amt = parseFloat(item.productamt) || 0;
      return sum + amt * qty;
=======
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        fetchCartItems(currentUser.uid);
      } else {
        // Redirect to login if not authenticated
        setCartItems([]);
        setLoading(false);
        navigate("/login");
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const fetchCartItems = (userId) => {
    setLoading(true);
    const userCartRef = ref(database, `userscart/${userId}`);
    
    get(userCartRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const items = [];
          snapshot.forEach((childSnapshot) => {
            items.push({
              id: childSnapshot.key,
              ...childSnapshot.val()
            });
          });
          setCartItems(items);
          calculateTotal(items);
        } else {
          setCartItems([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
        setLoading(false);
      });
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      return sum + (parseFloat(item.productamt) * item.qty);
>>>>>>> 05bb7da93d7c9f4b56c1121855e32934ac4bad2f
    }, 0);
    setTotalAmount(total);
  };

  const handleRemoveItem = (itemId) => {
    if (!user) return;
<<<<<<< HEAD
    const itemRef = ref(database, `userscart/${user.uid}/${itemId}`);
    remove(itemRef).catch((err) => console.error("remove error:", err));
  };

  const handleQuantityChange = (itemId, newQty) => {
    if (!user || newQty < 1) return;
    const itemRef = ref(database, `userscart/${user.uid}/${itemId}`);
    update(itemRef, { qty: newQty }).catch((err) => console.error("update qty error:", err));
  };

  // Resolve image using (1) product record, (2) direct URL, (3) imageNames mapping, (4) fallback
  const getImageResource = (imageId, productId) => {
    // 1) If productId exists, try productsMap first
    if (productId && productsMap[productId]) {
      const p = productsMap[productId];
      const pimg = p.img ?? p.filename ?? null;

      if (pimg) {
        if (typeof pimg === "string") {
          if (pimg.startsWith("http")) return pimg; // full Firebase URL
          // if product stores an image-id (digits) that maps via imageMap
          if (/^\d+$/.test(pimg) && imageMap[pimg]) return `/${imageMap[pimg]}`;
          // if looks like a filename (ends with extension) return from public root
          if (/\.(png|jpe?g|gif|svg)$/i.test(pimg)) return `/${pimg}`;
          // fallback: return as root path (some product entries might store filenames without extension checking)
          return `/${pimg}`;
        }
      }
    }

    // 2) If imageId is a full URL
    if (imageId && typeof imageId === "string" && imageId.startsWith("http")) {
      return imageId;
    }

    // 3) If imageId matches imageMap (imageNames node)
    if (imageId != null) {
      const idString = imageId.toString();
      const filename = imageMap[idString];
      if (filename) return `/${filename}`; // public root
      // if imageId itself looks like a filename (rare) return directly
      if (/\.(png|jpe?g|gif|svg)$/i.test(idString)) return `/${idString}`;
    }

    // 4) fallback
    return "/unknowenprofile.png";
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };
=======
    
    const itemRef = ref(database, `userscart/${user.uid}/${itemId}`);
    remove(itemRef)
      .then(() => {
        const updatedItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
        alert("Item removed from cart!");
      })
      .catch((error) => {
        console.error("Error removing item:", error);
      });
  };

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty < 1) return;
    
    const itemRef = ref(database, `userscart/${user.uid}/${itemId}`);
    update(itemRef, { qty: newQty })
      .then(() => {
        const updatedItems = cartItems.map(item => {
          if (item.id === itemId) {
            return { ...item, qty: newQty };
          }
          return item;
        });
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
      })
      .catch((error) => {
        console.error("Error updating quantity:", error);
      });
  };

  // Helper function to get image resource based on ID or key
  // Helper function to get image resource based on ID
const getImageResource = (imageId) => {
  // Convert imageId to string if it's a number (since Firebase might store it as integer)
  const idString = imageId.toString();
  
  // Look up the image filename in the mapping
  const filename = IMAGE_ID_MAPPING[idString];
  
  if (filename) {
    // Return the filename if found in the mapping
    return filename;
  } else {
    // Return a default image or placeholder if not found
    console.warn(`No image found for ID: ${imageId}`);
    return "unknowenprofile.png"; // Default fallback image
  }
};
>>>>>>> 05bb7da93d7c9f4b56c1121855e32934ac4bad2f

  if (loading) {
    return (
      <div className="loading-container">
<<<<<<< HEAD
        <div className="loader" />
=======
        <div className="loader"></div>
>>>>>>> 05bb7da93d7c9f4b56c1121855e32934ac4bad2f
        <h2>Loading your cart...</h2>
      </div>
    );
  }

  return (
    <div className="cart-pagecart">
      <section className="page-headercart">
        <h2 className="page-header-titlecart">#cart</h2>
        <p className="page-header-desccart">View your selected items</p>
      </section>

      <section className="cart-containercart">
        {cartItems.length === 0 ? (
          <div className="empty-cartcart">
<<<<<<< HEAD
            <i className="bx bx-cart-alt empty-cart-iconcart" />
            <h2 className="empty-cart-titlecart">Your cart is empty</h2>
            <button onClick={() => navigate("/shop")} className="shop-btncart">
              Continue Shopping
            </button>
=======
            <i className="bx bx-cart-alt empty-cart-iconcart"></i>
            <h2 className="empty-cart-titlecart">Your cart is empty</h2>
            <button onClick={() => navigate("/shop")} className="shop-btncart">Continue Shopping</button>
>>>>>>> 05bb7da93d7c9f4b56c1121855e32934ac4bad2f
          </div>
        ) : (
          <>
            <div className="cart-table-containercart">
              <table className="cart-tablecart">
                <thead className="cart-table-headcart">
                  <tr className="cart-table-rowcart">
<<<<<<< HEAD
                    <th>Remove</th>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {cartItems.map((item) => {
                    // pass both productimage and productId so resolution can try products node as source
                    const src = getImageResource(item.productimage, item.productId);
                    return (
                      <tr key={item.id}>
                        <td>
                          <button onClick={() => handleRemoveItem(item.id)} className="remove-btncart">
                            <i className="bx bx-x-circle" />
                          </button>
                        </td>
                        <td>
                          <img
                            src={src}
                            alt={item.productname}
                            className="product-thumbnail-imgcart"
                            onError={(e) => {
                              console.warn("Image load failed, fallback:", e.target.src);
                              e.target.src = "/unknowenprofile.png";
                            }}
                          />
                        </td>
                        <td>{item.productname}</td>
                        <td>₹{item.productamt}</td>
                        <td>
                          <div className="quantity-controlcart">
                            <button onClick={() => handleQuantityChange(item.id, (Number(item.qty) || 1) - 1)}>-</button>
                            <span>{item.qty}</span>
                            <button onClick={() => handleQuantityChange(item.id, (Number(item.qty) || 1) + 1)}>+</button>
                          </div>
                        </td>
                        <td>₹{((parseFloat(item.productamt) || 0) * (Number(item.qty) || 1)).toFixed(2)}</td>
                      </tr>
                    );
                  })}
=======
                    <th className="cart-table-headercart">Remove</th>
                    <th className="cart-table-headercart">Image</th>
                    <th className="cart-table-headercart">Product</th>
                    <th className="cart-table-headercart">Price</th>
                    <th className="cart-table-headercart">Quantity</th>
                    <th className="cart-table-headercart">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="cart-table-bodycart">
                  {cartItems.map((item) => (
                    <tr key={item.id} className="cart-itemcart">
                      <td className="cart-item-cellcart">
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="remove-btncart"
                          aria-label="Remove item"
                        >
                          <i className="bx bx-x-circle remove-iconcart" ></i>
                        </button>
                      </td>
                      <td className="product-imagecart">
                        <img 
                          src={getImageResource(item.productimage)} 
                          alt={item.productname}
                          className="product-thumbnail-imgcart" 
                        />
                      </td>
                      <td className="product-namecart">{item.productname}</td>
                      <td className="product-pricecart">₹{item.productamt}</td>
                      <td className="quantity-cellcart">
                        <div className="quantity-controlcart">
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                            className="qty-btncart"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="qty-valuecart">{item.qty}</span>
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                            className="qty-btncart"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="subtotalcart">₹{(parseFloat(item.productamt) * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
>>>>>>> 05bb7da93d7c9f4b56c1121855e32934ac4bad2f
                </tbody>
              </table>
            </div>

            <div className="cart-summarycart">
              <div className="summary-contentcart">
                <h3 className="summary-titlecart">Cart Totals</h3>
                <div className="summary-linecart">
                  <span className="summary-line-labelcart">Cart Subtotal</span>
                  <span className="summary-line-valuecart">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="summary-linecart">
                  <span className="summary-line-labelcart">Shipping</span>
                  <span className="summary-line-valuecart">Free</span>
                </div>
                <div className="summary-linecart totalcart">
                  <span className="summary-line-labelcart">Total</span>
                  <span className="summary-line-valuecart">₹{totalAmount.toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} className="checkout-btncart">
                  Proceed to checkout
                </button>
              </div>
            </div>
          </>
        )}
      </section>
<<<<<<< HEAD
=======

>>>>>>> 05bb7da93d7c9f4b56c1121855e32934ac4bad2f
      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-column brand-column">
            <h3>Jasa Essential</h3>
            <p>Your trusted partner for quality stationery products for students and professionals. We offer a wide range of supplies at competitive prices.</p>
            <div className="social-icons">
              
              <a href="https://www.instagram.com/jasa_essential?igsh=MWVpaXJiZGhzeDZ4Ng=="><i className="bx bxl-instagram"></i></a>
              
            </div>
          </div>
          
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Shop</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">FAQ</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="#">My Account</a></li>
              <li><a href="#">Order History</a></li>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Returns & Exchanges</a></li>
              <li><a href="#">Terms & Conditions</a></li>
            </ul>
          </div>
          
          <div className="footer-column contact-info">
            <h4>Contact Us</h4>
            <p><i className="bx bx-map"></i> 2/3 line medu pension line 2 nd street  line medu , salem 636006</p>
            <p><i className="bx bx-phone"></i> (+91) 7418676705</p>
            
            <p><i className="bx bx-envelope"></i> jasaessential@gmail.com</p>
          </div>
        </div>
        
        <div className="footer-bottom" style={{display:"block"}}>
          <p>&copy; 2025 Jasa Essential. All Rights Reserved.</p>
          {/* <div className="payment-methods">
            <i className="bx bxl-visa"></i>
            <i className="bx bxl-mastercard"></i>
            <i className="bx bxl-paypal"></i>
            <i className="bx bxl-google-pay"></i>
          </div> */}
          <div className="footer-content">
        <p className="copyright1" style={{flexDirection:"row"}}>Developed by <a href="https://rapcodetechsolutions.netlify.app/" className="develop-aa"><img src="/Rapcode.png" style={{width:"20px",height:"20px",display:"flex",margin:"auto",flexDirection:"row", marginLeft:"10px"}} alt="RapCode Logo"></img>RapCode Tech Solutions</a></p>
      </div>
        </div>
      </footer>
    </div>
  );
};

<<<<<<< HEAD
export default Cart;
=======
export default Cart;
>>>>>>> 05bb7da93d7c9f4b56c1121855e32934ac4bad2f
