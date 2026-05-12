"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard({ platforms }: { platforms: Record<string, any[]> }) {
  const router = useRouter();
  const platformNames = Object.keys(platforms).sort();
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // State for inline editing
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ text: '', scheduleDate: '', scheduleTime: '' });
  const [isSaving, setIsSaving] = useState(false);

  const allPosts = Object.entries(platforms).flatMap(([platform, posts]) => 
    posts.map(post => ({ ...post, platform }))
  );

  const pendingCountTotal = allPosts.filter(p => !p.posted && !p.error).length;
  const errorCountTotal = allPosts.filter(p => p.error).length;

  const handleEditClick = (post: any) => {
    setEditingPostId(post.id);
    setEditForm({
      text: post.text,
      scheduleDate: post.scheduleDate || '',
      scheduleTime: post.scheduleTime || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
  };

  const handleSavePost = async (platform: string, postId: string) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          postId,
          text: editForm.text,
          scheduleDate: editForm.scheduleDate,
          scheduleTime: editForm.scheduleTime
        })
      });

      if (!res.ok) {
        throw new Error('Failed to save');
      }

      setEditingPostId(null);
      router.refresh(); 
    } catch (err) {
      alert('Error saving post. See console.');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const today = () => setCurrentDate(new Date());

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const postsToShow = activeTab === 'overview' ? allPosts : platforms[activeTab].map(p => ({...p, platform: activeTab}));

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 md:px-6 font-sans">
      <div className="container mx-auto max-w-[1400px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Social Media Command Center
            </h1>
            <p className="text-muted-foreground text-lg">Detailed overview of your connected social pipelines.</p>
          </div>
          
          {/* View Toggle */}
          <div className="flex bg-secondary rounded-lg p-1 border border-border">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'calendar' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'list' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              List View
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors border ${
              activeTab === 'overview'
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
            }`}
          >
            <span>Overview</span>
            {pendingCountTotal > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === 'overview' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}>
                {pendingCountTotal}
              </span>
            )}
            {errorCountTotal > 0 && (
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            )}
          </button>

          {platformNames.map((platform) => {
            const pendingCount = platforms[platform].filter((p) => !p.posted && !p.error).length;
            const errorCount = platforms[platform].filter((p) => p.error).length;
            
            return (
              <button
                key={platform}
                onClick={() => setActiveTab(platform)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors border ${
                  activeTab === platform
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
                }`}
              >
                <span className="capitalize">{platform.replace('-', ' ')}</span>
                
                {pendingCount > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeTab === platform ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {pendingCount}
                  </span>
                )}
                {errorCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm relative overflow-hidden">
          
          {viewMode === 'calendar' ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold capitalize">
                  {activeTab === 'overview' ? 'Global Calendar' : `${activeTab.replace('-', ' ')} Calendar`}
                </h2>
                <div className="flex items-center gap-2">
                  <button onClick={prevMonth} className="p-2 border border-border rounded hover:bg-secondary text-sm">&larr;</button>
                  <button onClick={today} className="px-4 py-2 border border-border rounded hover:bg-secondary text-sm font-medium">Today</button>
                  <button onClick={nextMonth} className="p-2 border border-border rounded hover:bg-secondary text-sm">&rarr;</button>
                </div>
              </div>

              <div className="text-xl font-medium mb-4 text-center">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>

              <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border border-border">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-secondary/50 p-2 text-center text-xs font-semibold uppercase text-muted-foreground">
                    {day}
                  </div>
                ))}

                {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-card/50 min-h-[120px] p-2" />
                ))}

                {Array.from({ length: getDaysInMonth(currentDate) }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  
                  // For posted items, sometimes they lack scheduleDate but have postedAt
                  const dayPosts = postsToShow.filter(p => {
                    if (p.scheduleDate === dateStr) return true;
                    if (p.postedAt && p.postedAt.startsWith(dateStr)) return true;
                    return false;
                  });

                  const isToday = new Date().toISOString().split('T')[0] === dateStr;

                  return (
                    <div key={day} className={`bg-card min-h-[120px] p-2 flex flex-col gap-1 hover:bg-secondary/20 transition-colors ${isToday ? 'ring-2 ring-primary ring-inset' : ''}`}>
                      <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
                        {day}
                      </span>
                      
                      <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[150px] custom-scrollbar">
                        {dayPosts.map((post, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => { setViewMode('list'); handleEditClick(post); }}
                            className={`text-[10px] p-1.5 rounded border cursor-pointer hover:opacity-80 transition-opacity truncate ${
                              post.error ? 'bg-destructive/10 border-destructive/30 text-destructive' :
                              post.posted ? 'bg-secondary/50 border-border text-muted-foreground line-through' :
                              'bg-primary/10 border-primary/20 text-primary'
                            }`}
                            title={`${post.platform.toUpperCase()} - ${post.text}`}
                          >
                            <span className="font-semibold uppercase mr-1 opacity-70">{post.platform.substring(0,2)}</span>
                            {post.scheduleTime || '??:??'} 
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-end border-b border-border pb-6 mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold capitalize tracking-tight">
                    {activeTab === 'overview' ? 'Global Timeline' : `${activeTab.replace('-', ' ')} Queue`}
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">
                    {activeTab === 'overview' 
                      ? `Showing all ${allPosts.length} posts across all platforms.` 
                      : `${platforms[activeTab].filter(p => !p.posted).length} posts remaining in schedule.`}
                  </p>
                </div>
              </div>

              {postsToShow.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border">
                  <p className="text-lg">No posts found.</p>
                </div>
              ) : (
                <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                  {postsToShow
                    .sort((a, b) => {
                      if (a.error && !b.error) return -1;
                      if (!a.error && b.error) return 1;
                      if (a.posted !== b.posted) return a.posted ? 1 : -1;
                      if (!a.posted) {
                         const dateA = a.scheduleDate + ' ' + a.scheduleTime;
                         const dateB = b.scheduleDate + ' ' + b.scheduleTime;
                         return dateA.localeCompare(dateB);
                      }
                      return new Date(b.postedAt || 0).getTime() - new Date(a.postedAt || 0).getTime();
                    })
                    .map((post, idx) => {
                      const isEditing = editingPostId === post.id;

                      return (
                      <div
                        key={idx}
                        className={`p-5 rounded-xl border transition-colors ${
                          post.error
                            ? 'bg-destructive/10 border-destructive/30'
                            : post.posted
                            ? 'bg-secondary/50 border-border opacity-70'
                            : 'bg-card border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[11px] px-2.5 py-1 rounded-full font-bold uppercase bg-foreground text-background">
                              {post.platform}
                            </span>
                            <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold tracking-wider uppercase ${
                              post.error ? 'bg-destructive text-destructive-foreground' :
                              post.posted ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                              'bg-primary/10 text-primary'
                            }`}>
                              {post.error ? 'Error' : post.posted ? 'Posted' : 'Pending'}
                            </span>
                            
                            {!isEditing && (
                              <span className="text-sm font-medium text-foreground">
                                {post.posted && post.postedAt 
                                  ? new Date(post.postedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
                                  : `${post.scheduleDate} at ${post.scheduleTime}`}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground font-mono bg-secondary px-2 py-1 rounded-md border border-border">
                              {post.id}
                            </span>
                            {!post.posted && !isEditing && (
                              <button 
                                onClick={() => handleEditClick(post)}
                                className="text-xs px-3 py-1 bg-secondary hover:bg-secondary/80 rounded-md border border-border"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {isEditing ? (
                          <div className="mt-4 space-y-4">
                            <div>
                              <label className="block text-xs text-muted-foreground mb-1">Post Content</label>
                              <textarea 
                                value={editForm.text}
                                onChange={(e) => setEditForm({...editForm, text: e.target.value})}
                                className="w-full bg-background border border-border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
                              />
                            </div>
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <label className="block text-xs text-muted-foreground mb-1">Date (YYYY-MM-DD)</label>
                                <input 
                                  type="text" 
                                  value={editForm.scheduleDate}
                                  onChange={(e) => setEditForm({...editForm, scheduleDate: e.target.value})}
                                  className="w-full bg-background border border-border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-xs text-muted-foreground mb-1">Time (HH:MM)</label>
                                <input 
                                  type="text" 
                                  value={editForm.scheduleTime}
                                  onChange={(e) => setEditForm({...editForm, scheduleTime: e.target.value})}
                                  className="w-full bg-background border border-border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end pt-2">
                              <button 
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                                className="px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-md disabled:opacity-50"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => handleSavePost(post.platform, post.id)}
                                disabled={isSaving}
                                className="px-4 py-2 text-sm bg-primary text-primary-foreground hover:bg-primary/90 rounded-md disabled:opacity-50"
                              >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
                            {post.text || <span className="italic opacity-50">No text content</span>}
                          </p>
                        )}

                        {post.error && (
                          <div className="mt-4 text-[13px] text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 font-mono overflow-x-auto">
                            {post.error}
                          </div>
                        )}
                      </div>
                    )})}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted));
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground));
        }
      `}} />
    </div>
  );
}
