import React from "react";
import { motion } from "framer-motion";

const TeamLoader = () => {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <motion.div
        className="w-full max-w-3xl space-y-4 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            variants={rowVariants}
            className="flex items-center gap-4 p-4 rounded-2xl bg-blue-100 dark:bg-blue-950 border border-blue-300/50 dark:border-blue-800 animate-pulse shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-blue-300 dark:bg-blue-800" />
            <div className="flex-1 space-y-2">
              <div className="w-1/3 h-4 rounded bg-blue-200 dark:bg-blue-700" />
              <div className="w-1/4 h-3 rounded bg-blue-100 dark:bg-blue-600" />
            </div>
          </motion.div>
        ))}
      </motion.div>
      <p className="mt-6 text-sm text-blue-600 dark:text-blue-400">
        Loading your teams...
      </p>
    </div>
  );
};

export default TeamLoader;
