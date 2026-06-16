/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AppItem {
  id: string;
  name: string;
  description: string;
  logo: string; // Dynamic icon name (from Lucide) or Image URL
  category: string;
  tags: string[];
  url: string; // URL to open. If empty or internal key, launches inside our runner
  featured: boolean;
  premium: boolean;
  views: number;
  rating: number;
  ratingsCount: number;
  estimatedLaunchTime?: string;
  uptime?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl: string;
  subscription: 'free' | 'pro' | 'business';
  createdAt: string;
  favorites: string[]; // List of App IDs
  recentApps: string[]; // List of App IDs
  accessPurpose?: string;
  departmentAffiliation?: string;
  securityKey?: string;
}

export interface BillingHistory {
  id: string;
  plan: 'Pro' | 'Business';
  amount: number;
  date: string;
  status: 'paid' | 'failed' | 'pending';
  invoiceUrl?: string;
}

export interface AppFeedback {
  id: string;
  appId: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Suggestion {
  id: string;
  userEmail: string;
  comment: string;
  createdAt: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  category: 'new-app' | 'system' | 'premium' | 'update';
}

export interface AnalyticsSummary {
  totalUsers: number;
  activeUsersDau: number;
  activeUsersMau: number;
  premiumUsers: number;
  revenue: number;
  appUsage: { appId: string; name: string; count: number }[];
  mostPopularApps: { appId: string; name: string; score: number }[];
  trafficSources: { source: string; percentage: number }[];
  deviceAnalytics: { device: string; percentage: number }[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  message: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  source: string;
}

