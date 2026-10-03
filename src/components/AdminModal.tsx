"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface AdminModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export default function AdminModal({ isOpen, onClose, children }: AdminModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Optional backdrop click handler */}
      <div className="absolute inset-0" onClick={onClose} />
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-lg mx-auto flex justify-center">
        {children}
      </div>
    </div>,
    document.body
  );
}
