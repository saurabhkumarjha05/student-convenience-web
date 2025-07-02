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
  </Routes>
);

export default AppRoutes; 