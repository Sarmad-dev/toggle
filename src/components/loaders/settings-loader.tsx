"use client"
import React from "react";
import { motion } from "framer-motion";

const SettingsLoader = () => {
  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      <motion.div
        className="w-full max-w-2xl space-y-6 bg-blue-100 dark:bg-blue-950 border border-blue-300/50 dark:border-blue-800 rounded-2xl p-6 shadow-sm"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="flex items-center justify-between animate-pulse"
          >
            <div className="h-4 w-1/3 bg-blue-300 dark:bg-blue-800 rounded" />
            <div className="h-6 w-12 bg-blue-400 dark:bg-blue-700 rounded-full" />
          </motion.div>
        ))}

        {/* Save Button Placeholder */}
        <motion.div
          variants={itemVariants}
          className="mt-6 h-10 w-32 bg-blue-500 dark:bg-blue-600 rounded-lg mx-auto animate-pulse"
        />
      </motion.div>

      <p className="mt-6 text-sm text-blue-600 dark:text-blue-400">
        Loading your settings...
      </p>
    </div>
  );
};

export default SettingsLoader;
