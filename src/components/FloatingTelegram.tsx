import React, { useState } from 'react';

export function FloatingTelegram() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      id="floating-telegram-widget"
      className="fixed left-5 bottom-6 z-50 flex items-center gap-3 group"
    >
      <a
        id="btn-floating-telegram"
        href="https://t.me/SmartMenu7"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Contact us on Telegram"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#24A1DE] text-white shadow-xl shadow-sky-500/30 hover:scale-110 active:scale-95 transition-all duration-300 hover:bg-[#1f93cc] focus:outline-none focus:ring-4 focus:ring-sky-300"
      >
        {/* Animated pulse ring */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#24A1DE] opacity-30 animate-ping -z-10" />

        {/* Telegram Icon */}
        <svg 
          className="w-7 h-7 fill-current translate-x-[-1px] translate-y-[1px]" 
          viewBox="0 0 24 24" 
          aria-hidden="true"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.919z" />
        </svg>

        {/* Online Indicator Dot */}
        <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>
      </a>

      {/* Floating Pill Label / Tooltip */}
      <a
        href="https://t.me/SmartMenu7"
        target="_blank"
        rel="noopener noreferrer"
        className={`hidden sm:flex items-center gap-2 bg-stone-900/90 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg backdrop-blur-sm border border-stone-800 transition-all duration-300 whitespace-nowrap ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-85 translate-x-0'
        }`}
      >
        <span>Chat on Telegram</span>
        <span className="text-[10px] text-sky-400 font-mono">@SmartMenu7</span>
      </a>
    </div>
  );
}
