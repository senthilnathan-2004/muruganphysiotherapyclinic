import React, { useState, useEffect, useRef } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function CustomDatePicker({
  value,
  onChange,
  min,
  max,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  min?: string;
  max?: string;
  error?: string;
}) {
  // Use today as a fallback for initialization, not strictly for min/max
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minDate = min ? new Date(min + "T00:00:00") : null;
  const maxDate = max ? new Date(max + "T00:00:00") : null;

  const initDate = value ? new Date(value + "T00:00:00") : (minDate || today);
  const [open, setOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // Calendar height is ~310px. If not enough space below and more space above, open upwards
      if (spaceBelow < 320 && rect.top > spaceBelow) {
        setOpenUpwards(true);
      } else {
        setOpenUpwards(false);
      }
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const selectDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    onChange(str);
    setOpen(false);
  };

  const isOutOfRange = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    if (minDate && d < minDate) return true;
    if (maxDate && d > maxDate) return true;
    return false;
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const d = new Date(viewYear, viewMonth, day);
    return d.toDateString() === new Date(value + "T00:00:00").toDateString();
  };

  const isToday = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d.toDateString() === today.toDateString();
  };

  const displayValue = value
    ? new Date(value + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left bg-white transition-all duration-200 cursor-pointer hover:border-teal/60
          ${open ? "border-teal ring-2 ring-teal/10" : "border-brand-border"}
          ${error ? "border-rose-400" : ""}
        `}
      >
        <Calendar className="w-5 h-5 text-brand-muted/70 shrink-0" />
        <span className={`flex-1 ${value ? "text-brand-ink" : "text-brand-muted/60"}`}>
          {displayValue || "Select a date"}
        </span>
        <ChevronDown className={`w-4 h-4 text-brand-muted/60 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className={`absolute z-[100] ${
            openUpwards ? "bottom-full mb-2" : "top-full mt-2"
          } right-0 sm:left-0 bg-white border border-brand-border rounded-2xl shadow-2xl p-4 w-72 max-w-[calc(100vw-2.5rem)]`}
        >
          {/* Month/Year Navigation */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-teal-tint text-brand-muted hover:text-teal transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-brand-ink">{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-teal-tint text-brand-muted hover:text-teal transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-1.5">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-brand-muted/60 uppercase py-1">{d}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const outOfRange = isOutOfRange(day);
              const selected = isSelected(day);
              const todayDay = isToday(day);
              return (
                <button
                  key={day}
                  type="button"
                  disabled={outOfRange}
                  onClick={() => selectDay(day)}
                  className={`w-8 h-8 mx-auto flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer
                    ${selected ? "bg-teal text-white shadow-sm" : ""}
                    ${todayDay && !selected ? "border border-teal text-teal font-bold" : ""}
                    ${outOfRange ? "text-brand-muted/30 cursor-not-allowed" : ""}
                    ${!selected && !outOfRange ? "hover:bg-teal-tint text-brand-ink" : ""}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
    </div>
  );
}
