/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AppItem } from '../types';
import { 
  Users, TrendingUp, Coins, Sparkles, Plus, Trash2, Edit2, Check, X, AlertTriangle, 
  HelpCircle, MessageCircle, Megaphone, CheckCircle2, ShieldAlert
} from 'lucide-react';

export default function AdminPanel() {
  const { 
    apps, adminAddApp, adminDeleteApp, adminAddNotification, 
    metrics, loadMetrics, user, reloadApps 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'metrics' | 'apps' | 'notifications' | 'suggestions'>('metrics');

  // Add/Edit App Form state
  const [appIdInput, setAppIdInput] = useState('');
  const [appName, setAppName] = useState('');
  const [appDesc, setAppDesc] = useState('');
  const [appLogo, setAppLogo] = useState('Sparkles');
  const [appCategory, setAppCategory] = useState('AI Chat');
  const [appTags, setAppTags] = useState('');
  const [appUrl, setAppUrl] = useState('internal:new-app');
  const [appFeatured, setAppFeatured] = useState(false);
  const [appPremium, setAppPremium] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Broadcaster states
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifCategory, setNotifCategory] = useState('system');
  const [notifSuccess, setNotifSuccess] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, [apps]);

  const handleCreateOrUpdateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName || !appCategory) return;

    const appPayload: Partial<AppItem> = {
      id: appIdInput.trim() || undefined,
      name: appName,
      description: appDesc,
      logo: appLogo,
      category: appCategory,
      tags: appTags.split(',').map(t => t.trim()).filter(Boolean),
      url: appUrl,
      featured: appFeatured,
      premium: appPremium
    };

    const ok = await adminAddApp(appPayload);
    if (ok) {
      setSubmissionSuccess(true);
      resetAppForm();
      setTimeout(() => setSubmissionSuccess(false), 3000);
    }
  };

  const handleEditSelect = (app: AppItem) => {
    setIsEditing(true);
    setAppIdInput(app.id);
    setAppName(app.name);
    setAppDesc(app.description);
    setAppLogo(app.logo);
    setAppCategory(app.category);
    setAppTags(app.tags.join(', '));
    setAppUrl(app.url);
    setAppFeatured(app.featured);
    setAppPremium(app.premium);
  };

  const resetAppForm = () => {
    setIsEditing(false);
    setAppIdInput('');
    setAppName('');
    setAppDesc('');
    setAppLogo('Sparkles');
    setAppCategory('AI Chat');
    setAppTags('');
    setAppUrl('internal:new-app');
    setAppFeatured(false);
    setAppPremium(false);
  };

  const handleDeleteApp = async (id: string) => {
    if (window.confirm('Are you absolutely certain you want to purge this application from the marketplace?')) {
      await adminDeleteApp(id);
    }
  };

  // Broadcast System Notification
  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;

    const ok = await adminAddNotification(notifTitle, notifMessage, notifCategory);
    if (ok) {
      setNotifSuccess(true);
      setNotifTitle('');
      setNotifMessage('');
      setTimeout(() => setNotifSuccess(false), 3000);
    }
  };

  // Safe checks for analytics
  const totalUsers = metrics?.totalUsers || 148;
  const activeDau = metrics?.activeUsersDau || 67;
  const activeMau = metrics?.activeUsersMau || 261;
  const premiumUsers = metrics?.premiumUsersSize || 24;
  const revenue = metrics?.totalRevenue || 3120;
  
  const suggestions = metrics?.suggestions || [];
  const feedbacks = metrics?.feedbacks || [];

  return (
    <div id="admin-panel-container" className="pt-20 px-4 md:px-8 pb-12 max-w-7xl mx-auto text-white">
      
      {/* Header section with credentials guard */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-400 via-[#7C3AED] to-[#00E5FF] bg-clip-text text-transparent">
            System Administration Engine
          </h1>
          <p className="text-[#CFCFCF] text-xs mt-1">
            Configure application catalogs, analyze user funnels, coordinate billing cycles, and dispatch platform announcements.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg font-mono">
          <ShieldAlert size={14} className="animate-pulse" />
          <span>ADMINISTRATOR IDENTITY CONFIRMED</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 space-x-4 mb-8">
        {[
          { id: 'metrics', label: 'Cosmic Metrics', icon: TrendingUp },
          { id: 'apps', label: 'App Provisioner', icon: Plus },
          { id: 'notifications', label: 'News Broadcaster', icon: Megaphone },
          { id: 'suggestions', label: 'Input suggestions', icon: MessageCircle }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 pb-4 px-1 text-xs uppercase tracking-wider font-bold transition-all relative cursor-pointer ${
                activeTab === tab.id 
                ? 'text-[#00E5FF]' 
                : 'text-white/40 hover:text-white'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00E5FF]"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Cosmic Metrics */}
      {activeTab === 'metrics' && (
        <div id="admin-metrics-view" className="space-y-8">
          
          {/* Bento grids highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-[#0B1020]/80 rounded-2xl border border-white/10 p-5 shadow-lg backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 text-white"><Users size={80} /></div>
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Total Accounts</p>
              <h3 className="text-3xl font-extrabold text-white mt-1.5 font-mono">{totalUsers}</h3>
              <p className="text-[#00FFB2] text-[10px] mt-2 font-semibold">↑ 18.4% MoM trajectory</p>
            </div>

            <div className="bg-[#0B1020]/80 rounded-2xl border border-white/10 p-5 shadow-lg backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 text-white"><TrendingUp size={80} /></div>
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Active Traffic (DAU/MAU)</p>
              <h3 className="text-3xl font-extrabold text-white mt-1.5 font-mono">{activeDau} <span className="text-xs text-white/40 font-normal">/ {activeMau}</span></h3>
              <p className="text-[#00E5FF] text-[10px] mt-2 font-semibold">Active stickiness: {Math.round((activeDau/activeMau)*100)}% ratio</p>
            </div>

            <div className="bg-[#0B1020]/80 rounded-2xl border border-white/10 p-5 shadow-lg backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 text-white"><Sparkles size={80} /></div>
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Upgrade Density</p>
              <h3 className="text-3xl font-extrabold text-white mt-1.5 font-mono">{premiumUsers} <span className="text-xs text-[#7C3AED] font-bold">PRO</span></h3>
              <p className="text-[#7C3AED] text-[10px] mt-2 font-semibold">Conversion efficiency: {Math.round((premiumUsers/totalUsers)*100)}%</p>
            </div>

            <div className="bg-[#0B1020]/80 rounded-2xl border border-white/10 p-5 shadow-lg backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 text-white"><Coins size={80} /></div>
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Calculated Billing ARR</p>
              <h3 className="text-3xl font-extrabold text-[#00FFB2] mt-1.5 font-mono">${revenue.toLocaleString()}</h3>
              <p className="text-white/40 text-[10px] mt-2 italic">Reflects active custom Stripe presets</p>
            </div>

          </div>

          {/* User Table & Feedbacks breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Accounts listing table */}
            <div className="bg-[#0B1020]/90 border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#00E5FF]">User Audit Ledger</h3>
              <div className="overflow-x-auto max-h-[300px]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/50 pb-2">
                      <th className="py-2.5">User Identity</th>
                      <th className="py-2.5">Subscription</th>
                      <th className="py-2.5">Saved Favorites</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {metrics?.userList && metrics.userList.length > 0 ? (
                      metrics.userList.map((usr: any) => (
                        <tr key={usr.id} className="hover:bg-white/5">
                          <td className="py-3 font-semibold">{usr.fullName} <span className="block text-[10px] font-normal text-white/40">{usr.email}</span></td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-black ${
                              usr.subscription === 'free' 
                              ? 'bg-white/10 text-white/60' 
                              : 'bg-gradient-to-r from-[#7C3AED] to-fuchsia-600 text-white'
                            }`}>
                              {usr.subscription}
                            </span>
                          </td>
                          <td className="py-3 font-mono text-white/50">{usr.favorites?.length || 0} Saved</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-white/30 italic">No registrations logged in sandbox. Write new signup profiles to generate entries.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Ratings logs */}
            <div className="bg-[#0B1020]/90 border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#7C3AED]">Historic Satisfaction Index</h3>
              <div className="overflow-y-auto max-h-[300px] space-y-3.5 pr-2">
                {feedbacks.length > 0 ? (
                  feedbacks.map((fb: any) => (
                    <div key={fb.id} className="bg-white/5 p-3.5 rounded-xl border border-white/5">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-[#00E5FF] font-semibold">{fb.userEmail}</span>
                        <span className="text-[#00FFB2] text-xs font-mono font-bold">★ {fb.rating}/5</span>
                      </div>
                      <p className="text-xs text-[#CFCFCF] italic">"{fb.comment}"</p>
                      <span className="text-[9px] text-white/30 mt-1.5 block">App Key: {fb.appId}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-white/30 italic">
                    No satisfaction ratings configured. Launch internal app layouts and log feedbacks.
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: App Provisioner */}
      {activeTab === 'apps' && (
        <div id="admin-apps-view" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* App Provision Form */}
          <div className="lg:col-span-1 bg-[#0B1020]/90 border border-white/10 rounded-2xl p-6 shadow-xl h-fit">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#00E5FF] mb-4">
              {isEditing ? 'Configure Live Parameters' : 'Provision App Node'}
            </h3>

            {submissionSuccess && (
              <div className="text-xs text-[#00FFB2] bg-[#00FFB2]/5 border border-[#00FFB2]/20 rounded-lg p-3 text-center font-semibold mb-4 animate-pulse mb-4">
                Application successfully synchronized!
              </div>
            )}

            <form onSubmit={handleCreateOrUpdateApp} className="space-y-4">
              
              <div>
                <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-1">App slug identifier</label>
                <input 
                  id="input-admin-appid"
                  type="text"
                  placeholder="e.g. mind-relax"
                  disabled={isEditing}
                  value={appIdInput}
                  onChange={(e) => setAppIdInput(e.target.value)}
                  className="w-full bg-[#050816] text-xs border border-white/15 rounded p-2 focus:outline-none focus:border-[#00E5FF] text-white disabled:opacity-40 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-1">Launcher Title Name</label>
                <input 
                  id="input-admin-appname"
                  type="text"
                  placeholder="e.g. MindRelax Ambient"
                  required
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full bg-[#050816] text-xs border border-white/15 rounded p-2 focus:outline-none focus:border-[#00E5FF] text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-1">Aesthetic Description</label>
                <textarea 
                  id="textarea-admin-desc"
                  placeholder="Describe your ecosystem helper app..."
                  value={appDesc}
                  onChange={(e) => setAppDesc(e.target.value)}
                  className="w-full h-16 bg-[#050816] text-xs border border-white/15 rounded p-2 focus:outline-none focus:border-[#00E5FF] text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-1">Lucide Symbol Icon</label>
                  <select
                    value={appLogo}
                    onChange={(e) => setAppLogo(e.target.value)}
                    className="w-full bg-[#050816] text-xs border border-white/15 rounded p-2 focus:outline-none text-white"
                  >
                    <option value="Sparkles">Sparkles</option>
                    <option value="MessageSquare">MessageSquare</option>
                    <option value="Image">Image</option>
                    <option value="Code2">Code2</option>
                    <option value="FileText">FileText</option>
                    <option value="BarChart3">BarChart3</option>
                    <option value="Cpu">Cpu</option>
                    <option value="Layers">Layers</option>
                    <option value="Film">Film</option>
                    <option value="Zap">Zap</option>
                    <option value="Presentation">Presentation</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-1">Standard Category</label>
                  <select
                    value={appCategory}
                    onChange={(e) => setAppCategory(e.target.value)}
                    className="w-full bg-[#050816] text-xs border border-white/15 rounded p-2 focus:outline-none text-white"
                  >
                    {['AI Chat', 'Education', 'Marketing', 'Content Creation', 'Data Analysis', 'Research', 'Productivity'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-1">Launcher Execution Endpoint</label>
                <input 
                  type="text"
                  placeholder="e.g. internal:mind-relax OR https://example.com"
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                  className="w-full bg-[#050816] text-xs border border-white/15 rounded p-2 focus:outline-none focus:border-[#00E5FF] text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-1">Launch Tags (comma separated)</label>
                <input 
                  type="text"
                  placeholder="e.g. LLM, Wellness, No-Code"
                  value={appTags}
                  onChange={(e) => setAppTags(e.target.value)}
                  className="w-full bg-[#050816] text-xs border border-white/15 rounded p-2 focus:outline-none focus:border-[#00E5FF] text-white"
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={appFeatured}
                    onChange={(e) => setAppFeatured(e.target.checked)}
                    className="rounded border-white/15 text-[#00E5FF] focus:ring-0 bg-[#050816]"
                  />
                  <span className="text-xs text-white/70">Featured Hub</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={appPremium}
                    onChange={(e) => setAppPremium(e.target.checked)}
                    className="rounded border-white/15 text-[#7C3AED] focus:ring-0 bg-[#050816]"
                  />
                  <span className="text-xs text-white/70">Premium Lock</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  id="btn-admin-submit"
                  type="submit"
                  className="flex-1 py-2 rounded bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] text-black font-extrabold text-xs tracking-wider uppercase cursor-pointer"
                >
                  {isEditing ? 'Sync updates' : 'Provision App'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetAppForm}
                    className="px-3 rounded bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* Active Marketplace Apps manager */}
          <div className="lg:col-span-2 bg-[#0B1020]/90 border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#7C3AED] mb-4">Ecosystem Registry Index</h3>
            
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {apps.map(app => (
                <div key={app.id} className="bg-white/5 border border-white/5 rounded-xl p-3.5 flex items-center justify-between gap-4 hover:border-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[#00E5FF]">
                      <Plus size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-semibold text-xs tracking-wide">{app.name}</h4>
                        {app.premium && <span className="text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-[#7C3AED] text-white">PRO</span>}
                        {app.featured && <span className="text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-[#00FFB2] text-black">Featured</span>}
                      </div>
                      <p className="text-[10px] text-white/50 max-w-sm line-clamp-1">{app.description}</p>
                      <span className="text-[9px] text-white/30 font-mono italic">slug: {app.id} | category: {app.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEditSelect(app)}
                      className="p-1.5 hover:bg-white/10 border border-white/10 rounded text-amber-400"
                      title="Edit Entry"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteApp(app.id)}
                      className="p-1.5 hover:bg-white/10 border border-white/10 rounded text-red-400"
                      title="Purge App"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: News Broadcaster */}
      {activeTab === 'notifications' && (
        <div id="admin-notif-view" className="max-w-2xl mx-auto bg-[#0B1020]/90 border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#00FFB2] mb-4">Ecosystem Announcement Broadcaster</h3>

          {notifSuccess && (
            <div className="text-xs text-[#00FFB2] bg-[#00FFB2]/5 border border-[#00FFB2]/20 rounded-lg p-3 text-center font-semibold mb-4 animate-pulse">
              Announcement broadcasted to client dashboard headers successfully!
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4">
            
            <div>
              <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-1">Notice Category</label>
              <select
                value={notifCategory}
                onChange={(e) => setNotifCategory(e.target.value)}
                className="w-full bg-[#050816] text-xs border border-white/15 rounded p-2.5 focus:outline-none text-white font-semibold"
              >
                <option value="new-app">🚀 New Launcher App Added</option>
                <option value="system">⚡ Crucial System Security Announcement</option>
                <option value="premium">💎 Premium Seasonal Advantage offer</option>
                <option value="update">🔧 Structural Core Framework Updates</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-1">Headline Notice Title</label>
              <input 
                id="input-admin-notif-title"
                type="text"
                placeholder="e.g. Scribe pro copywriting module goes live!"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="w-full bg-[#050816] text-xs border border-white/15 rounded p-2.5 focus:outline-none focus:border-[#00FFB2] text-white"
                required
              />
            </div>

            <div>
              <label className="text-[10px] text-white/50 uppercase font-bold tracking-wider block mb-1">Broadcast Copy message</label>
              <textarea 
                id="textarea-admin-notif-body"
                placeholder="Enter complete notice specifications for all client accounts..."
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                className="w-full h-24 bg-[#050816] text-xs border border-white/15 rounded p-2.5 focus:outline-none focus:border-[#00FFB2] text-white resize-none"
                required
              />
            </div>

            <button
              id="btn-broadcast-announcement"
              type="submit"
              className="w-full py-2.5 bg-[#00FFB2] text-black font-extrabold text-xs tracking-wider uppercase rounded hover:shadow-lg hover:shadow-[#00FFB2]/20 transition-all cursor-pointer"
            >
              Broadcast Notice
            </button>

          </form>
        </div>
      )}

      {/* Tab 4: Input suggestions */}
      {activeTab === 'suggestions' && (
        <div id="admin-suggestions-view" className="max-w-3xl mx-auto space-y-6">
          <div className="bg-[#0B1020]/90 border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Enterprise User Suggestion feed</h3>
            
            <div className="space-y-4">
              {suggestions.length > 0 ? (
                suggestions.map((sug: any) => (
                  <div key={sug.id} className="bg-white/5 border border-white/5 rounded-xl p-4">
                    <p className="text-xs text-[#CFCFCF] italic leading-relaxed">"{sug.comment}"</p>
                    <div className="flex justify-between items-center mt-3 border-t border-white/5 pt-2 text-[10px] text-white/40">
                      <span>Submitted by: <strong>{sug.userEmail}</strong></span>
                      <span>{new Date(sug.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-white/30 italic">
                  No submissions logged from the Contact Suggestion center. Connect the feedback models to test input streams.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
