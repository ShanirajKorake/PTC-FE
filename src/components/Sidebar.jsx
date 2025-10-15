import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png"; // adjust path as needed

export default function Sidebar() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-full w-64 p-10 bg-gradient-to-b from-white/70 to-white/40 backdrop-blur-2xl border-r border-gray-200 shadow-lg text-gray-800">
      {/* Current Date & Time */}
      <div className="flex-none mb-6">
        <div className="text-center text-sm text-gray-500">Current Date & Time</div>
        <div className="text-lg font-semibold text-center">
          {dateTime.toLocaleDateString()} <span className="p-1" />
          {dateTime.toLocaleTimeString()}
        </div>
      </div>

      {/* Logo */}
      <div className="flex-1 mb-8 flex justify-center items-center">
        <img
          src={logo}
          alt="App Logo"
          className="w-36 h-auto object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
        />
      </div>

      {/* Sidebar Options */}
      <div className="flex-2 flex flex-col gap-4">
        {["Dashboard", "New Invoice", "History", "Drivers"].map((item) => (
          <button
            key={item}
            className="text-left px-4 py-2 rounded-xl 
              bg-white/60 backdrop-blur-md
              border border-gray-300/50
              shadow-[0_2px_8px_rgba(0,0,0,0.05)]
              hover:bg-white/90 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]
              active:scale-[0.98]
              transition-all duration-300 font-medium text-gray-700"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
