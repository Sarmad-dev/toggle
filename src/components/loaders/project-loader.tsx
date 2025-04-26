"use client"
import React from "react";
import { motion } from "framer-motion";

const ProjectLoader = () => {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full px-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            className="p-6 rounded-2xl bg-blue-100 dark:bg-blue-950 border border-blue-300/50 dark:border-blue-800 shadow-md animate-pulse"
          >
            <div className="h-4 w-1/2 bg-blue-300 dark:bg-blue-800 rounded mb-4" />
            <div className="h-3 w-3/4 bg-blue-200 dark:bg-blue-700 rounded mb-2" />
            <div className="h-3 w-1/3 bg-blue-200 dark:bg-blue-700 rounded" />
          </motion.div>
        ))}
      </motion.div>
      <p className="mt-6 text-sm text-blue-600 dark:text-blue-400">
        Loading your projects...
      </p>
    </div>
  );
};

export default ProjectLoader;
