import React from 'react';
import { useNotifications } from './NotificationContext';

const Notification = () => {
  const { toast } = useNotifications();
  if (!toast) return null;
  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-white transition-all animate-fade-in ${toast.type === 'error' ? 'bg-red-600' : toast.type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}
      role="alert"
      aria-live="assertive"
    >
      {toast.message}
    </div>
  );
};

export default Notification; 