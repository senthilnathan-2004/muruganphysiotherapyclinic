"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Image as ImageIcon, Upload, Copy, Check, X } from "lucide-react";

import { useAdminData } from "@/components/AdminDataProvider";
import { useAdminFeedback } from "@/components/AdminFeedback";
import CustomDropdown from "@/components/CustomDropdown";

export default function AdminGalleryPage() {
  const { confirm, notify } = useAdminFeedback();
  const { gallery: contextGallery, loadingGallery: contextLoading, fetchGallery } = useAdminData();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("gallery");
  const [fileInput, setFileInput] = useState<File | null>(null);

  useEffect(() => {
    if (contextGallery && contextGallery.length > 0) {
      setImages(contextGallery);
      setLoading(false);
    } else if (!contextLoading) {
      setImages([]);
      setLoading(false);
    }
  }, [contextGallery, contextLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileInput(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInput) return;

    setUploading(true);

    try {
      // 1. Read file and compress image using HTML Canvas
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(fileInput);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, height);

            const compressed = canvas.toDataURL("image/jpeg", 0.85);
            resolve(compressed);
          };
          img.onerror = () => reject(new Error("Could not process image file."));
        };
        reader.onerror = () => reject(new Error("Could not read image file."));
      });

      // 2. Upload to ImageKit to obtain CDN URL (falls back gracefully to compressed dataUrl if missing CDN keys)
      let finalImageUrl = dataUrl;
      try {
        const ikRes = await fetch("/api/imagekit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file: dataUrl,
            fileName: fileInput.name || "gallery.jpg",
          }),
        });
        const ikJson = await ikRes.json();
        if (ikRes.ok && ikJson.url) {
          finalImageUrl = ikJson.url;
        }
      } catch (ikErr) {
        console.warn("ImageKit CDN upload skipped, using compressed fallback:", ikErr);
      }

      // 3. Post to gallery API
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: finalImageUrl,
          caption,
          category,
        }),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || resJson.message || "Upload failed");
      }

      notify("success", "Image uploaded successfully to gallery!");
      setCaption("");
      setFileInput(null);

      const fileInputEl = document.getElementById("file-select") as HTMLInputElement;
      if (fileInputEl) fileInputEl.value = "";

      fetchGallery();
    } catch (err: any) {
      console.error(err);
      notify("error", err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete image?",
      message: "This permanently removes the image from the gallery. This cannot be undone.",
      confirmText: "Delete",
    });
    if (!ok) return;

    try {
      const res = await fetch(`/api/gallery?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      fetchGallery();
      notify("success", "Image deleted from gallery.");
    } catch (err) {
      console.error(err);
      notify("error", "Could not delete the image.");
    }
  };

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-3xl text-slate-800">Media Library & Gallery</h1>
        <p className="text-sm text-slate-500 mt-1">Upload images to serve as logos, favicon icons, doctor photos, or facility pictures.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Upload form */}
        <div className="lg:col-span-4 bg-white p-4 sm:p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="font-heading font-bold text-lg text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Upload className="w-5 h-5 text-teal" />
            <span>Upload New Image</span>
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Image File</label>
              <input
                id="file-select"
                type="file"
                required
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-tint file:text-teal hover:file:bg-teal/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Caption</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. Consulting Room"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
              <CustomDropdown
                value={category}
                onChange={(v) => setCategory(v)}
                options={[
                  { value: "gallery", label: "Clinic Gallery Photo" },
                  { value: "logo", label: "Clinic Logo" },
                  { value: "favicon", label: "Favicon / Browser Icon" },
                  { value: "doctors", label: "Doctor Photo" },
                  { value: "services", label: "Service Illustration" },
                  { value: "reviews", label: "Reviewer Photo" }
                ]}
                placeholder="Select Category"
                icon={ImageIcon}
              />
            </div>

            <button
              type="submit"
              disabled={uploading || !fileInput}
              className="w-full bg-teal hover:bg-teal-dark text-white py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading image...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Media</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Media Grid */}
        <div className="lg:col-span-8 bg-white p-4 sm:p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="font-heading font-bold text-lg text-slate-800 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-teal" />
            <span>Uploaded Media Files</span>
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-teal" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No media files uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((img) => (
                <div key={img._id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative group bg-slate-50">
                  <div className="relative aspect-square w-full">
                    <img
                      src={img.imageUrl}
                      alt={img.caption || "Media"}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  
                  {/* Category Indicator */}
                  <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[8px] font-bold px-2 py-0.5 rounded border border-white/10 uppercase">
                    {img.category}
                  </span>

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-2">
                    {img.caption && (
                      <p className="text-[10px] text-white font-semibold truncate mb-1">{img.caption}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(img.imageUrl, img._id)}
                        className="flex-1 bg-white hover:bg-slate-100 text-slate-800 text-[10px] font-bold py-1.5 px-2 rounded flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {copiedId === img._id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === img._id ? "Copied" : "Copy URL"}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(img._id)}
                        className="bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
