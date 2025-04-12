import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import { auth, database } from "./Components/firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import Home from "./Components/Home";
import Shop from "./Components/Shop";
import Xerox from "./Components/Xerox";
import About from "./Components/About";
import Contact from "./Components/Contact";
import OrderedProductpreviewadmin from "./Components/OrderedProductpreviewadmin";
import Cart from "./Components/Cart";
import Login from "./Components/Login";
import XeroxOrderpreviewtempadmin from "./Components/XeroxOrderpreviewtempadmin";
import EditProfile from "./Components/EditProfile";
import Signup from "./Components/Signup";
import OrdersControlatempadmin from "./Components/OrdersControlatempadmin";
import Success from "./Components/Succes";
import ProductView from "./Components/ProductView";
import XeroxOrdertempadmin from "./Components/XeroxOrdertempadmin";
import OrdersControldmin from "./Components/OrdersControldmin";
import Admin from "./Components/Admin";
import Orders from "./Components/Orders";

import Tempadmincontrol from "./Components/Tempadmincontrol";
import Checkout from "./Components/Checkout";
import Profile from "./Components/Profile";
import ProductOrderUser from "./Components/ProductOrderUser";
import OrderDetail from "./Components/OrdersDetails";
import Tempadmin from "./Components/Tempadmin";
import ConfirmOrder from "./Components/ConfirmOrder";
import OrderedProductpreview from "./Components/OrderedProductpreview";
import Payment from "./Components/Payment"; 
import "./css/index.css";
import XeroxOrderUser from "./Components/XeroxOrdersuser";
import Xeroxorderpreview from "./Components/Xeroxoderpreview";

// Navbar component
function Navbar({ user, profileImageUrl }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Ref for clicking outside to close menu
  const navbarRef = useRef(null);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside navbar
  useEffect(() => {
    function handleClickOutside(event) {
      if (navbarRef.current && !navbarRef.current.contains(event.target) && isMenuOpen) {
        closeMenu();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);
  
  const getActiveClass = (path) => (location.pathname === path ? "active" : "");

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="header-logo">
          <h3>Jasa Essential</h3>
        </div>
        
        <div ref={navbarRef} className="navbar-container">
          <nav className={`navbar ${isMenuOpen ? "active" : ""}`}>
            <div className="menu-header">
              <h4>Menu</h4>
              <button className="close-btn" onClick={closeMenu}>
                <i className="bx bx-x"></i>
              </button>
            </div>
            
            <div className="nav-actions">
              <ul className="nav-links">
                <li>
                  <Link to="/home" className={getActiveClass("/home")}>
                    <i className="bx bx-home-alt"></i>
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className={getActiveClass("/shop")}>
                    <i className="bx bx-store"></i>
                    <span>Shop</span>
                  </Link>
                </li>
                <li>
                  <Link to="/xerox" className={getActiveClass("/xerox")}>
                    <i className="bx bx-copy"></i>
                    <span>Xerox</span>
                  </Link>
                </li>
              </ul>
              <div className="cart-pro">
                <Link to="/cart" className={`cart-icon ${getActiveClass("/cart")}`}>
                  <i className="bx bx-shopping-bag"></i>
                </Link>
                
                <Link to="/profile" className={`profile-link ${getActiveClass("/profile")}`}>
                  <img
                    src={profileImageUrl || "person3.jpg"}
                    alt="Profile"
                    className="profile-image"
                  />
                </Link>
              </div>
            </div>
          </nav>
          
          {isMenuOpen && <div className="navbar-backdrop" onClick={closeMenu}></div>}
        </div>
        
        <div className="mobile-controls">
          <Link to="/cart" className="mobile-cart">
            <i className="bx bx-shopping-bag"></i>
          </Link>
          <button className="menu-toggle" onClick={toggleMenu}>
            <i className="bx bx-menu"></i>
          </button>
        </div>
      </div>
    </header>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [userRole, setUserRole] = useState("user"); // Default role
  const [loading, setLoading] = useState(true);
  const [tempAdmins, setTempAdmins] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Hardcoded admin emails
  const admins = ["saleem1712005@gmail.com", "jayaraman00143@gmail.com", "abcd1234@gmail.com"];

  // Fetch user profile data including profile image URL
  const fetchUserProfile = (userId) => {
    const db = getDatabase();
    const userRef = ref(db, `users/${userId}`);
    
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData && userData.profileImageUrl) {
        setProfileImageUrl(userData.profileImageUrl);
      } else {
        setProfileImageUrl(null); 
      }
    }, (error) => {
      console.error("Error fetching user profile:", error);
      setProfileImageUrl(null);
    });
  };

  // Fetch current temp admins from Firebase
  const fetchTempAdmins = () => {
    const tempAdminsRef = ref(database, "tempadmin");
    
    onValue(tempAdminsRef, (snapshot) => {
      const tempAdminsList = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const tempAdminEmail = childSnapshot.child("email").val();
          if (tempAdminEmail) {
            tempAdminsList.push(tempAdminEmail.toLowerCase());
          }
        });
      }
      setTempAdmins(tempAdminsList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching temp admins:", error);
      setLoading(false);
    });
  };

  // Fetch temp admins on initial load
  useEffect(() => {
    fetchTempAdmins();
  }, []);

  // Determine user role based on email
  const determineUserRole = (email) => {
    const lowerEmail = email.toLowerCase();
    if (admins.includes(lowerEmail)) {
      return "admin";
    } else if (tempAdmins.includes(lowerEmail)) {
      return "tempadmin";
    } else {
      return "user";
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem("userEmail", currentUser.email);
        localStorage.setItem("userId", currentUser.uid);
        
        // Fetch the user's profile data including profile image
        fetchUserProfile(currentUser.uid);
        
        // Always fetch the latest temp admin list when determining role
        const tempAdminsRef = ref(database, "tempadmin");
        
        onValue(tempAdminsRef, (snapshot) => {
          const tempAdminsList = [];
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              const tempAdminEmail = childSnapshot.child("email").val();
              if (tempAdminEmail) {
                tempAdminsList.push(tempAdminEmail.toLowerCase());
              }
            });
          }
          
          setTempAdmins(tempAdminsList);
          
          // Use the fresh temp admin list to determine role
          const lowerEmail = currentUser.email.toLowerCase();
          const role = admins.includes(lowerEmail) 
            ? "admin" 
            : tempAdminsList.includes(lowerEmail)
              ? "tempadmin"
              : "user";
              
          setUserRole(role);
          localStorage.setItem("userRole", role);
          
          // Correctly route users based on their role
          if (location.pathname === "/login" || location.pathname === "/signup") {
            const routeToNavigate = 
              role === "admin" ? "/admin" :
              role === "tempadmin" ? "/tempadmin" : 
              "/home";
            navigate(routeToNavigate);
          }
        });
      } else {
        setUser(null);
        setProfileImageUrl(null);
        setUserRole("user");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userId");
        localStorage.removeItem("userRole");
        
        if (!["/login", "/signup"].includes(location.pathname)) {
          navigate("/login");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  // Check for stored user data on initial load - FIXED VERSION
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    const storedUserId = localStorage.getItem("userId");
    const storedRole = localStorage.getItem("userRole");
    
    if (storedEmail && storedUserId) {
      setUser({ email: storedEmail, uid: storedUserId });
      
      // Fetch profile image
      fetchUserProfile(storedUserId);
      
      // Always fetch the latest temp admin list to determine current role
      const tempAdminsRef = ref(database, "tempadmin");
      
      onValue(tempAdminsRef, (snapshot) => {
        const tempAdminsList = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const tempAdminEmail = childSnapshot.child("email").val();
            if (tempAdminEmail) {
              tempAdminsList.push(tempAdminEmail.toLowerCase());
            }
          });
        }
        
        setTempAdmins(tempAdminsList);
        
        // Use the fresh temp admin list to determine role
        const lowerEmail = storedEmail.toLowerCase();
        const role = admins.includes(lowerEmail) 
          ? "admin" 
          : tempAdminsList.includes(lowerEmail)
            ? "tempadmin"
            : "user";
            
        setUserRole(role);
        localStorage.setItem("userRole", role);
        
        // Critical fix: navigate based on role when the app first loads
        if (!["/login", "/signup"].includes(location.pathname)) {
          // Don't redirect if we're on login or signup
          
          // Check if user is on the correct dashboard based on their role
          const isAdminOnAdminRoute = role === "admin" && location.pathname.startsWith("/admin");
          const isTempAdminOnTempRoute = role === "tempadmin" && location.pathname.startsWith("/tempadmin");
          const isUserOnUserRoute = role === "user" && !["/admin", "/tempadmin"].some(prefix => location.pathname.startsWith(prefix));
          
          // If not on the correct route for their role, redirect them
          if (!isAdminOnAdminRoute && !isTempAdminOnTempRoute && !isUserOnUserRoute) {
            const routeToNavigate = 
              role === "admin" ? "/admin" :
              role === "tempadmin" ? "/tempadmin" : 
              "/home";
            navigate(routeToNavigate);
          }
        }
        
        setLoading(false);
      });
    } else {
      setLoading(false);
      // No user data in localStorage, ensure we're on login/signup
      if (!["/login", "/signup"].includes(location.pathname)) {
        navigate("/login");
      }
    }
  }, [navigate, location.pathname]);

  // Function to check if the current route should show navbar
  const shouldShowNavbar = () => {
    // Only show navbar for regular users (not admin/tempadmin)
    if (userRole !== "user") {
      return false;
    }
    
    // Don't show navbar on login/signup pages
    if (["/login", "/signup"].includes(location.pathname)) {
      return false;
    }
    
    // Don't show navbar on admin/tempadmin routes
    if (location.pathname.startsWith("/admin") || location.pathname.startsWith("/tempadmin")) {
      return false;
    }
    
    return true;
  };

  if (loading) {
    return <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>;
  }

  return (
    <>
      {/* Only show navbar for regular users on appropriate routes */}
      {user && shouldShowNavbar() && (
        <Navbar user={user} profileImageUrl={profileImageUrl} />
      )}

      <Routes>
        <Route 
          path="/" 
          element={user ? (
            userRole === "admin" ? <Navigate to="/admin" /> : 
            userRole === "tempadmin" ? <Navigate to="/tempadmin" /> : 
            <Home />
          ) : <Login />} 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/product" element={<ProductView />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-detail/:id" element={<OrderDetail />} />
        <Route 
          path="/home" 
          element={user ? (
            userRole === "admin" ? <Navigate to="/admin" /> : 
            userRole === "tempadmin" ? <Navigate to="/tempadmin" /> : 
            <Home />
          ) : <Login />} 
        />
        <Route path="/shop" element={user ? <Shop /> : <Login />} />
        <Route path="/success" element={user ? <Success /> : <Login />} />
        <Route path="/edit-profile" element={user ? <EditProfile /> : <Login />} />
        <Route path="/xerox" element={user ? <Xerox /> : <Login />} />
        <Route path="/payment" element={user ? <Payment /> : <Login />} />
        <Route path="/xeroxordersuser" element={user ? <XeroxOrderUser /> : <Login />} />
        <Route path="/OrderedProductpreview/:userId/:orderId" element={user ? <OrderedProductpreview /> : <Login />} />
        <Route path="/confirm-order" element={user ? <ConfirmOrder /> : <Login />} />
        <Route path="/ProductOrderUser" element={user ? <ProductOrderUser /> : <Login />} />
        <Route path="/about" element={user ? <About /> : <Login />} />
        <Route path="/Xeroxorderpreview" element={user ? <Xeroxorderpreview /> : <Login />} />
        <Route path="/contact" element={user ? <Contact /> : <Login />} />
        <Route path="/cart" element={user ? <Cart /> : <Login />} />
        <Route path="/profile" element={user ? <Profile /> : <Login />} />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={userRole === "admin" ? <Admin /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/admin/orders" replace />} />
          <Route path="orders" element={<Orders />} />
          <Route path="OrderedProductpreviewadmin/:userId/:orderId" element={<OrderedProductpreviewadmin />} />
          <Route path="tempadmincontrol" element={<Tempadmincontrol />} />
          <Route path="OrdersControldmin" element={<OrdersControldmin />} />
          
        </Route>

        {/* Temp Admin Routes */}
        <Route
          path="/tempadmin"
          element={userRole === "tempadmin" ? <Tempadmin /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/tempadmin/XeroxOrdertempadmin" replace />} />
          <Route path="XeroxOrdertempadmin" element={<XeroxOrdertempadmin />} />
          <Route path="XeroxOrderpreviewtempadmin/:userId/:orderId/:gt" element={<XeroxOrderpreviewtempadmin />} />
          <Route path="OrdersControlatempadmin" element={<OrdersControlatempadmin />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;