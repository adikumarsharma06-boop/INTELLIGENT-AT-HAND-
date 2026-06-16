/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppItem, User, SystemNotification, AppFeedback, BillingHistory, AnalyticsSummary, SystemLog } from '../types';

interface AppContextType {
  apps: AppItem[];
  user: User | null;
  notifications: SystemNotification[];
  logs: SystemLog[];
  isLoadingApps: boolean;
  activeAppId: string | null; // Currently running internal app
  searchTerm: string;
  selectedCategory: string;
  sortBy: 'popular' | 'rating' | 'featured' | 'new';
  viewMode: 'marketplace' | 'dashboard' | 'pricing' | 'about' | 'contact' | 'profile' | 'admin' | 'faq' | 'privacy' | 'terms';
  notificationsOpen: boolean;
  metrics: any; // For admin analytics
  
  // Auth
  login: (email: string) => Promise<boolean>;
  signup: (
    email: string, 
    fullName: string, 
    phone?: string, 
    accessPurpose?: string, 
    departmentAffiliation?: string, 
    securityKey?: string
  ) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  
  // App operations
  loadApps: () => Promise<void>;
  loadLogs: () => Promise<void>;
  logEvent: (message: string, level?: 'INFO' | 'WARN' | 'ERROR', source?: string) => Promise<void>;
  launchApp: (appId: string) => Promise<void>;
  closeActiveApp: () => void;
  toggleFavorite: (appId: string) => Promise<void>;
  submitFeedback: (appId: string, rating: number, comment: string) => Promise<boolean>;
  submitSuggestion: (comment: string) => Promise<boolean>;
  upgradeSubscription: (plan: 'pro' | 'business') => Promise<boolean>;
  
  // Filtering & Search
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sort: 'popular' | 'rating' | 'featured' | 'new') => void;
  setViewMode: (mode: 'marketplace' | 'dashboard' | 'pricing' | 'about' | 'contact' | 'profile' | 'admin' | 'faq' | 'privacy' | 'terms') => void;
  setNotificationsOpen: (open: boolean) => void;
  
  // Admin Operations
  adminAddApp: (appData: Partial<AppItem>) => Promise<boolean>;
  adminDeleteApp: (appId: string) => Promise<boolean>;
  adminAddNotification: (title: string, message: string, category?: string) => Promise<boolean>;
  loadMetrics: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoadingApps, setIsLoadingApps] = useState<boolean>(true);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'featured' | 'new'>('featured');
  const [viewMode, setViewMode] = useState<'marketplace' | 'dashboard' | 'pricing' | 'about' | 'contact' | 'profile' | 'admin' | 'faq' | 'privacy' | 'terms'>('marketplace');
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<any>(null);

  // Load Initial Session, Apps, and Logs
  useEffect(() => {
    loadApps();
    loadNotifications();
    loadLogs();
    
    const savedToken = localStorage.getItem('iah_token');
    if (savedToken) {
      // Restore session by logging in / fetching profile
      fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: savedToken })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem('iah_token');
        }
      })
      .catch(() => {
        localStorage.removeItem('iah_token');
      });
    }
  }, []);

  const loadApps = async () => {
    try {
      setIsLoadingApps(true);
      const res = await fetch('/api/apps');
      const data = await res.json();
      setApps(data);
    } catch (err) {
      console.error('Error loading apps:', err);
    } finally {
      setIsLoadingApps(false);
    }
  };

  const loadLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Error loading system logs:', err);
    }
  };

  const logEvent = async (message: string, level: 'INFO' | 'WARN' | 'ERROR' = 'INFO', source: string = 'SYSTEM') => {
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, level, source })
      });
      const data = await res.json();
      if (data.success && data.log) {
        setLogs(prev => {
          const appended = [...prev, data.log];
          return appended.slice(-100);
        });
      }
    } catch (err) {
      console.error('Error sending log event:', err);
    }
  };

  const loadNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error('Error notifications:', err);
    }
  };

  const loadMetrics = async () => {
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error('Error metrics:', err);
    }
  };

  const login = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('iah_token', data.token);
        setUser(data.user);
        await loadLogs();
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
    }
    return false;
  };

  const signup = async (
    email: string, 
    fullName: string, 
    phone?: string, 
    accessPurpose?: string, 
    departmentAffiliation?: string, 
    securityKey?: string
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password: 'password123', 
          fullName, 
          phone, 
          accessPurpose, 
          departmentAffiliation, 
          securityKey 
        })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('iah_token', data.token);
        setUser(data.user);
        await loadLogs();
        return true;
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('iah_token');
    setUser(null);
    setActiveAppId(null);
    setViewMode('marketplace');
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    const token = localStorage.getItem('iah_token');
    if (!token) return false;
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...updates })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        await loadLogs();
        return true;
      }
    } catch (err) {
      console.error('Profile update error:', err);
    }
    return false;
  };

  const launchApp = async (appId: string) => {
    const target = apps.find(a => a.id === appId);
    if (!target) return;

    // Increment view count
    try {
      await fetch(`/api/apps/${appId}/view`, { method: 'POST' });
      await loadLogs();
    } catch (err) {
      console.error('Error logging app launch:', err);
    }
    
    setApps(prev => prev.map(a => a.id === appId ? { ...a, views: (a.views || 0) + 1 } : a));

    // Update user recent list
    if (user) {
      const updatedRecents = [appId, ...user.recentApps.filter(id => id !== appId)].slice(0, 8);
      updateProfile({ recentApps: updatedRecents });
    }

    setActiveAppId(appId);
  };

  const closeActiveApp = () => {
    setActiveAppId(null);
  };

  const toggleFavorite = async (appId: string) => {
    if (!user) {
      alert('Please log in or sign up to save favorites!');
      return;
    }
    const isFav = user.favorites.includes(appId);
    const updatedFavs = isFav 
      ? user.favorites.filter(id => id !== appId)
      : [...user.favorites, appId];
    
    await updateProfile({ favorites: updatedFavs });
  };

  const submitFeedback = async (appId: string, rating: number, comment: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await fetch(`/api/apps/${appId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user.email, rating, comment })
      });
      const data = await res.json();
      if (data.success) {
        await loadApps(); // Reload rating metrics in apps state
        return true;
      }
    } catch (err) {
      console.error('Feedback error:', err);
    }
    return false;
  };

  const submitSuggestion = async (comment: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: user.email, comment })
      });
      const data = await res.json();
      return !!data.success;
    } catch (err) {
      console.error('Suggestion submission error:', err);
    }
    return false;
  };

  const upgradeSubscription = async (plan: 'pro' | 'business'): Promise<boolean> => {
    if (!user) {
      alert('Please authenticate first to choose plans.');
      return false;
    }
    const result = await updateProfile({ subscription: plan });
    if (result) {
      // Reload metrics to show updated billing if admin is looking
      loadMetrics();
    }
    return result;
  };

  // Admin controls
  const adminAddApp = async (appData: Partial<AppItem>): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appData)
      });
      const data = await response.json();
      if (data.success) {
        setApps(data.apps);
        return true;
      }
    } catch (err) {
      console.error('Admin add error:', err);
    }
    return false;
  };

  const adminDeleteApp = async (appId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/apps/${appId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setApps(data.apps);
        if (activeAppId === appId) {
          setActiveAppId(null);
        }
        return true;
      }
    } catch (err) {
      console.error('Admin delete error:', err);
    }
    return false;
  };

  const adminAddNotification = async (title: string, message: string, category: string = 'system'): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, category })
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        return true;
      }
    } catch (err) {
      console.error('Admin add notification error:', err);
    }
    return false;
  };

  return (
    <AppContext.Provider value={{
      apps,
      user,
      notifications,
      logs,
      isLoadingApps,
      activeAppId,
      searchTerm,
      selectedCategory,
      sortBy,
      viewMode,
      notificationsOpen,
      metrics,
      
      login,
      signup,
      logout,
      updateProfile,
      
      loadApps,
      loadLogs,
      logEvent,
      launchApp,
      closeActiveApp,
      toggleFavorite,
      submitFeedback,
      submitSuggestion,
      upgradeSubscription,
      
      setSearchTerm,
      setSelectedCategory,
      setSortBy,
      setViewMode,
      setNotificationsOpen,
      
      adminAddApp,
      adminDeleteApp,
      adminAddNotification,
      loadMetrics
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider');
  }
  return context;
}
