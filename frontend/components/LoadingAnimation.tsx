"use client";

import React from "react";

const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main Loading Content */}
      <div className="relative z-10 text-center">
        {/* Spinning Logo */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto relative">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 border-r-purple-400 rounded-full animate-spin"></div>
            {/* Inner Ring */}
            <div className="absolute inset-2 border-4 border-transparent border-b-pink-400 border-l-blue-400 rounded-full animate-spin animate-reverse"></div>
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* App Name with Glitch Effect */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            PurifyPDF
          </h1>
          <div className="text-xl text-gray-300 mt-2 font-light tracking-wider">
            AI-Powered Watermark Removal
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {/* Loading Text */}
        <div className="text-gray-400 text-sm animate-pulse">
          Initializing AI Engine...
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-gray-700 rounded-full mx-auto mt-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-cyan-400 rounded-full opacity-30 animate-ping"></div>
      <div className="absolute bottom-20 right-20 w-6 h-6 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-pink-400 rounded-full opacity-40 animate-bounce"></div>
    </div>
  );
};

export default LoadingAnimation;
