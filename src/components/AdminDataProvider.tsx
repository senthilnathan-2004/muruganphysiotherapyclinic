"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminDataContextType {
  settings: any;
  loadingSettings: boolean;
  fetchSettings: () => Promise<void>;
  
  doctors: any[];
  loadingDoctors: boolean;
  fetchDoctors: () => Promise<void>;
  
  gallery: any[];
  loadingGallery: boolean;
  fetchGallery: () => Promise<void>;
  
  blogs: any[];
  loadingBlogs: boolean;
  fetchBlogs: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<any>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  const [doctors, setDoctors] = useState<any[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  const [gallery, setGallery] = useState<any[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctors");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setDoctors(data);
      }
    } catch (err) {
      console.error("Failed to load doctors:", err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setGallery(data);
      }
    } catch (err) {
      console.error("Failed to load gallery:", err);
    } finally {
      setLoadingGallery(false);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setBlogs(data);
      }
    } catch (err) {
      console.error("Failed to load blogs:", err);
    } finally {
      setLoadingBlogs(false);
    }
  };

  // Pre-load admin data actually consumed via context on mount. Appointments,
  // reviews, messages, and services are intentionally NOT preloaded here: every
  // page that shows them (`/admin/appointments`, `/admin/reviews`,
  // `/admin/messages`, `/admin/services`) fetches its own data directly and
  // never reads from this context, so preloading them was pure dead weight —
  // including an unbounded, populate-heavy appointments query — paid on every
  // single admin page load regardless of which page was open.
  useEffect(() => {
    Promise.all([
      fetchSettings(),
      fetchDoctors(),
      fetchGallery(),
      fetchBlogs(),
    ]).catch(err => console.error("Initial context loading failed:", err));
  }, []);

  return (
    <AdminDataContext.Provider
      value={{
        settings,
        loadingSettings,
        fetchSettings,
        doctors,
        loadingDoctors,
        fetchDoctors,
        gallery,
        loadingGallery,
        fetchGallery,
        blogs,
        loadingBlogs,
        fetchBlogs,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
}
