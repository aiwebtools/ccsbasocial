import React, { useState, useEffect } from 'react';
import { Sprout } from 'lucide-react';
import Login from './components/auth/Login';
import Feed from './components/feed/Feed';
import ProfileArea from './components/profile/ProfileArea';
import UserManagement from './components/admin/UserManagement';
import Header from './components/layout/Header';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentView, setCurrentView] = useState<'feed' | 'users' | 'profile'>('feed');
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('userEmail');
    if (token) {
      setIsLoggedIn(true);
      // Check if user is admin or board member
      const credentials = JSON.parse(localStorage.getItem('userCredentials') || '[]');
      const user = credentials.find((cred: any) => cred.email === email);
      setIsAdmin(email === 'info@ctcannabisalliance.org' || email === 'mike@sweetheal.com' || (user && user.isAdmin));
    }

    // Load notification count
    const notifications = JSON.parse(localStorage.getItem('ccsba_notification_details') || '[]');
    const userEmail = localStorage.getItem('userEmail');
    const unreadCount = notifications.filter((n: any) => !n.read && n.recipient === userEmail).length;
    setNotificationCount(unreadCount);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    // Get user credentials
    const credentials = JSON.parse(localStorage.getItem('userCredentials') || '[]');
    const user = credentials.find((cred: any) => cred.email === email);

    // Check for admin/board member login
    if ((email === 'info@ctcannabisalliance.org' || email === 'mike@sweetheal.com') && password === 'THC') {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('authToken', 'admin-token');
      setIsAdmin(true);
      setIsLoggedIn(true);
      return;
    }

    // Check for board member login
    if (user && user.isAdmin && password === 'THC') {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('authToken', 'board-member-token');
      setIsAdmin(true);
      setIsLoggedIn(true);
      return;
    }

    // Check for regular user login with custom password
    if (user && user.customPassword && password === user.customPassword) {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('authToken', 'user-token');
      setIsLoggedIn(true);
      setIsAdmin(false);
      return;
    }

    // Check for regular user login
    if (user && !user.isAdmin && password === 'CBD') {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('authToken', 'user-token');
      setIsLoggedIn(true);
      setIsAdmin(false);
      return;
    }

    throw new Error('Invalid credentials');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentView('feed');
  };

  const handleNotification = () => {
    const userEmail = localStorage.getItem('userEmail');
    const notifications = JSON.parse(localStorage.getItem('ccsba_notification_details') || '[]');
    const unreadCount = notifications.filter((n: any) => !n.read && n.recipient === userEmail).length;
    setNotificationCount(unreadCount);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        isAdmin={isAdmin}
        currentView={currentView}
        onViewChange={setCurrentView}
        notificationCount={notificationCount}
        onLogout={handleLogout}
      />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            {isAdmin && currentView === 'users' ? (
              <UserManagement />
            ) : currentView === 'profile' ? (
              <ProfileArea />
            ) : (
              <Feed onInteraction={handleNotification} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}