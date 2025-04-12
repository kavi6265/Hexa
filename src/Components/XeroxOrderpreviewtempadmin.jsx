import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, get, update } from 'firebase/database';
import '../css/XeroxOrderpreviewtempadmin.css';
import { useParams } from 'react-router-dom';


function XeroxOrderpreviewtempadmin() {
    const { userId, orderId, gt } = useParams();
  const [orderDetails, setOrderDetails] = useState({
    orderId: '',
    grandTotal: '',
    username: '',
    deliveryAmount: '',
    paid: false,
    delivered: false,
    address: '',
    userId: ''
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const auth = getAuth();
  const database = getDatabase();
  
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          // Redirect to login if not authenticated
          window.location.href = '/login';
          return;
        }
        
        // Get URL parameters
        
const grandTotal = gt || '0'; // Default to '0' if not provided

console.log("OrderID:", orderId);
console.log("UserID:", userId);
console.log("Grand Total:", grandTotal);

        
        if (!orderId || !userId) {
          console.error("Missing required parameters. OrderID:", orderId, "UserID:", userId);
          // Don't redirect, just show empty state
        }
        
        // Set initial order details with values from URL parameters
        setOrderDetails({
          orderId: orderId || '',
          grandTotal: grandTotal || '0',
          username: '',
          deliveryAmount: '',
          paid: false,
          delivered: false,
          address: '',
          userId: userId || ''
        });
        
        if (userId && orderId) {
          // Fetch order details from Firebase
          const pdfsRef = ref(database, `pdfs/${userId}/${orderId}`);
          const pdfsSnapshot = await get(pdfsRef);
          
          // Fetch address from uploadscreenshots reference
          const uploadScreenshotsRef = ref(database, `uploadscreenshots/${orderId}`);
          const uploadScreenshotsSnapshot = await get(uploadScreenshotsRef);
          
          let address = '';
          if (uploadScreenshotsSnapshot.exists()) {
            const screenshotData = uploadScreenshotsSnapshot.val();
            address = screenshotData.address || '';
          }
          
          const filesList = [];
          let firstFile = null;
          
          if (pdfsSnapshot.exists()) {
            pdfsSnapshot.forEach((fileSnapshot) => {
              const fileData = fileSnapshot.val();
              
              // Save the first file data to extract common order details
              if (!firstFile) {
                firstFile = fileData;
                
                // Update order details from first file
                setOrderDetails({
                  orderId: orderId || '',
                  grandTotal: fileData.grandTotal0 || grandTotal,
                  username: fileData.username || 'User',
                  deliveryAmount: fileData.deliveyamt0 || 'Free',
                  paid: fileData.paid || false,
                  delivered: fileData.delivered || false,
                  address: address,
                  userId: userId || ''
                });
              }
              
              filesList.push({
                id: fileSnapshot.key,
                name: fileData.name0 || '',
                uri: fileData.uri0 || '',
                copies: fileData.qty0 || 1,
                pages: fileData.pages0 || 1,
                printType: fileData.color0 || 'Black & White',
                format: fileData.format0 || 'Single Side',
                sheet: fileData.sheet0 || 'A4',
                ratio: fileData.ratio0 || '1:1',
                pricePerPage: fileData.perpage0 || 0,
                finalAmount: fileData.finalamt0 || 0,
                uploadTime: fileData.uploadTime || 0,
                notes: fileData.notes || '',
                spiral: fileData.spiral || false
              });
            });
          }
          
          setFiles(filesList);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, []);
  
  // Function to handle marking order as delivered
  const handleMarkAsDelivered = async () => {
    try {
      setUpdating(true);
      const { orderId, userId } = orderDetails;
      
      if (!orderId || !userId) {
        alert('Order information is incomplete');
        return;
      }
      
      // Update the delivered status for all files in this order
      const updates = {};
      
      // Get all file references in this order
      const pdfsRef = ref(database, `pdfs/${userId}/${orderId}`);
      const pdfsSnapshot = await get(pdfsRef);
      
      if (pdfsSnapshot.exists()) {
        pdfsSnapshot.forEach((fileSnapshot) => {
          updates[`pdfs/${userId}/${orderId}/${fileSnapshot.key}/delivered`] = true;
        });
        
        // Perform the update
        await update(ref(database), updates);
        
        // Update local state
        setOrderDetails(prev => ({
          ...prev,
          delivered: true
        }));
        
        alert('Order marked as delivered successfully!');
      } else {
        alert('No files found for this order');
      }
    } catch (error) {
      console.error('Error marking order as delivered:', error);
      alert('Failed to mark order as delivered: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };
  
  // Function to handle individual file download
  const handleDownloadPDF = (file) => {
    const link = document.createElement('a');
    link.href = file.uri;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="xerox-preview-container">
      <div className="preview-header">
        <h2>Order Details (Admin View)</h2>
      </div>
      
      <div className="order-summary">
        <div className="order-details-grid">
          <div className="order-detail-item">
            <span>Order ID:</span> {orderDetails.orderId}
          </div>
          <div className="order-detail-item">
            <span>Customer:</span> {orderDetails.username}
          </div>
          <div className="order-detail-item">
            <span>Delivery:</span> {orderDetails.deliveryAmount}
          </div>
          <div className="order-detail-item">
            <span>Status:</span> 
            <span className={`status-badge ${orderDetails.delivered ? 'delivered' : 'pending'}`}>
              {orderDetails.delivered ? 'Delivered' : 'Pending'}
            </span>
          </div>
          <div className="order-detail-item address-item">
            <span>Delivery Address:</span> {orderDetails.address || 'Not provided'}
          </div>
        </div>
        
        {/* Admin Actions Section */}
        <div className="admin-actions">
          <button 
            className={`admin-action-button ${orderDetails.delivered ? 'disabled' : ''}`}
            onClick={handleMarkAsDelivered}
            disabled={orderDetails.delivered || updating}
          >
            {updating ? 'Updating...' : orderDetails.delivered ? 'Already Delivered' : 'Mark as Delivered'}
          </button>
        </div>
      </div>
      
      {files.length === 0 ? (
        <div className="no-files-message">
          <p>No files found for this order</p>
        </div>
      ) : (
        <div className="files-container">
          <div className="files-list">
            {files.map((file, index) => (
              <div key={file.id || index} className="file-item">
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="upload-time">Uploaded: {formatDate(file.uploadTime)}</div>
                  
                  <div className="file-details">
                    <div className="detail-item">
                      <span>Pages:</span> {file.pages}
                    </div>
                    <div className="detail-item">
                      <span>Copies:</span> {file.copies}
                    </div>
                    <div className="detail-item">
                      <span>Print:</span> {file.printType}
                    </div>
                    <div className="detail-item">
                      <span>Format:</span> {file.format}
                    </div>
                    <div className="detail-item">
                      <span>Sheet:</span> {file.sheet}
                    </div>
                    <div className="detail-item">
                      <span>Ratio:</span> {file.ratio}
                    </div>
                    <div className="detail-item">
                      <span>Price/Page:</span> ₹{file.pricePerPage}
                    </div>
                    <div className="detail-item">
                      <span>Amount:</span> ₹{file.finalAmount}
                    </div>
                    <div className="detail-item">
                      <span>Spiral Binding:</span> {file.spiral ? "Yes" : "No"}
                    </div>
                  </div>
                  
                  {file.notes && (
                    <div className="file-notes">
                      <span>Notes:</span> {file.notes}
                    </div>
                  )}
                </div>
                <div className="file-actions">
                  <button 
                    className="view-button"
                    onClick={() => handleDownloadPDF(file)}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bottom-actions">
            <div className="grand-total">
              <span>Total Amount:</span> ₹{orderDetails.grandTotal}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default XeroxOrderpreviewtempadmin;