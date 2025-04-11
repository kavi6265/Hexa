import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getDatabase, ref as dbRef, set, get, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import "../css/Payment.css";

function Payment() {
  const [address, setAddress] = useState("");
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderInfo, setOrderInfo] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const database = getDatabase();
  
  useEffect(() => {
    // Get order info from navigation state
    if (location.state && location.state.orderInfo) {
      setOrderInfo(location.state.orderInfo);
      setTotalAmount(location.state.orderInfo.totalCost);
    } else {
      // If no order info is available, try to get from sessionStorage or redirect
      const storedTotalCost = sessionStorage.getItem('totalCost');
      if (storedTotalCost) {
        setTotalAmount(parseFloat(storedTotalCost));
      } else {
        navigate('/xerox');
        return;
      }
    }
    
    // Fetch user's address from database
    fetchUserAddress();
  }, [location, navigate]);
  
  const fetchUserAddress = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError("User not authenticated. Please login again.");
        return;
      }
      
      const userRef = dbRef(database, `users/${userId}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.address) {
          setAddress(userData.address);
        }
      }
    } catch (error) {
      console.error("Error fetching user address:", error);
      setError("Failed to load address. Please enter it manually.");
    }
  };
  
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    // Update database with new address (debounce this in a real app)
    updateAddressInDatabase(e.target.value);
  };
  
  const updateAddressInDatabase = async (newAddress) => {
    if (!newAddress.trim()) return;
    
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      
      const userRef = dbRef(database, `users/${userId}`);
      await update(userRef, { address: newAddress });
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };
  
  const handleGoBack = () => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to go back to the main screen?")) {
      navigate('/');
    }
  };
  
  const handleConfirmOrder = async () => {
    // Validate inputs
    if (!validateInputs()) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError("User not authenticated. Please login again.");
        setIsLoading(false);
        return;
      }
      
      const orderId = orderInfo?.orderId || "order_" + Date.now().toString().substring(0, 9);
      
      // Create order details object
      const orderDetails = {
        orderId: orderId,
        userId: userId,
        address: address,
        totalAmount: totalAmount,
        paidAmount: 0,
        balanceAmount: totalAmount,
        timestamp: Date.now()
      };
      
      // Save order details to database
      const orderScreenshotsRef = dbRef(database, `uploadscreenshots/${orderId}`);
      await set(orderScreenshotsRef, orderDetails);
      
      // Update paid status for all files
      updatePaidStatusForAllFiles(orderId);
      
      // Navigate to success page
      navigate('/success');
    } catch (error) {
      console.error("Error placing order:", error);
      setError(`Failed to place order: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updatePaidStatusForAllFiles = async (orderId) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
      
      const filesRef = dbRef(database, `pdfs/${userId}/${orderId}`);
      const snapshot = await get(filesRef);
      
      if (snapshot.exists()) {
        snapshot.forEach((fileSnapshot) => {
          update(fileSnapshot.ref, { paid: true });
        });
      }
    } catch (error) {
      console.error("Error updating paid status:", error);
    }
  };
  
  const validateInputs = () => {
    if (!address.trim()) {
      setError("Address cannot be empty");
      return false;
    }
    
    if (!isAddressSelected) {
      setError("Please select the address");
      return false;
    }
    
    return true;
  };
  
  return (
    <div className="payment-container">
      <div className="header">
        <button className="back-button" onClick={handleGoBack}>
          ←
        </button>
        <h1 className="title">Payment</h1>
      </div>
      
      <div className="payment-content">
        <div className="amount-section">
          <h2>Grand Total</h2>
          <div className="amount">₹ {totalAmount.toFixed(2)}</div>
        </div>
        
        <div className="address-section">
          <h3>Delivery Address</h3>
          <textarea
            className="address-input"
            value={address}
            onChange={handleAddressChange}
            placeholder="Enter your delivery address"
            rows={4}
          />
          
          <div className="address-confirm">
            <input
              type="checkbox"
              id="confirmAddress"
              checked={isAddressSelected}
              onChange={() => setIsAddressSelected(!isAddressSelected)}
            />
            <label htmlFor="confirmAddress">Confirm this address for delivery</label>
          </div>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <button
          className="order-button"
          onClick={handleConfirmOrder}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}

export default Payment;