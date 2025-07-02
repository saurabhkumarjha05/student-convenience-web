import React, { useState } from 'react';

const Contact = ({ isLoggedIn, setIsLoggedIn }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-lg mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg w-full p-8">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4 text-center">Contact Us</h2>
          {sent ? (
            <div className="text-green-600 text-center font-semibold">Thank you for reaching out! We'll get back to you soon.</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <textarea
                placeholder="Your Message"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
              />
              <button
                type="submit"
                className="w-full py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact; 