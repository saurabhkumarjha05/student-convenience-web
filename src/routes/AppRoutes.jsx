import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Home from '../pages/Home';
import LostFound from '../pages/LostFound';
import Delivery from '../pages/Delivery';
import Assignment from '../pages/Assignment';
import Notes from '../pages/Notes';
import Events from '../pages/Events';
import Forum from '../pages/Forum';
import Tools from '../pages/Tools';
import Profile from '../pages/Profile';
import MainDashboard from '../pages/MainDashboard';
import UserActivity from '../pages/UserActivity';
import CalendarPage from '../pages/CalendarPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/home" element={<Home />} />
    <Route path="/lostfound" element={<LostFound />} />
    <Route path="/delivery" element={<Delivery />} />
    <Route path="/assignment" element={<Assignment />} />
    <Route path="/notes" element={<Notes />} />
    <Route path="/events" element={<Events />} />
    <Route path="/forum" element={<Forum />} />
    <Route path="/tools" element={<Tools />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/dashboard" element={<MainDashboard />} />
    <Route path="/activity" element={<UserActivity />} />
    <Route path="/calendar" element={<CalendarPage />} />
  </Routes>
);

export default AppRoutes; 