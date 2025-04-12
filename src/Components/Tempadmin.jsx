import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { auth } from './firebase';
import "../css/Tempadmin.css";

function Tempadmin() {
  const navigate = useNavigate();
  const location = useLocation();
 
  const getActiveClass = (path) => (location.pathname === path ? "active" : "");
 
  const handleLogout = () => {
    auth.signOut().then(() => {
      // Clear all user data from localStorage
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      localStorage.removeItem("selectedOrder");
      
      // Navigate to login page
      navigate("/login");
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };
 
  
 
  return (
    <div className="tempadmin-container">
      <nav className="tempadmin-navbar">
        <div className="tempadmin-logo">Tempadmin Panel</div>
        <ul className="tempadmin-nav-links">
          <li>
            <Link
              to="/tempadmin/XeroxOrdertempadmin"
              className={getActiveClass("/tempadmin/XeroxOrdertempadmin")}
            >
              XeroxOrder
            </Link>
          </li>
          <li>
            <Link
              to="/tempadmin/OrdersControlatempadmin"
              className={getActiveClass("/tempadmin/OrdersControlatempadmin")}
            >
              Totalorders
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </li>
        </ul>
      </nav>
     
      
      <div className="tempadmin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Tempadmin;