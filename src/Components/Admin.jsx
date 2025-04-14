import { useState, useEffect } from "react";
import { auth, database } from "./firebase";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import "../css/Admin.css";

function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Get current user
    const user = auth.currentUser;
    if (user) {
      // Fetch user profile data including profile image URL
      const userRef = ref(database, `admins/${user.uid}`);
     
      onValue(userRef, (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          if (userData.profileImageUrl) {
            setProfileImageUrl(userData.profileImageUrl);
          }
          if (userData.name) {
            setUserName(userData.name);
          }
        }
      });
    }
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      // Clear all user data from localStorage
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
     
      // Navigate to login page
      navigate("/login");
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  const toggleLogoutDropdown = () => {
    setShowLogoutDropdown(!showLogoutDropdown);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/admin/Profileadmin");
    closeMenu();
    setShowLogoutDropdown(false);
  };

  function getActiveClass(path) {
    return location.pathname === path ? "active" : "";
  }

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <>
      <header className="header-container">
        <div className="header-content">
          <div className="header-logo">
            <h3>Jasa Essential</h3>
          </div>

          <div className="navbar-container">
            <nav className={`navbar ${isMenuOpen ? "active" : ""}`}>
              <div className="menu-header">
                <h4>Admin Menu</h4>
                <button className="close-btn" onClick={closeMenu}>
                  <i className="bx bx-x"></i>
                </button>
              </div>

              <div className="nav-actions">
                <ul className="nav-links">
                  <li>
                    <Link to="/admin/orders" className={getActiveClass("/admin/orders")}>
                      <i className="bx bx-package"></i>
                      <span>Orders</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/tempadmincontrol" className={getActiveClass("/admin/tempadmincontrol")}>
                      <i className="bx bx-user-check"></i>
                      <span>Admin Control</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/OrdersControldmin" className={getActiveClass("/admin/OrdersControldmin")}>
                      <i className="bx bx-list-ul"></i>
                      <span>Total Orders</span>
                    </Link>
                  </li>
                </ul>
                <div className="cart-pro">
                  <div className="profile-link-container">
                    <div className="profile-link" onClick={handleProfileClick}>
                      <img
                        src={profileImageUrl || "/person3.jpg"}
                        alt="Admin Profile"
                        className="profile-image"
                      />
                    </div>
                    {showLogoutDropdown && (
                      <div className="logout-dropdown">
                        <div className="user-info">
                          <span className="user-name">{userName || "Admin"}</span>
                          <span className="user-role">Administrator</span>
                        </div>
                        <div className="dropdown-divider"></div>
                        <button onClick={handleLogout} className="logout-dropdown-btn">
                          <i className="bx bx-log-out"></i> Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </nav>

            {isMenuOpen && (
              <div className="navbar-backdrop" onClick={closeMenu}></div>
            )}
          </div>

          <div className="mobile-controls">
            <div className="profile-container" onClick={toggleLogoutDropdown}>
              <img
                src={profileImageUrl || "/person3.jpg"}
                alt="Admin Profile"
                className="profile-image"
              />
            </div>
            <button className="menu-toggle" onClick={toggleMenu}>
              <i className="bx bx-menu"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Nested Components will be rendered here */}
      <section id="admin-content">
        <Outlet />
      </section>
    </>
  );
}

export default Admin;