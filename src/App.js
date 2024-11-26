import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import BotAccess from './components/BotAccess';
import ScrapingScreen from './components/ScrapingScreen'; // Import ScrapingScreen component
import axios from 'axios';

function App() {
  useEffect(() => {
    // Set interval to ping the keep-alive endpoint every 5 minutes
    const interval = setInterval(() => {
      axios.get('http://192.168.0.167:5000/keep_alive', { withCredentials: true })
        .catch(error => {
          console.error('Session keep-alive error:', error);
        });
    }, 5 * 60 * 1000); // 5 minutes

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/bot" element={<BotAccess />} />
        <Route path="/scraping" element={<ScrapingScreen />} /> {/* Add ScrapingScreen route */}
      </Routes>
    </Router>
  );
}

export default App;
