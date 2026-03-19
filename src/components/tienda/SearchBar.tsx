"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Buscar samples, presets, drum kits...",
  className = "",
}: SearchBarProps) {
  return (
    <div
      className={`flex items-center gap-3 h-[48px] rounded-full bg-bg-elevated border border-border-subtle focus-within:border-neon-green focus-within:shadow-[0_0_20px_rgba(0,255,178,0.1)] transition-all ${className}`}
      style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem' }}
    >
      <Search className="w-5 h-5 text-text-muted shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 h-full bg-transparent outline-none text-text-primary placeholder:text-text-muted text-sm"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="p-1 rounded-full hover:bg-white/10 text-text-muted hover:text-text-primary transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
