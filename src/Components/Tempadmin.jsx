import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth, database } from './firebase';
import { signOut } from 'firebase/auth';

import "../css/Tempadmin.css";

function Tempadmin() {
  const navigate = useNavigate();
  const location = useLocation();
  

  const getActiveClass = (path) => (location.pathname === path ? "active" : "");

  

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout error', error);
      });
  };

  return (
    <div className="tempadmin-container">
      <nav className="tempadmin-navbar">
        <div className="tempadmin-logo">Tempadmin Panel</div>
        <ul className="tempadmin-nav-links">
          <li>
            <Link 
              to="/tempadmin/orders" 
              className={getActiveClass("/tempadmin/orders")}
            >
              Orders
            </Link>
          </li>
          <li>
          <Link 
              to="/tempadmin/orders" 
              className={getActiveClass("/tempadmin/orders")}
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
    </div>
  );
}

export default Tempadmin;