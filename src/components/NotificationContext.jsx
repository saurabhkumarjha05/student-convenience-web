import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/api';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);

  // Fetch notifications on mount
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (err) {
      // Optionally handle error
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Show toast notification
  const showNotification = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Mark one notification as read
  const markAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch {}
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await API.patch('/notifications/read-all');
      fetchNotifications();
    } catch {}
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications, showNotification, markAsRead, markAllAsRead, toast }}>
      {children}
    </NotificationContext.Provider>
  );
}; 