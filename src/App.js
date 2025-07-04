import React, { useState, useEffect } from 'react';
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
import LostFound from './pages/LostFound'; // ✅ ✅ NEW PAGE IMPORT
import Delivery from './pages/Delivery';
import Assignment from './pages/Assignment';
import Notes from './pages/Notes';
import Events from './pages/Events';
import Forum from './pages/Forum';
import Tools from './pages/Tools';

import Layout from './components/Layout';
import Notification from './components/Notification';
import './index.css';
import { NotificationProvider } from './components/NotificationContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Notification />
        <Routes>
          {/* ✅ Layout with Navbar/Footer for main pages */}
          <Route element={<Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}>
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
            <Route
              path="/main-dashboard"
              element={
                isLoggedIn ? (
                  <MainDashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
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
            <Route
              path="/lostfound"
              element={isLoggedIn ? <LostFound isLoggedIn={isLoggedIn} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/delivery"
              element={isLoggedIn ? <Delivery /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/assignment"
              element={isLoggedIn ? <Assignment /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/notes"
              element={isLoggedIn ? <Notes /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/events"
              element={isLoggedIn ? <Events /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/forum"
              element={isLoggedIn ? <Forum /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/tools"
              element={isLoggedIn ? <Tools /> : <Navigate to="/login" replace />}
            />
          </Route>

          {/* ❌ Routes outside Layout */}
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
