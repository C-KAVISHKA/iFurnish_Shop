import React from "react";
import { motion } from "framer-motion";

const AnimatedBotIcon = ({ size = 28, className = "" }) => {
  return (
    <motion.div
      className={`relative flexCenter select-none ${className}`}
      style={{ width: size, height: size }}
      animate={{
        y: [0, -3, 0],
      }}
      transition={{
        duration: 2.6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Antenna Pulsing Ring */}
        <motion.circle
          cx="32"
          cy="7"
          r="5"
          fill="#fcd34d"
          animate={{
            scale: [1, 1.45, 1],
            opacity: [0.9, 0.35, 0.9],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Antenna Stem */}
        <line
          x1="32"
          y1="9"
          x2="32"
          y2="17"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Antenna Tip Glow Center */}
        <circle cx="32" cy="7" r="3" fill="#ffffff" />

        {/* Left Ear */}
        <motion.rect
          x="6"
          y="28"
          width="5"
          height="12"
          rx="2.5"
          fill="#ffffff"
          opacity="0.9"
          animate={{
            scaleY: [1, 1.15, 1],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Right Ear */}
        <motion.rect
          x="53"
          y="28"
          width="5"
          height="12"
          rx="2.5"
          fill="#ffffff"
          opacity="0.9"
          animate={{
            scaleY: [1, 1.15, 1],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />

        {/* Robot Head Outer Body */}
        <rect
          x="11"
          y="17"
          width="42"
          height="34"
          rx="12"
          fill="#ffffff"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
        />

        {/* Screen / Visor Face Area */}
        <rect
          x="16"
          y="22"
          width="32"
          height="22"
          rx="8"
          fill="#272626"
        />

        {/* Visor Ambient Reflection */}
        <path
          d="M 18 24 L 28 24 L 22 34 L 18 34 Z"
          fill="rgba(255, 255, 255, 0.12)"
        />

        {/* Left Animated Blinking Eye */}
        <motion.ellipse
          cx="24"
          cy="31"
          rx="3.5"
          ry="4"
          fill="#34d399"
          animate={{
            scaleY: [1, 1, 0.1, 1, 1],
            opacity: [1, 1, 0.8, 1, 1],
          }}
          transition={{
            duration: 3.4,
            repeat: Infinity,
            times: [0, 0.45, 0.5, 0.55, 1],
          }}
        />

        {/* Right Animated Blinking Eye */}
        <motion.ellipse
          cx="40"
          cy="31"
          rx="3.5"
          ry="4"
          fill="#34d399"
          animate={{
            scaleY: [1, 1, 0.1, 1, 1],
            opacity: [1, 1, 0.8, 1, 1],
          }}
          transition={{
            duration: 3.4,
            repeat: Infinity,
            times: [0, 0.45, 0.5, 0.55, 1],
          }}
        />

        {/* Animated Cute Smile Waveform */}
        <motion.path
          d="M 28 38 Q 32 41 36 38"
          stroke="#34d399"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              "M 28 38 Q 32 41 36 38",
              "M 28 39 Q 32 42 36 39",
              "M 28 38 Q 32 41 36 38",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Cheek Glow Left */}
        <circle cx="20" cy="37" r="1.8" fill="#f87171" opacity="0.65" />
        {/* Cheek Glow Right */}
        <circle cx="44" cy="37" r="1.8" fill="#f87171" opacity="0.65" />

        {/* Neck connector */}
        <rect x="27" y="51" width="10" height="4" rx="2" fill="#ffffff" opacity="0.9" />

        {/* Shoulders / Base */}
        <path
          d="M 20 55 C 20 53, 44 53, 44 55 L 47 60 C 47 62, 17 62, 17 60 Z"
          fill="#ffffff"
          opacity="0.85"
        />
      </svg>
    </motion.div>
  );
};

export default AnimatedBotIcon;
