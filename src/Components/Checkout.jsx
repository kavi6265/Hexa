import React, { useState, useEffect } from "react";
import { database, auth } from "./firebase"; 
import { ref, set, get, push } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "../css/Checkout.css";


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

// Create reverse mapping for lookup (image name to ID)
const REVERSE_IMAGE_MAPPING = {};
for (const [id, name] of Object.entries(IMAGE_ID_MAPPING)) {
  REVERSE_IMAGE_MAPPING[name] = id;
}

// Helper function to extract image name from URL/path
const extractImageName = (imagePath) => {
  // First, ensure imagePath is a string
  if (!imagePath || typeof imagePath !== 'string') {
    console.warn("Invalid image path:", imagePath);
    return "";
  }
  
  // Handle different path formats
  const parts = imagePath.split('/');
  const fileName = parts[parts.length - 1];
  return fileName; // Keep the extension for exact matching
};

// Function to find image ID from path
const getImageIdFromPath = (imagePath) => {
  // Direct ID check - if the imagePath is already an ID in our mapping
  if (IMAGE_ID_MAPPING[imagePath]) {
    return imagePath; // It's already an ID, return as is
  }
  
  // If imagePath is a number as string, check if it's a valid ID
  if (/^\d+$/.test(imagePath) && IMAGE_ID_MAPPING[imagePath]) {
    return imagePath;
  }
  
  // Otherwise try to extract the filename and find its ID
  const imageName = extractImageName(imagePath);
  
  // If no valid image name, return default
  if (!imageName) return "0";
  
  // Look for exact match first
  if (REVERSE_IMAGE_MAPPING[imageName]) {
    return REVERSE_IMAGE_MAPPING[imageName];
  }
  
  // If no exact match, try to find by file name without extension
  const nameWithoutExt = imageName.split('.')[0];
  
  // Try to find any mapping that contains this name
  for (const [id, name] of Object.entries(IMAGE_ID_MAPPING)) {
    if (name.includes(nameWithoutExt)) {
      return id;
    }
  }
  
  // If all else fails, return default
  return "0";
};

const Checkout = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    phno: "",
    address: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch complete user details if available
        const userRef = ref(database, `users/${currentUser.uid}`);
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setFormData(prevData => ({
              ...prevData,
              username: userData.name || "",
              phno: userData.phno || "",
              address: userData.address || ""
            }));
          }
        });
        
        fetchCartItems(currentUser.uid);
      } else {
        setLoading(false);
        navigate("/login");
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

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
          navigate("/cart"); // Redirect to cart if it's empty
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
    }, 0);
    setTotalAmount(total);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please log in to place an order");
      navigate("/login");
      return;
    }
    
    if (!formData.username || !formData.phno || !formData.address) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Current timestamp
    const orderTimestamp = Date.now();
    
    // Generate a unique order ID
    const orderId = push(ref(database, 'orders')).key;
    
    // Prepare order metadata
    const orderMetadata = {
      address: formData.address,
      phno: formData.phno,
      username: formData.username,
      orderTimestamp: orderTimestamp,
      orderTotal: totalAmount.toFixed(2),
      odered: true,
      delivered: false,
    };
    
    // Prepare order items object
    const orderItems = {};
    cartItems.forEach((item) => {
      try {
        // Get the image ID from the path
        const imageId = getImageIdFromPath(item.productimage);
        
        // Store the item with image ID instead of path
        orderItems[item.id] = {
          productname: item.productname,
          productamt: item.productamt,
          productimage: imageId, // Store the image ID instead of the path
          qty: item.qty,
          rating: item.rating || 0,
          discription: item.discription || "",
          key: item.id
        };
        
        console.log(`Mapped ${item.productimage} to ID: ${imageId}`);
      } catch (error) {
        console.error("Error processing item:", item, error);
        // Still add the item, but with a default image ID
        orderItems[item.id] = {
          productname: item.productname,
          productamt: item.productamt,
          productimage: "0", // Default image ID
          qty: item.qty,
          rating: item.rating || 0,
          discription: item.discription || "",
          key: item.id
        };
      }
    });
    
    
    // Create complete order object with metadata and items
    const completeOrder = {
      ...orderMetadata,
      ...orderItems
    };
    
    // Set the order in the database under ordersusers path
    const ordersUserRef = ref(database, `userorders/${user.uid}/${orderId}`);
    
    // Save the order
    set(ordersUserRef, completeOrder)
      .then(() => {
        // Clear the active cart
        const userActiveCartRef = ref(database, `userscart/${user.uid}`);
        set(userActiveCartRef, null)
          .then(() => {
            // Also clear the userscart reference
            const userCartRef = ref(database, `userscart/${user.uid}`);
            set(userCartRef, null)
              .then(() => {
                // Navigate to Success component after order is placed
                navigate("/success", { 
                  state: { 
                    orderId: orderId,
                    totalAmount: totalAmount.toFixed(2) 
                  } 
                });
              })
              .catch((error) => {
                console.error("Error clearing userscart:", error);
                alert("Order placed but failed to clear cart. Please check your orders.");
              });
          })
          .catch((error) => {
            console.error("Error clearing cart:", error);
            alert("Order placed but failed to clear cart. Please check your orders.");
          });
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        alert("Failed to place order. Please try again.");
      });
  };

  if (loading) {
    return (
      <div className="section-p1">
        <h2>Loading checkout...</h2>
      </div>
    );
  }

  const getImageUrl = (imageId) => {
    // Get the filename from the mapping or use default
    const filename = IMAGE_ID_MAPPING[imageId.toString()] || "unknowenprofile.png";
    
    // Add the leading slash to reference from the public directory
    return `/${filename}`;
  };

  return (
    <div>
      <section id="page-header" className="about-header">
        <h2>#checkout</h2>
        <p>Complete your purchase</p>
      </section>

      <section id="checkout" className="section-p1">
        <div className="checkout-container">
          <div className="shipping-details">
            <h3>Shipping Details</h3>
            <form onSubmit={handlePlaceOrder}>
              <div className="form-group">
                <label htmlFor="username">Full Name</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phno">Phone Number</label>
                <input 
                  type="tel" 
                  id="phno" 
                  name="phno" 
                  value={formData.phno} 
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Delivery Address</label>
                <textarea 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange}
                  required 
                  rows="4"
                ></textarea>
              </div>
              
              <button type="submit" className="normal">Confirm Order</button>
            </form>
          </div>
          
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="item-info">
                    <img 
                      src={getImageUrl(item.productimage)} 
                      alt={item.productname} 
                      className="summary-img" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/unknowenprofile.png"; // Fallback image
                      }}
                    />
                    <div>
                      <h4>{item.productname}</h4>
                      <p>Qty: {item.qty}</p>
                    </div>
                  </div>
                  <div className="item-price">
                    ₹{(parseFloat(item.productamt) * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="summary-total">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="total-row final-total">
                <span>Total</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="section-p1">
        <div className="col">
          <h3>Jasa Essential</h3>
          <h4>Contact</h4>
          <p><strong>Address:</strong> 562 Wellington Road, Street 32, San Francisco</p>
          <p><strong>Phone:</strong> +01 2222 345 / (+91) 0 123 456 789</p>
          <p><strong>Hours:</strong> 10:00 - 18:00, Mon - Sat</p>
          <div className="follow">
            <h4>Follow us</h4>
            <div className="icon">
              <i className="bx bxl-facebook"></i>
              <i className="bx bxl-twitter"></i>
              <i className="bx bxl-instagram"></i>
              <i className="bx bxl-pinterest-alt"></i>
              <i className="bx bxl-youtube"></i>
            </div>
          </div>
        </div>

        <div className="col">
          <h4>About</h4>
          <a href="#">About us</a>
          <a href="#">Delivery Information</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Contact Us</a>
        </div>

        <div className="col">
          <h4>My Account</h4>
          <a href="#">Sign In</a>
          <a href="#">View Cart</a>
          <a href="#">My Wishlist</a>
          <a href="#">Track My Order</a>
          <a href="#">Help</a>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;