import React, { useState, useEffect } from 'react';
import { FiBell, FiCalendar, FiClock, FiUser, FiX, FiCheck, FiLoader, FiTrash2 } from 'react-icons/fi';
import { notificationAPI } from '../../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAsRead, setMarkingAsRead] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await notificationAPI.getAll();
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
      
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      setMarkingAsRead(notificationId);
      
      await notificationAPI.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === notificationId
            ? { ...notification, read: true, readAt: new Date() }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError('Failed to mark notification as read');
    } finally {
      setMarkingAsRead(null);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      setDeleting(notificationId);
      
      await notificationAPI.delete(notificationId);
      
      // Update local state
      const deletedNotification = notifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(notification => notification._id !== notificationId));
      
      // Update unread count if the deleted notification was unread
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError('Failed to delete notification');
    } finally {
      setDeleting(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      
      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true, readAt: new Date() }))
      );
      
      // Reset unread count
      setUnreadCount(0);
      
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError('Failed to mark all notifications as read');
    }
  };

  const clearReadNotifications = async () => {
    try {
      await notificationAPI.clearRead();
      
      // Update local state - remove all read notifications
      setNotifications(prev => prev.filter(notification => !notification.read));
      
    } catch (err) {
      console.error('Error clearing read notifications:', err);
      setError('Failed to clear read notifications');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment_reminder':
        return <FiClock className="w-5 h-5 text-orange-500" />;
      case 'appointment_confirmed':
        return <FiCalendar className="w-5 h-5 text-green-500" />;
      case 'appointment_cancelled':
      case 'appointment_rescheduled':
        return <FiX className="w-5 h-5 text-red-500" />;
      case 'message':
        return <FiUser className="w-5 h-5 text-blue-500" />;
      case 'system':
        return <FiBell className="w-5 h-5 text-purple-500" />;
      case 'medical_update':
        return <FiUser className="w-5 h-5 text-indigo-500" />;
      default:
        return <FiBell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return 'border-l-4 border-red-500';
      case 'medium':
        return 'border-l-4 border-yellow-500';
      case 'low':
        return 'border-l-4 border-green-500';
      default:
        return '';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FiLoader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-sm mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            <p className="text-sm text-gray-500">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <FiCheck className="w-4 h-4 mr-2" />
                Mark all as read
              </button>
            )}
            {notifications.some(n => n.read) && (
              <button
                onClick={clearReadNotifications}
                className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiTrash2 className="w-4 h-4 mr-2" />
                Clear read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">All Notifications</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-6 hover:bg-gray-50 transition-colors ${getPriorityColor(notification.priority)} ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(notification.createdAt)}
                        </span>
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          disabled={deleting === notification._id}
                          className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          {deleting === notification._id ? (
                            <FiLoader className="w-4 h-4 animate-spin" />
                          ) : (
                            <FiX className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        disabled={markingAsRead === notification._id}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                      >
                        {markingAsRead === notification._id ? (
                          <span className="flex items-center">
                            <FiLoader className="w-3 h-3 mr-1 animate-spin" />
                            Marking as read...
                          </span>
                        ) : (
                          'Mark as read'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <FiBell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notifications</p>
            </div>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Notification Settings</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Appointment Reminders</h4>
              <p className="text-sm text-gray-500">Get notified before your appointments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">SMS Notifications</h4>
              <p className="text-sm text-gray-500">Receive notifications via SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications; 