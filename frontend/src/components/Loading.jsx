import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

//Custom Hook
const useTypewriter = (text, speed = 150) => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDeleting && index < text.length) {
        // Typing phase
        setDisplayText(text.slice(0, index + 1));
        setIndex((prev) => prev + 1);
      } else if (isDeleting && index > 0) {
        // Deleting phase
        setDisplayText(text.slice(0, index - 1));
        setIndex((prev) => prev - 1);
      } else if (!isDeleting && index === text.length) {
        // Pause before deleting
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && index === 0) {
        // Restart typing
        setIsDeleting(false);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, index, isDeleting]);

  return displayText;
};

const Loading = () => {
  const typedText = useTypewriter("BillBuddy", 150);

  // Background gradient animation
  const backgroundVariants = {
    animate: {
      backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  // Particle animation for background motion
  const particleVariants = {
    animate: {
      y: [0, -20, 0],
      opacity: [0, 1, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Text animation
  const textVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-indigo-700 to-blue-950 relative overflow-hidden"
      variants={backgroundVariants}
      animate="animate"
      style={{
        backgroundSize: "200% 200%",
      }}
    >
      {/* Animated Particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full"
          variants={particleVariants}
          animate="animate"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.3,
          }}
        />
      ))}

      <motion.h1
        className="text-5xl md:text-7xl font-orbitron text-white tracking-wider"
        style={{
          textShadow: "0 0 10px rgba(147, 51, 234, 0.8), 0 0 20px rgba(79, 70, 229, 0.6)",
        }}
        variants={textVariants}
        initial="initial"
        animate="animate"
      >
        {typedText || "\u00A0"} 
        <motion.span
          className="inline-block w-1 h-10 bg-white ml-2"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </motion.h1>

    </motion.div>
  );
};

export default Loading;