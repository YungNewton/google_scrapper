import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoogleForm from './GoogleForm';
import styles from './BotAccess.module.css';

const BotAccess = () => {
  const [file, setFile] = useState(null);
  const [showGoogleForm, setShowGoogleForm] = useState(false);

  // Monitor for successful redirection and show toast
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'success') {
      toast.success('Authenticated successfully!');
    }
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select an Excel file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://192.168.0.167:5000/upload_excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload file.');
    }
  };

  // Show Google form
  const handleGoogleLinkClick = () => {
    setShowGoogleForm(true);
  };

  // Return from Google form
  const handleGoogleFormClose = () => {
    setShowGoogleForm(false);
  };

  // Fetch Google Auth URL and open in a new tab
  const handleGetAuthURL = async () => {
    try {
      const response = await axios.get('http://192.168.0.167:5000/get-auth-url');
      const { auth_url } = response.data;

      if (auth_url) {
        window.open(auth_url, '_blank'); // Open the URL in a new tab
      } else {
        toast.error('Failed to fetch Google authentication URL.');
      }
    } catch (error) {
      console.error('Error fetching auth URL:', error);
      toast.error('Failed to fetch Google authentication URL.');
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await axios.post('http://192.168.0.167:5000/logout', {}, { withCredentials: true });
      window.location.href = '/'; // Redirect to homepage after logout
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out.');
    }
  };

  return (
    <div className={styles['page-container']}>
      {showGoogleForm ? (
        <GoogleForm onClose={handleGoogleFormClose} />
      ) : (
        <div className={styles['form-container']}>
          <h1>Bot Access</h1>

          {/* File Upload */}
          <div>
            <label htmlFor="fileUpload">Upload Excel File</label>
            <input
              type="file"
              id="fileUpload"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className={styles['form-input']}
            />
            <button onClick={handleUpload} className={styles['option-button']}>
              Upload File
            </button>
          </div>

          {/* Google Login Button */}
          <div className={styles.socialLogin}>
            <button onClick={handleGoogleLinkClick} className={`${styles.googleLogin}`}>
              <img src="/assets/google-icon.png" alt="Google icon" />
              Link to Google
            </button>
          </div>

          {/* Button to Get Auth URL */}
          <div className={styles.authURL}>
            <button onClick={handleGetAuthURL} className={styles['option-button']}>
              Authenticate App.
            </button>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <button onClick={handleLogout} className={styles['logout-button']}>
        Logout
      </button>

      <ToastContainer />
    </div>
  );
};

export default BotAccess;
