import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { auth, database } from "./firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ref, onValue } from "firebase/database";
import "../css/Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  
  const admins = ["saleem1712005@gmail.com", "jayaraman00143@gmail.com", "abcd1234@gmail.com"];
  const [tempAdmins, setTempAdmins] = useState([]);

  // Fetch temp admins from Firebase on component mount
  useEffect(() => {
    const tempAdminsRef = ref(database, "tempadmin");
    
    onValue(tempAdminsRef, (snapshot) => {
      const tempAdminsList = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const tempAdminEmail = childSnapshot.child("email").val();
          if (tempAdminEmail) {
            console.log(tempAdminEmail);
            tempAdminsList.push(tempAdminEmail);
          }
        });
      }
      setTempAdmins(tempAdminsList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching temp admins:", error);
      setLoading(false);
    });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter all details");
      setMessageType("error");
      setTimeout(() => setMessage(""), 4000);
      return;
    }

    if (password.length < 6) {
      setMessage("Incorrect Password");
      setMessageType("error");
      setTimeout(() => setMessage(""), 4000);
      return;
    }

    
    setMessage("Logging in, please wait...");
    setMessageType("loading");

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setMessage("Login Successful! Redirecting...");
        setMessageType("success");
        
        // Determine user type based on email
        let userType = "user";
        
        // First check if the email is in the admins list
        if (admins.includes(email.toLowerCase())) {
          userType = "admin";
        } 
        // Then check if the email is in the tempAdmins list
        else if (tempAdmins.includes(email.toLowerCase())) {
          userType = "tempadmin";
        }
        
        // Navigate based on user type
        setTimeout(() => {
          // Only call onLogin if it's a function
          if (typeof onLogin === 'function') {
            onLogin();
          }
          
          if (userType === "admin") {
            navigate("/admin");
          } else if (userType === "tempadmin") {
            navigate("/tempadmin");
          } else {
            navigate("/home");
          }
        }, 1000);
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
          setMessage("Invalid email or password. Please try again.");
        } else if (error.code === "auth/invalid-credential") {
          setMessage("Invalid password or Email. Please try again.");
        } else {
          setMessage("Login failed. Please try again.");
        }
        setMessageType("error");
        setTimeout(() => setMessage(""), 4000);
      });
  };

  const handleForgotPassword = () => {
    setShowResetModal(true);
  };

  const handleResetPassword = () => {
    if (!resetEmail) {
      setMessage("Please enter your registered email");
      setMessageType("error");
      setTimeout(() => setMessage(""), 4000);
      return;
    }

    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        setMessage("Check your email");
        setMessageType("success");
        setShowResetModal(false);
        setTimeout(() => setMessage(""), 4000);
      })
      .catch((error) => {
        setMessage("Unable to send, failed");
        setMessageType("error");
        setTimeout(() => setMessage(""), 4000);
      });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="loginbox">
      <form className="loginbox1" onSubmit={handleLogin}>
        <h2 className="loginh1">Login</h2>

        <input
          className="logininput"
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-container">
          <input
            className="logininput"
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="show">
          <label className="show-password">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            Show Password
          </label>
          <p className="forgotpasswordlink" onClick={handleForgotPassword}>
            Forgot Password?
          </p>
        </div>

        <button type="submit" className="loginbutton">
          Login
        </button>

        {message && (
          <div className={`loginmessage ${messageType}`}>{message}</div>
        )}

        <p className="signup-link">
          Don't have an account?
          <span
            className="signup-text"
            onClick={() => navigate("/signup")}
            style={{
              color: "blue",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "16px",
            }}
          >
            Create Account
          </span>
        </p>
      </form>

      {showResetModal && (
        <div className="reset-modal">
          <div className="reset-modal-content">
            <h4>Reset Password</h4>
            <input
              type="email"
              placeholder="Enter your email for reset"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="reset-email-input"
            />
            <div className="reset-buttons">
              <button className="reset-button" onClick={handleResetPassword}>
                Reset
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;