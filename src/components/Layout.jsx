import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="pt-16"> {/* Adds spacing below fixed navbar */}
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
