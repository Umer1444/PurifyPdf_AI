"use client";

import React from "react";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-white"
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
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                PurifyPDF
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
              The world's most advanced AI-powered PDF watermark removal tool.
              Preserve your content while eliminating unwanted watermarks with
              pixel-perfect precision.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Umer1444"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <Github className="w-5 h-5 text-gray-300 hover:text-white" />
              </a>
              <a
                href="https://x.com/UmerShaikh1444"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <Twitter className="w-5 h-5 text-gray-300 hover:text-blue-400" />
              </a>
              <a
                href="https://www.linkedin.com/in/umershaikh-ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <Linkedin className="w-5 h-5 text-gray-300 hover:text-blue-500" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Features", "Pricing", "API Docs", "Support"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "GDPR",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-300 hover:translate-x-1 transform inline-block"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright with Pixel Effect */}
            <div className="flex items-center mb-4 md:mb-0">
              <div className="text-gray-400 text-sm font-mono tracking-wider">
                <span className="inline-block w-2 h-2 bg-cyan-400 mr-2 animate-pulse"></span>
                © {currentYear} PurifyPDF
                <span className="inline-block w-2 h-2 bg-purple-400 ml-2 animate-pulse"></span>
              </div>
            </div>

            {/* Made with Love */}
            <div className="flex items-center text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 mx-2 animate-pulse fill-current" />
              <span>by</span>
              <a
                href="https://github.com/Umer1444"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-purple-400 hover:text-purple-300 transition-colors duration-300 font-medium"
              >
                Umer1444
              </a>
            </div>
          </div>

          {/* Pixel Art Style Divider */}
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-1">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-30"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animation: "pulse 2s infinite",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-4 left-4 w-2 h-2 bg-cyan-400 rounded-full opacity-20 animate-ping"></div>
      <div className="absolute bottom-8 right-8 w-1 h-1 bg-purple-400 rounded-full opacity-30 animate-pulse"></div>
    </footer>
  );
};

export default Footer;
