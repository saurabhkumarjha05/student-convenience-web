import React, { useState, useEffect, createContext } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Home from './pages/Home';
import MainDashboard from './pages/MainDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

import Layout from './components/Layout';
import Notification from './components/Notification';
import Footer from './components/Footer';
import './index.css';

export const NotificationContext = createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [notification, setNotification] = useState('');

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const showNotification = (msg) => {
    setNotification(msg);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      <BrowserRouter>
        <Notification message={notification} onClose={() => setNotification('')} />
        <Routes>
          {/* ✅ Pages with Navbar */}
          <Route
            element={<Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
          >
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
            <Route
              path="/main-dashboard"
              element={isLoggedIn ? <MainDashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" replace />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/profile"
              element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/settings"
              element={isLoggedIn ? <Settings /> : <Navigate to="/login" replace />}
            />
          </Route>
          {/* ❌ No Navbar on these */}
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </NotificationContext.Provider>
  );
}

export default App;
