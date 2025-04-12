import React, { useState, useEffect } from 'react';
import { database } from './firebase';
import { ref, set, get, remove } from 'firebase/database';

function Tempadmincontrol() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [admins, setAdmins] = useState([]);

  // Fetch existing admins
  const fetchAdmins = async () => {
    try {
      const adminRef = ref(database, 'tempadmin');
      const snapshot = await get(adminRef);
      
      if (snapshot.exists()) {
        const adminData = snapshot.val();
        const adminList = Object.keys(adminData).map(key => ({
          id: key,
          ...adminData[key]
        }));
        setAdmins(adminList);
      } else {
        setAdmins([]);
      }
    } catch (err) {
      console.error('Error fetching admin details:', err);
      setError('Failed to fetch admin details');
    }
  };

  // Fetch admins on component mount
  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !name) {
      setError('Please enter both email and name');
      return;
    }

    try {
      // Sanitize email to be a valid Firebase key
      const sanitizedEmail = email.replace(/\./g, ',');
      
      // Reference to the tempadmin node in Firebase
      const adminRef = ref(database, `tempadmin/${sanitizedEmail}`);
      
      // Set the data
      await set(adminRef, {
        email: email,
        name: name
      });

      // Clear form and show success message
      setEmail('');
      setName('');
      setSuccess('Admin details added successfully!');
      setError('');

      // Refresh the admin list
      fetchAdmins();
    } catch (err) {
      console.error('Error adding admin details:', err);
      setError('Failed to add admin details');
    }
  };

  // Handle admin deletion
  const handleDeleteAdmin = async (adminId) => {
    try {
      const adminRef = ref(database, `tempadmin/${adminId}`);
      await remove(adminRef);
      
      // Refresh the admin list
      fetchAdmins();
      setSuccess('Admin deleted successfully!');
    } catch (err) {
      console.error('Error deleting admin:', err);
      setError('Failed to delete admin');
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px', 
      textAlign: 'center' 
    }}>
      <h1>Temp Admin Control</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="email" 
            placeholder="Enter Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px', 
              marginBottom: '10px' 
            }}
            required
          />
          
          <input 
            type="text" 
            placeholder="Enter Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px' 
            }}
            required
          />
        </div>
        
        <button 
          type="submit" 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          Add Admin
        </button>
      </form>

      {error && (
        <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>
      )}
      
      {success && (
        <p style={{ color: 'green', marginTop: '15px' }}>{success}</p>
      )}

      {/* Admin List Section */}
      <div style={{ marginTop: '20px' }}>
        <h2>Current Admins</h2>
        {admins.length === 0 ? (
          <p>No admins found</p>
        ) : (
          <div>
            {admins.map((admin) => (
              <div 
                key={admin.id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #ddd',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px'
                }}
              >
                <div>
                  <strong>Email:</strong> {admin.email}
                  <br />
                  <strong>Name:</strong> {admin.name}
                </div>
                <button
                  onClick={() => handleDeleteAdmin(admin.id)}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tempadmincontrol;