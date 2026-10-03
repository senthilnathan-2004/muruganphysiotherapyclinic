"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Settings, ShieldAlert, Globe, Info, Share2, Smartphone, Plus, Trash2, ArrowLeft, ArrowRight, RotateCcw, Image as ImageIcon } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

import { useAdminData } from "@/components/AdminDataProvider";

export default function AdminSettingsPage() {
  const { settings: contextSettings, loadingSettings: contextLoading, fetchSettings } = useAdminData();
  const [settings, setSettings] = useState<any>({
    clinicName: "",
    tagline: "",
    logo: "",
    favicon: "",
    heroImage: "",
    heroMobileImages: [],
    address: "",
    phone: "",
    email: "",
    whatsapp: "",
    mapsUrl: "",
    workingHours: "",
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    aboutBadge: "",
    aboutTitle: "",
    aboutDesc1: "",
    aboutDesc2: "",
    aboutMission: "",
    aboutMissionDesc: "",
    aboutVision: "",
    aboutVisionDesc: "",
    aboutPremium: "",
    aboutPremiumDesc: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (contextSettings) {
      setSettings(contextSettings);
      setLoading(false);
    } else if (!contextLoading) {
      setLoading(false);
    }
  }, [contextSettings, contextLoading]);

  const handleAddHeroMobileImage = () => {
    setSettings((prev: any) => ({
      ...prev,
      heroMobileImages: [
        ...(prev.heroMobileImages || []),
        { imageUrl: "/herobanner.jpg", caption: "Clinic Therapy" },
      ],
    }));
  };

  const handleUpdateHeroMobileImage = (index: number, key: string, value: string) => {
    setSettings((prev: any) => {
      const list = [...(prev.heroMobileImages || [])];
      list[index] = { ...list[index], [key]: value };
      return { ...prev, heroMobileImages: list };
    });
  };

  const handleRemoveHeroMobileImage = (index: number) => {
    setSettings((prev: any) => {
      const list = (prev.heroMobileImages || []).filter((_: any, i: number) => i !== index);
      return { ...prev, heroMobileImages: list };
    });
  };

  const handleMoveHeroMobileImage = (fromIndex: number, toIndex: number) => {
    setSettings((prev: any) => {
      const list = [...(prev.heroMobileImages || [])];
      if (toIndex < 0 || toIndex >= list.length) return prev;
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      return { ...prev, heroMobileImages: list };
    });
  };

  const handleRestoreDefaultHeroMobileImages = () => {
    setSettings((prev: any) => ({
      ...prev,
      heroMobileImages: [
        {
          imageUrl:
            "https://ik.imagekit.io/senra6374/mvp-physio-clinic/Physiotherapy_image_color_backgr__2K_20261003205215_cSeEtgTQH.jpg",
          caption: "Manual Therapy",
        },
        {
          imageUrl:
            "https://ik.imagekit.io/senra6374/mvp-physio-clinic/Editing_doctor_position_and_back__2K_20261003211001_YY_f3I2I14.jpg",
          caption: "Doctor Consult",
        },
        {
          imageUrl:
            "https://ik.imagekit.io/senra6374/mvp-physio-clinic/usman-yousaf-pTrhfmj2jDA-unsplash_AD6lJwu-2.jpg",
          caption: "Electrotherapy Unit",
        },
        {
          imageUrl:
            "https://ik.imagekit.io/senra6374/mvp-physio-clinic/usman-yousaf-pTrhfmj2jDA-unsplash_Nr8vmtsL0x.jpg",
          caption: "Rehab Studio",
        },
        {
          imageUrl: "/herobanner.jpg",
          caption: "Orthopaedic Care",
        },
      ],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to update settings");
      const updated = await res.json();
      setSettings(updated);
      await fetchSettings();
      setMessage({ text: "Clinic settings updated successfully!", type: "success" });
    } catch (err: any) {
      setMessage({ text: err.message || "Failed to save settings.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-teal" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-3xl text-slate-800">Clinic Profile & Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure profile, contact coordinates, hours, and SEO variables.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl border text-sm ${
          message.type === "success" 
            ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
            : "bg-rose-50 border-rose-100 text-rose-700"
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core Profile */}
        <div className="bg-white p-5 sm:p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Settings className="w-5 h-5 text-teal" />
            <span>General Profile Settings</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Clinic Name</label>
              <input
                type="text"
                name="clinicName"
                value={settings.clinicName || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <ImageUploader
                value={settings.logo || ""}
                onChange={(val) => setSettings((prev: any) => ({ ...prev, logo: val }))}
                label="Clinic Logo"
                aspectRatio="video"
                objectFit="contain"
              />
            </div>
            <div>
              <ImageUploader
                value={settings.favicon || ""}
                onChange={(val) => setSettings((prev: any) => ({ ...prev, favicon: val }))}
                label="Clinic Favicon (Browser Tab Icon)"
                aspectRatio="video"
                objectFit="contain"
              />
            </div>
            <div>
              <ImageUploader
                value={settings.heroImage || ""}
                onChange={(val) => setSettings((prev: any) => ({ ...prev, heroImage: val }))}
                label="Hero Section Image"
                aspectRatio="video"
                objectFit="contain"
              />
            </div>
          </div>
        </div>

        {/* Mobile Hero Half-Round Scrolling Showcase */}
        <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-teal" />
                <span>Mobile Hero Scrolling Showcase (Half-Round Arches)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Images shown exclusively in the hero section on mobile screens, rendered with distinct architectural half-round arches in a continuous infinite stream.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleRestoreDefaultHeroMobileImages}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                title="Restore default clinical images"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Defaults</span>
              </button>
              <button
                type="button"
                onClick={handleAddHeroMobileImage}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal hover:bg-teal-dark text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Image</span>
              </button>
            </div>
          </div>

          {(!settings.heroMobileImages || settings.heroMobileImages.length === 0) ? (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">No custom mobile hero images added yet</p>
              <p className="text-xs text-slate-400 mt-0.5 max-w-sm mx-auto">
                Currently showing default clinical treatment photos. Click &quot;Add Image&quot; or &quot;Defaults&quot; to customize.
              </p>
              <button
                type="button"
                onClick={handleRestoreDefaultHeroMobileImages}
                className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-teal text-white rounded-xl text-xs font-bold hover:bg-teal-dark transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Load Default Showcase Photos</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {settings.heroMobileImages.map((item: any, idx: number) => {
                const imgUrl = typeof item === "string" ? item : item.imageUrl;
                const captionText = typeof item === "string" ? "" : item.caption || "";

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal/30 hover:shadow-md transition-all flex flex-col justify-between gap-3 relative group"
                  >
                    {/* Top Action Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Card #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveHeroMobileImage(idx, idx - 1)}
                          className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 cursor-pointer"
                          title="Move left"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === settings.heroMobileImages.length - 1}
                          onClick={() => handleMoveHeroMobileImage(idx, idx + 1)}
                          className="p-1 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 cursor-pointer"
                          title="Move right"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveHeroMobileImage(idx)}
                          className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Half-Round Architectural Preview */}
                    <div className="relative mx-auto w-28 h-40 rounded-t-[56px] rounded-b-[16px] overflow-hidden border-2 border-slate-300 shadow-md bg-white">
                      {/* Ambient backdrop */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl || "/herobanner.jpg"}
                          alt=""
                          aria-hidden="true"
                          className="w-full h-full object-cover blur-md opacity-25 scale-110"
                        />
                      </div>

                      {/* Centered Main Image */}
                      <div className="absolute inset-x-0 top-0 bottom-7 flex items-center justify-center p-2 pt-2.5 z-10 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgUrl || "/herobanner.jpg"}
                          alt={captionText || "Preview"}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/herobanner.jpg";
                          }}
                          className="max-w-full max-h-full w-auto h-auto object-contain"
                        />
                      </div>

                      <div className="absolute inset-x-0 top-0 h-8 rounded-t-[56px] bg-gradient-to-b from-white/35 to-transparent pointer-events-none z-20" />
                      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none z-20" />

                      {captionText && (
                        <div className="absolute bottom-1.5 inset-x-1 text-center pointer-events-none z-30">
                          <span className="inline-block max-w-full px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white bg-slate-950/85 backdrop-blur-md border border-white/20 truncate shadow-xs">
                            {captionText}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Upload or change image */}
                    <div>
                      <ImageUploader
                        value={imgUrl || ""}
                        onChange={(val) => handleUpdateHeroMobileImage(idx, "imageUrl", val)}
                        label="Change Photo"
                        aspectRatio="any"
                        objectFit="cover"
                      />
                    </div>

                    {/* Caption Input */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                        Caption / Service Label
                      </label>
                      <input
                        type="text"
                        value={captionText}
                        onChange={(e) => handleUpdateHeroMobileImage(idx, "caption", e.target.value)}
                        placeholder="e.g. Manual Therapy"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contact Coordinates */}
        <div className="bg-white p-5 sm:p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
            <ShieldAlert className="w-5 h-5 text-teal" />
            <span>Contact Info & Channels</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={settings.phone || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">WhatsApp Number</label>
              <input
                type="text"
                name="whatsapp"
                value={settings.whatsapp || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={settings.email || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Working Hours Text</label>
              <input
                type="text"
                name="workingHours"
                value={settings.workingHours || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Clinic Address</label>
            <textarea
              name="address"
              rows={3}
              value={settings.address || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Google Maps Embed iframe URL</label>
            <input
              type="text"
              name="mapsUrl"
              value={settings.mapsUrl || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-5 sm:p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-teal" />
              <span>Social Media Links</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Paste the full profile URL (e.g. https://facebook.com/yourclinic). Leave a field
              blank to hide that icon — empty links are not shown in the website footer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Facebook URL</label>
              <input
                type="url"
                name="facebook"
                value={settings.facebook || ""}
                onChange={handleChange}
                placeholder="https://facebook.com/yourclinic"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Instagram URL</label>
              <input
                type="url"
                name="instagram"
                value={settings.instagram || ""}
                onChange={handleChange}
                placeholder="https://instagram.com/yourclinic"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">YouTube URL</label>
              <input
                type="url"
                name="youtube"
                value={settings.youtube || ""}
                onChange={handleChange}
                placeholder="https://youtube.com/@yourclinic"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={settings.linkedin || ""}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/yourclinic"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* SEO Management */}
        <div className="bg-white p-5 sm:p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Globe className="w-5 h-5 text-teal" />
            <span>SEO Metadata Config</span>
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Meta Title</label>
            <input
              type="text"
              name="seoTitle"
              value={settings.seoTitle || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Meta Description</label>
            <textarea
              name="seoDescription"
              rows={3}
              value={settings.seoDescription || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Keywords (Comma separated)</label>
            <input
              type="text"
              name="seoKeywords"
              value={settings.seoKeywords || ""}
              onChange={handleChange}
              placeholder="physiotherapist, orthopaedic physiotherapy, rehabilitation"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
            />
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white p-5 sm:p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2">
              <Info className="w-5 h-5 text-teal" />
              <span>About Section</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Shown on the homepage About block. Leave a field blank to use the built-in multi-language default;
              any value entered here overrides all languages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Badge Label</label>
              <input
                type="text"
                name="aboutBadge"
                value={settings.aboutBadge || ""}
                onChange={handleChange}
                placeholder="About Murugan Physio Clinic"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Heading</label>
              <input
                type="text"
                name="aboutTitle"
                value={settings.aboutTitle || ""}
                onChange={handleChange}
                placeholder="Dedicated orthopaedic physiotherapy & rehabilitation care"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Paragraph 1</label>
            <textarea
              name="aboutDesc1"
              rows={3}
              value={settings.aboutDesc1 || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Paragraph 2</label>
            <textarea
              name="aboutDesc2"
              rows={3}
              value={settings.aboutDesc2 || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Mission Title</label>
              <input
                type="text"
                name="aboutMission"
                value={settings.aboutMission || ""}
                onChange={handleChange}
                placeholder="Our Mission"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
              <textarea
                name="aboutMissionDesc"
                rows={2}
                value={settings.aboutMissionDesc || ""}
                onChange={handleChange}
                placeholder="Mission description"
                className="mt-3 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Vision Title</label>
              <input
                type="text"
                name="aboutVision"
                value={settings.aboutVision || ""}
                onChange={handleChange}
                placeholder="Our Vision"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
              <textarea
                name="aboutVisionDesc"
                rows={2}
                value={settings.aboutVisionDesc || ""}
                onChange={handleChange}
                placeholder="Vision description"
                className="mt-3 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-2">Premium Standards Title</label>
            <input
              type="text"
              name="aboutPremium"
              value={settings.aboutPremium || ""}
              onChange={handleChange}
              placeholder="Premium Standards"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
            />
            <textarea
              name="aboutPremiumDesc"
              rows={2}
              value={settings.aboutPremiumDesc || ""}
              onChange={handleChange}
              placeholder="Premium standards description"
              className="mt-3 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-teal text-white hover:bg-teal-dark px-8 py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>Save Profile Settings</span>
        </button>

      </form>
    </div>
  );
}
