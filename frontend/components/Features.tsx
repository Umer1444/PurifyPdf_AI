"use client";

import { motion } from "framer-motion";
import { Brain, Shield, Zap, Eye, Download, Palette } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Smart Logo Detection",
    description:
      "Automatically detects and removes Gemini logos, ChatGPT watermarks, VoxDeck.ai boxes, and other AI-generated branding",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Content Preservation",
    description:
      "Maintains original text, images, and layout structure while intelligently removing only watermark elements",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Multi-Layer Processing",
    description:
      "Advanced AI pipeline processes text overlays, image watermarks, and logo stamps in a single pass",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Eye,
    title: "Visual Recognition",
    description:
      "Computer vision algorithms identify watermark patterns, logos, and branded elements across different PDF formats",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Download,
    title: "Batch Processing",
    description:
      "Process multiple PDFs with different watermark types simultaneously with consistent quality results",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Palette,
    title: "Custom Detection",
    description:
      "Train the AI to recognize your specific watermarks or manually select regions for precise removal",
    color: "from-red-500 to-pink-500",
  },
];

export function Features() {
  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Powerful Features
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Our AI-powered solution combines cutting-edge technology with
          user-friendly design to deliver the best watermark removal experience.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="card group hover:glow-border transition-all duration-300"
          >
            <div className="mb-6">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {[
          { value: "97%", label: "Accuracy Rate" },
          { value: "<8s", label: "Processing Time" },
          { value: "50MB", label: "Max File Size" },
          { value: "99.9%", label: "Uptime" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
              {stat.value}
            </div>
            <div className="text-gray-400 text-sm uppercase tracking-wide">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
