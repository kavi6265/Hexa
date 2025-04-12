import { useState, useEffect } from "react";
import { auth, database } from "./firebase";
import { useNavigate, useLocation, Link, Outlet } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import "../css/Admin.css"

function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const [userName, setUserName] = useState("");

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
          else{

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

  function getActiveClass(path) {
    return location.pathname === path ? "active" : "";
  }

  return (
    <>
      <section id="header">
        <h2>Jasa Essential</h2>
        <div>
          <ul id="navbar">
            <li>
              <Link to="/admin/orders" className={getActiveClass("/admin/orders")}>
                Orders
              </Link>
            </li>
            <li>
              <Link to="/admin/tempadmincontrol" className={getActiveClass("/admin/tempadmincontrol")}>
                Temp Admin Control
              </Link>
            </li>
            <li>
              <Link to="/admin/OrdersControldmin" className={getActiveClass("/admin/OrdersControldmin")}>
                OrdersControldmin
              </Link>
            </li>
            
            <li className="profile-container">
              <div className="profile-wrapper" onClick={toggleLogoutDropdown}>
                <img
                  src={profileImageUrl || "/person3.jpg"}
                  alt="Admin Profile"
                  className="admin-profile-image"
                />
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
            </li>
          </ul>
        </div>
      </section>

      {/* Nested Components will be rendered here */}
      <section id="admin-content">
        <Outlet />
      </section>
    </>
  );
}

export default Admin;