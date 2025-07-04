import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { useNotifications } from './NotificationContext';
import { BellIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const searchTimeout = useRef();
  const inputRef = useRef();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact Us' },
    // Forum link removed
  ];

  // Debounced search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setShowDropdown(!!value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!value) {
      setSuggestions(null);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await API.get(`/user/search?q=${encodeURIComponent(value)}`);
        setSuggestions(res.data);
      } catch {
        setSuggestions(null);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  const handleSuggestionClick = (type, id) => {
    setShowDropdown(false);
    setSearch('');
    setSuggestions(null);
    // Route based on type
    switch (type) {
      case 'users':
        navigate(`/profile/${id}`);
        break;
      case 'forumPosts':
        navigate(`/forum/${id}`);
        break;
      case 'notes':
        navigate(`/notes/${id}`);
        break;
      case 'assignments':
        navigate(`/assignment/${id}`);
        break;
      case 'lostItems':
        navigate(`/lostfound/${id}`);
        break;
      case 'events':
        navigate(`/events/${id}`);
        break;
      default:
        break;
    }
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClick = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container max-w-7xl mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo + App Name */}
        <div className="flex items-center gap-2">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135789.png" alt="logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-blue-800">Student Convenience App</span>
        </div>
        {/* Nav Links - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-base px-2 py-1 transition font-semibold ${location.pathname === link.to ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
            >
              {link.label}
            </Link>
          ))}
          {/* Search Bar */}
          <div className="relative" ref={inputRef}>
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 focus-within:ring-2 ring-blue-400">
              <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="search"
                className="bg-transparent outline-none w-48 md:w-64 lg:w-80 py-1"
                placeholder="Search anything..."
                value={search}
                onChange={handleSearchChange}
                onFocus={() => setShowDropdown(!!search)}
              />
            </div>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-80 max-w-xs bg-white border rounded-xl shadow-lg z-50 overflow-y-auto max-h-80">
                {searchLoading ? (
                  <div className="p-4 text-center text-gray-400">Searching...</div>
                ) : suggestions && (
                  <>
                    {Object.entries(suggestions).every(([k, arr]) => arr.length === 0) && (
                      <div className="p-4 text-center text-gray-400">No results found</div>
                    )}
                    {Object.entries(suggestions).map(([type, arr]) => arr.length > 0 && (
                      <div key={type}>
                        <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase bg-gray-50">{type}</div>
                        {arr.map(item => (
                          <button
                            key={item._id}
                            className="block w-full text-left px-4 py-2 hover:bg-blue-50"
                            onClick={() => handleSuggestionClick(type, item._id)}
                          >
                            {type === 'users' && <span>{item.name} <span className="text-xs text-gray-400">({item.email})</span></span>}
                            {type === 'forumPosts' && <span>{item.title}</span>}
                            {type === 'notes' && <span>{item.subject}</span>}
                            {type === 'assignments' && <span>{item.title || item.subject}</span>}
                            {type === 'lostItems' && <span>{item.item}</span>}
                            {type === 'events' && <span>{item.title}</span>}
                          </button>
                        ))}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
          {/* Notification Bell */}
          <div className="relative">
            <button onClick={() => setNotifOpen(v => !v)} className="relative focus:outline-none" aria-label="Notifications">
              <BellIcon className="h-7 w-7 text-blue-700" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-96 max-w-xs bg-white border rounded-xl shadow-lg z-50 overflow-y-auto max-h-96">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                  <span className="font-bold text-gray-700">Notifications</span>
                  <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline">Mark all as read</button>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">No notifications</div>
                ) : notifications.map(n => (
                  <div key={n._id} className={`px-4 py-3 border-b last:border-b-0 flex items-start gap-2 ${n.read ? 'bg-gray-50' : 'bg-blue-50'}`}
                    role="button" tabIndex={0} onClick={() => markAsRead(n._id)} onKeyDown={e => e.key === 'Enter' && markAsRead(n._id)}>
                    <span className={`mt-1 w-2 h-2 rounded-full ${n.read ? 'bg-gray-300' : 'bg-blue-600'}`}></span>
                    <div className="flex-1">
                      <div className="text-sm text-gray-800">{n.message}</div>
                      <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Profile Dropdown */}
          <div className="relative">
            <button onClick={() => setMenuOpen((v) => !v)} className="focus:outline-none">
              <img src="/logo192.png" alt="profile" className="h-8 w-8 rounded-full border-2 border-blue-200" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md py-2 w-56 z-50 border flex flex-col divide-y divide-gray-200">
                {!isLoggedIn ? (
                  <>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 w-full text-left">👤 Profile</Link>
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-100 w-full text-left">🔑 Login</Link>
                    <Link to="/signup" className="block px-4 py-2 hover:bg-gray-100 w-full text-left">📝 Signup</Link>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 w-full text-left font-semibold">👤 Profile View</Link>
                      <button onClick={() => { setMenuOpen(false); navigate('/dashboard'); }} className="block px-4 py-2 hover:bg-gray-100 w-full text-left">📊 Dashboard</button>
                      <Link to="/activity" className="block px-4 py-2 hover:bg-gray-100 w-full text-left"> My Activity</Link>
                    </div>
                    <div className="flex flex-col">
                      <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 w-full text-left">⚙️ Settings</Link>
                    </div>
                    <div className="flex flex-col">
                      <button onClick={() => { localStorage.removeItem('token'); setMenuOpen(false); }} className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600">🚪 Logout</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen((v) => !v)} className="focus:outline-none">
            <svg className="h-8 w-8 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {mobileMenuOpen && (
            <div className="absolute top-16 right-4 bg-white shadow-md rounded-md py-4 px-6 w-64 z-50 border flex flex-col gap-2 divide-y divide-gray-200 animate-fade-in">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`py-2 text-base font-semibold ${location.pathname === link.to ? 'text-blue-600 font-bold' : 'text-gray-700 hover:text-blue-600'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {/* Search Bar for mobile (optional, can be added here if needed) */}
              <div className="pt-2">
                {!isLoggedIn ? (
                  <>
                    <Link to="/profile" className="block px-2 py-2 hover:bg-gray-100 w-full text-left">👤 Profile</Link>
                    <Link to="/login" className="block px-2 py-2 hover:bg-gray-100 w-full text-left">🔑 Login</Link>
                    <Link to="/signup" className="block px-2 py-2 hover:bg-gray-100 w-full text-left">📝 Signup</Link>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col">
                      <Link to="/profile" className="block px-2 py-2 hover:bg-gray-100 w-full text-left font-semibold">👤 Profile View</Link>
                      <button onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }} className="block px-2 py-2 hover:bg-gray-100 w-full text-left">📊 Dashboard</button>
                      <Link to="/activity" className="block px-2 py-2 hover:bg-gray-100 w-full text-left"> My Activity</Link>
                    </div>
                    <div className="flex flex-col">
                      <Link to="/settings" className="block px-2 py-2 hover:bg-gray-100 w-full text-left">⚙️ Settings</Link>
                    </div>
                    <div className="flex flex-col">
                      <button onClick={() => { localStorage.removeItem('token'); setMobileMenuOpen(false); }} className="block px-2 py-2 hover:bg-gray-100 w-full text-left text-red-600">🚪 Logout</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
