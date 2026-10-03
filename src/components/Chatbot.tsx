"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { useFocusTrap } from "@/lib/useFocusTrap";

interface ChatbotProps {
  settings: any;
  doctors: any[];
}

interface Message {
  sender: "bot" | "user";
  text: string;
}

export default function Chatbot({ settings, doctors }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I am Murugan Physio Assistant. How can I help you today? You can ask me about Dr. G. Murugan, clinic timings, treatments, home visits, or booking an appointment.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trapRef = useFocusTrap<HTMLDivElement>(isOpen);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-chatbot", handleToggle);
    return () => window.removeEventListener("toggle-chatbot", handleToggle);
  }, []);

  // Close the chat panel on Esc for keyboard users.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Clear any pending reply timer on unmount so we don't setState after unmount.
  useEffect(() => {
    return () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setLoading(true);

    // Simulate AI thinking and response
    replyTimer.current = setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply = "";

      if (lower.includes("doctor") || lower.includes("specialist") || lower.includes("who is") || lower.includes("murugan")) {
        const docNames = doctors.length > 0 ? doctors.map((d) => d.name).join(" and ") : "Dr. G. Murugan, B.P.T., M.P.T. (Ortho)";
        reply = `Our senior specialist is ${docNames}. He specializes in Orthopaedic Physiotherapy, stroke rehab, joint pain, paralysis recovery, and personalized home visit care.`;
      } else if (lower.includes("home") || lower.includes("visit") || lower.includes("house") || lower.includes("வீடு")) {
        reply = "Yes! Dr. G. Murugan provides dedicated Home Visit Physiotherapy ('உங்கள் வீட்டிற்கு வந்து இயன்முறை சிகிச்சை அளிக்கப்படும்') for patients who need care at home. Call or WhatsApp +91 97863 14138 to request a home visit.";
      } else if (lower.includes("time") || lower.includes("hour") || lower.includes("when")) {
        reply = `Murugan Physiotherapy Clinic consulting hours are: ${settings?.workingHours || "Mon - Sat: 5:30 PM - 8:30 PM (Sunday Holiday) | Home Visit Care Available"}.`;
      } else if (lower.includes("book") || lower.includes("appointment") || lower.includes("schedule")) {
        reply = "To book an appointment or request a home visit, use our online booking form, click the WhatsApp button, or call Dr. G. Murugan at " + (settings?.phone || "+91 97863 14138") + ".";
      } else if (lower.includes("pain") || lower.includes("injury") || lower.includes("treatment") || lower.includes("therapy")) {
        reply = "We offer specialized physiotherapy for neck pain, back pain & sciatica, frozen shoulder, knee arthritis, muscle spasms, sprains, stroke / paralysis rehab, facial palsy, heel pain, and post-fracture recovery.";
      } else if (lower.includes("condition") || lower.includes("treat")) {
        reply = "We treat neck pain, back pain, shoulder pain (frozen shoulder), knee pain, muscle spasms, sprains, stroke/paralysis recovery, Bell's palsy, heel pain, and post-fracture stiffness.";
      } else if (lower.includes("contact") || lower.includes("number") || lower.includes("phone") || lower.includes("email") || lower.includes("address") || lower.includes("where")) {
        reply = `You can call Dr. G. Murugan at ${settings?.phone || "+91 97863 14138"}, or visit us at ${settings?.address || "No. 343, Badhur Road, Opposite to Sendamizh Matriculation School, Mangalam Mamandur, Kilkodungalur - 604 403"}.`;
      } else {
        reply = "Thank you for reaching out! Dr. G. Murugan treats a wide spectrum of orthopaedic and neurological conditions with clinic consultations and home visits. Please call or WhatsApp " + (settings?.phone || "+91 97863 14138") + ".";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      {/* Chat Window Panel */}
      {isOpen && (
        <div ref={trapRef} role="dialog" aria-modal="false" aria-label="Murugan Physio Assistant chat" className="fixed z-[60] bottom-24 right-6 sm:bottom-6 sm:right-24 w-[calc(100vw-3rem)] max-w-[360px] sm:w-[380px] h-[480px] max-h-[calc(100vh-8rem)] bg-white rounded-3xl border border-brand-border shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-teal p-5 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm leading-tight">Murugan Physio Assistant</h4>
                <p className="text-[10px] text-teal-tint font-medium">Online | Clinical Support Agent</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-brand-cream/10">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-pink text-white" : "bg-teal-tint text-teal-dark border border-teal/20"
                  }`}>
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${msg.sender === "user"
                    ? "bg-pink text-white rounded-tr-none"
                    : "bg-white border border-brand-border text-brand-ink rounded-tl-none shadow-sm"
                  }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-full bg-teal-tint text-teal-dark flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-brand-border p-3.5 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-teal" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-brand-border bg-white flex items-center gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ask me something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-4 py-2.5 border border-brand-border rounded-xl focus:outline-none focus:border-teal text-xs text-brand-ink"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              aria-label="Send message"
              className="bg-teal hover:bg-teal-dark text-white p-2.5 rounded-xl transition-colors shadow-sm active:scale-95 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
