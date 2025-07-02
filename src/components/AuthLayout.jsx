import React from 'react';

const AuthLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col md:flex-row bg-[#eef3f8]">
    {/* Left Side */}
    <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-[#2e86de]/80 to-[#00c897]/80 p-8 text-white rounded-b-3xl md:rounded-b-none md:rounded-l-3xl shadow-lg relative overflow-hidden">
      <div className="z-10 flex flex-col items-center">
        <img src="/logo192.png" alt="App Logo" className="w-16 h-16 mb-4 rounded-full shadow-lg bg-white" />
        <h1 className="text-3xl font-bold mb-2">Student Convenience App</h1>
        <ul className="text-base font-medium space-y-2 mt-4">
          <li>🔎 Lost & Found</li>
          <li>🚚 Delivery Help</li>
          <li>📚 Notes Sharing</li>
          <li>🎉 Events</li>
        </ul>
      </div>
      <img src="https://cdn-icons-png.flaticon.com/512/3135/3135789.png" alt="Student" className="absolute bottom-0 right-0 w-40 opacity-30 md:opacity-60 pointer-events-none" />
    </div>
    {/* Right Side (Form) */}
    <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-16">
      {children}
    </div>
  </div>
);

export default AuthLayout; 