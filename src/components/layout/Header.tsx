import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, MessageSquare, User, Search, LogOut, Sprout, Users, UserPlus, Newspaper, Brain, Calendar, Home, X, Settings } from 'lucide-react';
import MemberDirectory from '../messaging/MemberDirectory';
import MessageList from '../messaging/MessageList';
import ChangePassword from '../auth/ChangePassword';

interface HeaderProps {
  isAdmin: boolean;
  currentView: string;
  onViewChange: (view: string) => void;
  notificationCount: number;
  onLogout?: () => void;
}

interface Notification {
  id: string;
  actorName: string;
  text: string;
  timestamp: string;
  read: boolean;
  postContent?: string;
  type: 'like' | 'comment' | 'thumbsUp' | 'warning' | 'system';
}

export default function Header({ isAdmin, currentView, onViewChange, notificationCount, onLogout }: HeaderProps) {
  const [showMemberDirectory, setShowMemberDirectory] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const memberDirectoryRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const currentUserEmail = localStorage.getItem('userEmail');

  const navigationItems = [
    {
      name: 'CCSBA Home',
      icon: Home,
      action: () => window.open('https://www.ctcannabisalliance.org', '_blank'),
      active: false
    },
    {
      name: 'News Feed',
      icon: Newspaper,
      action: () => onViewChange('feed'),
      active: currentView === 'feed'
    },
    {
      name: 'AI Resources',
      icon: Brain,
      action: () => window.open('https://www.aiwebtools.ai', '_blank'),
      active: false
    },
    {
      name: 'Upcoming Events',
      icon: Calendar,
      action: () => window.open('https://ctcannabisalliance.org/upcoming-events%F0%9F%93%85', '_blank'),
      active: false
    },
    ...(isAdmin ? [{
      name: 'Add User',
      icon: UserPlus,
      action: () => onViewChange('users'),
      active: currentView === 'users'
    }] : [])
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (memberDirectoryRef.current && !memberDirectoryRef.current.contains(event.target as Node)) {
        setShowMemberDirectory(false);
      }
      if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setShowMessages(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const checkUnreadMessages = () => {
      const currentUserEmail = localStorage.getItem('userEmail');
      const messages = JSON.parse(localStorage.getItem('ccsba_messages') || '[]');
      const unreadCount = messages.filter((msg: any) => 
        msg.recipient === currentUserEmail && !msg.read
      ).length;
      setUnreadMessages(unreadCount);
    };

    const checkNotifications = () => {
      const currentUserEmail = localStorage.getItem('userEmail');
      const allNotifications = JSON.parse(localStorage.getItem('ccsba_notification_details') || '[]');
      const userNotifications = allNotifications.filter((n: Notification) => 
        n.recipient === currentUserEmail
      );
      setNotifications(userNotifications);
      const unreadCount = userNotifications.filter(n => !n.read).length;
      setUnreadNotifications(unreadCount);
    };

    checkUnreadMessages();
    checkNotifications();

    const messageInterval = setInterval(checkUnreadMessages, 5000);
    const notificationInterval = setInterval(checkNotifications, 5000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(notificationInterval);
    };
  }, []);

  const handleNotificationClick = () => {
    if (!showNotifications) {
      const currentUserEmail = localStorage.getItem('userEmail');
      const allNotifications = JSON.parse(localStorage.getItem('ccsba_notification_details') || '[]');
      const updatedNotifications = allNotifications.map((n: Notification) => {
        if (n.recipient === currentUserEmail && !n.read) {
          return { ...n, read: true };
        }
        return n;
      });
      localStorage.setItem('ccsba_notification_details', JSON.stringify(updatedNotifications));
      setUnreadNotifications(0);
      
      const userNotifications = updatedNotifications.filter((n: Notification) => 
        n.recipient === currentUserEmail
      );
      setNotifications(userNotifications);
    }
    setShowNotifications(!showNotifications);
  };

  const handlePasswordChange = async (newPassword: string) => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      const credentials = JSON.parse(localStorage.getItem('userCredentials') || '[]');
      const updatedCredentials = credentials.map((cred: any) => {
        if (cred.email === userEmail) {
          return { ...cred, customPassword: newPassword };
        }
        return cred;
      });
      localStorage.setItem('userCredentials', JSON.stringify(updatedCredentials));
    }
    setShowChangePassword(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'thumbsUp':
        return '👍';
      case 'comment':
        return '💬';
      case 'warning':
        return '⚠️';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  return (
    <header className="fixed top-0 w-full bg-white border-b border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="relative w-8 h-8 mr-2">
                <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-50"></div>
                <Sprout className="absolute inset-0 h-8 w-8 text-[#1C563D]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[#1C563D]">CCSBA</span>
                <span className="tagline text-sm text-[#1C563D] tracking-wider hidden sm:block">
                  EMPOWER • EDUCATE • ACHIEVE
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={item.action}
                className={`text-gray-600 hover:text-[#1C563D] ${
                  item.active ? 'text-[#1C563D]' : ''
                }`}
                title={item.name}
              >
                <item.icon className="h-6 w-6" />
              </button>
            ))}

            {/* Member Directory */}
            <div className="relative" ref={memberDirectoryRef}>
              <button
                onClick={() => setShowMemberDirectory(!showMemberDirectory)}
                className={`text-gray-600 hover:text-[#1C563D] ${
                  showMemberDirectory ? 'text-[#1C563D]' : ''
                }`}
                title="Member Directory"
              >
                <Users className="h-6 w-6" />
              </button>
              {showMemberDirectory && <MemberDirectory />}
            </div>

            {/* Messages */}
            <div className="relative" ref={messageRef}>
              <button
                onClick={() => setShowMessages(!showMessages)}
                className="text-gray-600 hover:text-[#1C563D]"
                title="Messages"
              >
                <MessageSquare className="h-6 w-6" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </button>
              {showMessages && <MessageList onClose={() => setShowMessages(false)} />}
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={handleNotificationClick}
                className="text-gray-600 hover:text-[#1C563D]"
              >
                <Bell className="h-6 w-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-lg ${
                              !notification.read ? 'bg-blue-50' : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start space-x-2">
                              <span className="text-xl" role="img" aria-label={notification.type}>
                                {getNotificationIcon(notification.type)}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm">
                                  <span className="font-medium">{notification.actorName}</span>
                                  {' '}{notification.text}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                                {notification.postContent && (
                                  <div className="mt-2 p-2 bg-white rounded border text-sm">
                                    {notification.postContent}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">No notifications</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-600 hover:text-[#1C563D]"
                title="Settings"
              >
                <Settings className="h-6 w-6" />
              </button>
              {showSettings && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="p-4">
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Logged in as:</h3>
                      <p className="mt-1 text-sm text-gray-500">{currentUserEmail}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowChangePassword(true);
                        setShowSettings(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Set New Password
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile & Logout */}
            <button 
              onClick={() => onViewChange('profile')}
              className={`text-gray-600 hover:text-[#1C563D] ${
                currentView === 'profile' ? 'text-[#1C563D]' : ''
              }`}
            >
              <User className="h-6 w-6" />
            </button>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="text-gray-600 hover:text-[#1C563D]"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(true)}
              className="text-gray-600 hover:text-[#1C563D]"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setShowMobileMenu(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="px-4 py-2 space-y-4">
              {navigationItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action();
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-gray-600 hover:text-[#1C563D]"
                >
                  <item.icon className="h-6 w-6 mr-3" />
                  <span>{item.name}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  setShowMemberDirectory(!showMemberDirectory);
                  setShowMobileMenu(false);
                }}
                className="flex items-center w-full px-4 py-2 text-gray-600 hover:text-[#1C563D]"
              >
                <Users className="h-6 w-6 mr-3" />
                <span>Member Directory</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ChangePassword
            onPasswordChange={handlePasswordChange}
            onBack={() => setShowChangePassword(false)}
          />
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Sign Out
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to sign out?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                  setShowLogoutConfirm(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-[#1C563D] rounded-md hover:bg-[#164430]"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}