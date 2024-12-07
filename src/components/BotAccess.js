import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './BotAccess.module.css';

const BotAccess = () => {
  const [file, setFile] = useState(null);
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const [googleAuthLink, setGoogleAuthLink] = useState('');

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
      await axios.post('https://form-handler-ai.twilightparadox.com/upload_excel', formData, {
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

  // Handle Google linking process
  const handleGoogleLinkClick = async () => {
    setIsLinkingGoogle(true);
    setGoogleAuthLink(''); // Reset previous link
  
    // Simulate delay to display a hardcoded link
    setTimeout(() => {
      const simulatedLink = "http://104.198.205.151:8080/vnc.html"; // Replace with your hardcoded link
      setGoogleAuthLink(simulatedLink);
      console.log('[DEBUG] Google link displayed after delay:', simulatedLink);
    }, 3000); // Simulated 3-second delay
  
    // Call the /save_user_data endpoint, but ignore response for link display
    try {
      await axios.post('https://form-handler-ai.twilightparadox.com/save_user_data');
      console.log('[DEBUG] Save user data process initiated.');
    } catch (error) {
      console.error('[ERROR] Error during Google linking process:', error);
    }
  };  

  // Handle going back from the Google linking process
  const handleGoBack = () => {
    setIsLinkingGoogle(false);
    setGoogleAuthLink('');
  };

  // Fetch Google Auth URL and open in a new tab
  const handleGetAuthURL = async () => {
    try {
      const response = await axios.get('https://form-handler-ai.twilightparadox.com/get-auth-url');
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
      await axios.post('https://form-handler-ai.twilightparadox.com/logout', {}, { withCredentials: true });
      window.location.href = '/'; // Redirect to homepage after logout
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out.');
    }
  };

  return (
    <div className={styles['page-container']}>
      {isLinkingGoogle ? (
        <div className={styles['linking-container']}>
          <h2>Linking Google Account...</h2>
          <div className={styles['spinner']} />
          {googleAuthLink ? (
            <p>
              <a href={googleAuthLink} target="_blank" rel="noopener noreferrer">
                Click here to link your Google Account
              </a>
            </p>
          ) : (
            <p>Please wait while we prepare your link.</p>
          )}
          <button onClick={handleGoBack} className={styles['option-button']}>
            Go Back
          </button>
        </div>
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

          {/* Google Link Button */}
          <div className={styles.socialLogin}>
            <button
              onClick={handleGoogleLinkClick}
              className={`${styles['option-button']} ${styles['googleLogin']}`}
            >
              <img src="/assets/google-icon.png" alt="Google icon" />
              Link to Google
            </button>
          </div>

          {/* Authenticate App Button */}
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
