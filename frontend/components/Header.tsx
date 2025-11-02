"use client";

import { motion } from "framer-motion";
import { Zap, Github, Star, LogOut, User as UserIcon } from "lucide-react";
import { logOut, User } from "@/lib/auth";

interface HeaderProps {
  user?: User | null;
}

export function Header({ user }: HeaderProps) {
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-white/10 glass-effect"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <Zap className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-white">PurifyPDF</h1>
              <p className="text-sm text-gray-400">
                AI-Powered Watermark Removal
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Info */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <UserIcon className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="text-sm text-white hidden sm:inline">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                </div>
              </div>
            )}

            <motion.a
              href="https://github.com/Umer1444"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">GitHub</span>
            </motion.a>

            <motion.button
              className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star className="w-5 h-5" />
              <span className="hidden sm:inline">Star</span>
            </motion.button>

            {/* Logout Button */}
            {user && (
              <motion.button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
