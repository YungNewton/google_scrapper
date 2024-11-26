import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './ScrapingScreen.module.css';

const ScrapingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCanceling, setIsCanceling] = useState(false);
  const [isScrapingComplete, setIsScrapingComplete] = useState(false);

  useEffect(() => {
    if (location.state?.startScraping) {
      const startScraping = async () => {
        try {
          const response = await axios.post('https://whatsappscrapper.onrender.com/scrape', location.state, {
            withCredentials: true,
          });
          toast.success(response.data.message || "Scraping completed successfully!");
        } catch (error) {
          toast.error(error.response?.data?.message || "Scraping failed.");
        } finally {
          setIsScrapingComplete(true);
        }
      };

      startScraping();
    } else {
      toast.error("Scraping process not started. Invalid navigation.");
      setIsScrapingComplete(true);
    }
  }, [navigate, location.state]);

  const cancelScraping = async () => {
    setIsCanceling(true);
    try {
      const response = await axios.post('https://whatsappscrapper.onrender.com/cancel_scraping', {}, {
        withCredentials: true,
      });
      toast.success(response.data.message || "Scraping canceled.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel scraping.");
    } finally {
      setIsScrapingComplete(true);
    }
  };

  const handleGoBack = () => {
    navigate('/bot');
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <h2>
        {isCanceling
          ? "Canceling..."
          : isScrapingComplete
          ? "Scraping completed successfully!"
          : "Scraping in progress..."}
      </h2>
      {!isScrapingComplete && <div className={styles.loader}></div>}
      {!isCanceling && !isScrapingComplete && (
        <button onClick={cancelScraping} className={styles.cancelButton}>
          Cancel Scraping
        </button>
      )}
      {isScrapingComplete && (
        <button onClick={handleGoBack} className={styles.goBackButton}>
          Go Back
        </button>
      )}
    </div>
  );
};

export default ScrapingScreen;
