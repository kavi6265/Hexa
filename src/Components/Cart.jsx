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

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
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
    }, 0);
    setTotalAmount(total);
  };

  const handleRemoveItem = (itemId) => {
    if (!user) return;
    
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <h2>Loading your cart...</h2>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <section className="page-header">
        <h2>#cart</h2>
        <p>View your selected items</p>
      </section>

      <section className="cart-container">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <i className="bx bx-cart-alt empty-cart-icon"></i>
            <h2>Your cart is empty</h2>
            <button onClick={() => navigate("/shop")} className="shop-btn">Continue Shopping</button>
          </div>
        ) : (
          <>
            <div className="cart-table-container">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Remove</th>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="cart-item">
                      <td>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="remove-btn"
                          aria-label="Remove item"
                        >
                          <i className="bx bx-x-circle"></i>
                        </button>
                      </td>
                      <td className="product-image">
                        <img 
                          src={getImageResource(item.productimage)} 
                          alt={item.productname} 
                        />
                      </td>
                      <td className="product-name">{item.productname}</td>
                      <td className="product-price">₹{item.productamt}</td>
                      <td>
                        <div className="quantity-control">
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                            className="qty-btn"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="qty-value">{item.qty}</span>
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                            className="qty-btn"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="subtotal">₹{(parseFloat(item.productamt) * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="cart-summary">
              <div className="summary-content">
                <h3>Cart Totals</h3>
                <div className="summary-line">
                  <span>Cart Subtotal</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary-line total">
                  <span>Total</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} className="checkout-btn">
                  Proceed to checkout
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      <footer className="main-footer">
        <div className="footer-col">
          <h3>Jasa Essential</h3>
          <h4>Contact</h4>
          <p><strong>Address:</strong> 562 Wellington Road, Street 32, San Francisco</p>
          <p><strong>Phone:</strong> +01 2222 345 / (+91) 0 123 456 789</p>
          <p><strong>Hours:</strong> 10:00 - 18:00, Mon - Sat</p>
          <div className="social-follow">
            <h4>Follow us</h4>
            <div className="social-icons">
              <i className="bx bxl-facebook"></i>
              <i className="bx bxl-twitter"></i>
              <i className="bx bxl-instagram"></i>
              <i className="bx bxl-pinterest-alt"></i>
              <i className="bx bxl-youtube"></i>
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h4>About</h4>
          <a href="#">About us</a>
          <a href="#">Delivery Information</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
          <a href="#">Contact Us</a>
        </div>

        <div className="footer-col">
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

export default Cart;