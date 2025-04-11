import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { database, auth } from "./firebase"; 
import { ref, push, set, get } from "firebase/database";
import "../css/Home.css";


const REVERSE_IMAGE_MAPPING = {
  "casio991.jpg": "2131230957",
  "caltrix.jpg": "2131230902",
  "graphh.png": "2131230999",
  "xooblack.png": "2131231165",
  "xoblue.png": "2131231164",
  "stylishpenblue.jpg": "2131231144",
  "stylishblackpen.png": "2131231143",
  "athreenotee.jpg": "2131230843",
  "tippencil.png": "2131231148",
  "bipolar.jpg": "2131230882",
  "tipbox.png": "2131231147"
};

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleProductClick = (product) => {
    navigate("/product", { state: { product } });
  };

  // Add useEffect to check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      
      // If user is logged in, fetch their cart items
      if (currentUser) {
        const userCartRef = ref(database, `userscart/${currentUser.uid}`);
        get(userCartRef).then((snapshot) => {
          if (snapshot.exists()) {
            const items = [];
            snapshot.forEach((childSnapshot) => {
              items.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
              });
            });
            setCartItems(items);
          }
        }).catch((error) => {
          console.error("Error fetching cart items:", error);
        });
      } else {
        // Clear cart items when user logs out
        setCartItems([]);
      }
    });
    
    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const isProductInCart = (product) => {
    return cartItems.some(item => item.productname === product.name);
  };

  const getImageIdForFilename = (filename) => {
    // Find the image ID from the reverse mapping
    return REVERSE_IMAGE_MAPPING[filename] || "0"; // Default to "0" if not found
  };

  const showNotificationAlert = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const addToCart = (e, product) => {
    e.stopPropagation(); // Prevent triggering the product click
    e.preventDefault(); // Prevent default anchor behavior
    
    if (!user) {
      showNotificationAlert("Please login to add items to cart");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    
    // Check if product is already in cart
    if (isProductInCart(product)) {
      showNotificationAlert("This product is already in your cart!");
      return;
    }
    
    // Get image ID directly from the reverse mapping using the product's image filename
    const imageId = getImageIdForFilename(product.img);
    
    // If no matching ID was found, log an error
    if (imageId === "0") {
      console.warn(`No image ID found for ${product.img}`);
    }
    
    // Prepare product data for Firebase
    const productData = {
      productname: product.name,
      productimage: parseInt(imageId, 10), // Store the numerical image ID 
      productamt: product.price.replace('₹', ''),
      qty: 1,
      rating: 0,
      discription: `Brand: ${product.brand}, Product: ${product.name}`
    };
    
    console.log(`Adding product with image: ${product.img}, ID: ${imageId}`);
    
    // Get reference to the user's cart
    const userCartRef = ref(database, `userscart/${user.uid}`);
    
    // Create a new unique entry for this product
    const newProductRef = push(userCartRef);
    
    // Set the product data in Firebase
    set(newProductRef, productData)
      .then(() => {
        showNotificationAlert("Product added to cart successfully!");
        // Add the new item to local cart items state to update UI
        setCartItems([...cartItems, { 
          id: newProductRef.key, 
          ...productData 
        }]);
      })
      .catch((error) => {
        console.error("Error adding to cart: ", error);
        showNotificationAlert("Failed to add product to cart. Please try again.");
      });
  };

  return (
    <>
      {showNotification && (
        <div className="notification-popup">
          <p>{notificationMessage}</p>
        </div>
      )}
      
      <section id="main">
        <div className="hero-content">
          <h2 className="fade-in h2" style={{color:"#465b52"}}>Welcome To</h2>
          <h1 className="slide-in h1">Jasa Essential</h1>
          <p className="fade-in-delay">Save more with coupons & up to 70% off!</p>
          <button className="btn pulse" onClick={() => navigate("/shop")}>
            Shop Now <i className="bx bx-right-arrow-alt"></i>
          </button>
        </div>
      </section>

      <section id="feature" className="section-p1">
        {[
          { img: "f1.png", text: "Free Shipping", icon: "bx-package" },
          { img: "f2.png", text: "Online Order", icon: "bx-cart" },
          { img: "f3.png", text: "Save Money", icon: "bx-wallet" },
          { img: "f4.png", text: "Promotions", icon: "bx-gift" },
          { img: "f5.png", text: "Happy Sell", icon: "bx-happy-heart-eyes" },
          { img: "f6.png", text: "24/7 Support", icon: "bx-support" },
        ].map((feature, index) => (
          <div className="fe-box" key={index}>
            <div className="feature-icon">
              <i className={`bx ${feature.icon}`}></i>
            </div>
            <img src={feature.img} alt={feature.text} />
            <h6>{feature.text}</h6>
          </div>
        ))}
      </section>

      <div className="wave-divider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100">
          <path fill="#e3e6f3" fillOpacity="0.4" d="M0,32L48,48C96,64,192,96,288,96C384,96,480,64,576,48C672,32,768,32,864,48C960,64,1056,96,1152,96C1248,96,1344,64,1392,48L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>

      <section id="product1" className="section-p1">
        <h2>Featured Products</h2>
        <p>Essential Stationery for Every Student</p>
        <div className="pro-container">
          {[
            {
              img: "casio991.jpg",
              brand: "Casio",
              name: "FX-991MS Scientific Calculator",
              price: "₹1165",
            },
            {
              img: "caltrix.jpg",
              brand: "Caltrix",
              name: "CX-991S Scientific Calculator",
              price: "₹600",
            },
            {
              img: "graphh.png",
              brand: "SVE SIDDHI VINAYAK ENTERPRISES",
              name: "Graph Notebook - A4 Size, 100 Pages",
              price: "₹100",
            },
            {
              img: "xooblack.png",
              brand: "Hauser",
              name: "XO Ball Pen - Black Ink",
              price: "₹10",
            },
            {
              img: "xoblue.png",
              brand: "Hauser",
              name: "XO Ball Pen - Blue Ink",
              price: "₹10",
            },
            {
              img: "stylishpenblue.jpg",
              brand: "Stylish",
              name: "X3 Ball Pen - Blue (0.7mm)",
              price: "₹7",
            },
            {
              img: "stylishblackpen.png",
              brand: "Stylish",
              name: "X3 Ball Pen - Black (0.7mm)",
              price: "₹7",
            },
            {
              img: "athreenotee.jpg",
              brand: "Jasa Essential",
              name: "A3 Drawing Book",
              price: "₹80",
            },
            {
              img: "tippencil.png",
              brand: "Faber-Castell",
              name: "Tri-Click Mechanical Pencil 0.7mm",
              price: "₹15",
            },
            {
              img: "bipolar.jpg",
              brand: "Jasa Essential",
              name: "Bipolar Graph Book (100 sheets)",
              price: "₹100",
            },
            {
              img: "tipbox.png",
              brand: "Camlin Kokuyo",
              name: "0.7mm B Lead Tube",
              price: "₹20",
            },
          ].map((product, index) => {
            // Define inCart variable here for each product
            const inCart = isProductInCart(product);
            
            return (
              <div
                className="pro"
                key={index}
                onClick={() => handleProductClick(product)}
              >
                <div className="product-img-container">
                  <img className="product-img" src={product.img} alt={product.name} />
                  {inCart && <div className="in-cart-indicator">In Cart</div>}
                </div>
                <div className="des">
                  <span className="brand">{product.brand}</span>
                  <h5 className="product-name">{product.name}</h5>
                  <div className="price-cart-container">
                    <h4 className="price">{product.price}</h4>
                    <button 
                      className={`cart-btn ${inCart ? 'in-cart' : ''}`}
                      onClick={(e) => addToCart(e, product)}
                    >
                      <i className={`bx ${inCart ? 'bx-check' : 'bx-cart'}`}></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="newsletter-section">
        <div className="newsletter-content">
          <h3>Subscribe To Our Newsletter</h3>
          <p>Get updates on new products and special offers</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>
      </div>

      <footer className="section-p1">
        <div className="footer-content">
          <div className="col company-info">
            <h3>Jasa Essential</h3>
            <h4>Contact</h4>
            <p>
              <i className="bx bx-map"></i>
              <strong>Address:</strong> 562 Wellington Road, Street 32, San Francisco
            </p>
            <p>
              <i className="bx bx-phone"></i>
              <strong>Phone:</strong> +01 2222 345 / (+91) 0 123 456 789
            </p>
            <p>
              <i className="bx bx-time"></i>
              <strong>Hours:</strong> 10:00 - 18:00, Mon - Sat
            </p>
            <div className="follow">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <a href="#"><i className="bx bxl-facebook"></i></a>
                <a href="#"><i className="bx bxl-twitter"></i></a>
                <a href="#"><i className="bx bxl-instagram"></i></a>
                <a href="#"><i className="bx bxl-pinterest-alt"></i></a>
                <a href="#"><i className="bx bxl-youtube"></i></a>
              </div>
            </div>
          </div>

          <div className="col">
            <h4>About</h4>
            <ul>
              <li><a href="#">About us</a></li>
              <li><a href="#">Delivery Information</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms & Conditions</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          <div className="col">
            <h4>My Account</h4>
            <ul>
              <li><a href="#">Sign In</a></li>
              <li><a href="#">View Cart</a></li>
              <li><a href="#">My Wishlist</a></li>
              <li><a href="#">Track My Order</a></li>
              <li><a href="#">Help</a></li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <p>© 2025 Jasa Essential - All Rights Reserved</p>
        </div>
      </footer>
    </>
  );
}

export default Home;