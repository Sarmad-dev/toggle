import React from "react";
import { motion } from "framer-motion";

const ReportsLoader = () => {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const barVariants = {
    hidden: { opacity: 0, scaleY: 0.8 },
    show: {
      opacity: 1,
      scaleY: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <motion.div
        className="w-full max-w-4xl p-6 rounded-2xl bg-blue-100 dark:bg-blue-950 border border-blue-300/50 dark:border-blue-800 shadow-sm"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="flex justify-between items-end h-40 gap-4 px-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div
              key={i}
              variants={barVariants}
              className={`w-6 rounded-t bg-blue-400 dark:bg-blue-700 animate-pulse`}
              style={{ height: `${Math.random() * 60 + 40}px` }}
            />
          ))}
        </div>
        <div className="mt-6 h-3 w-32 bg-blue-300 dark:bg-blue-700 rounded mx-auto animate-pulse" />
      </motion.div>
      <p className="mt-6 text-sm text-blue-600 dark:text-blue-400">
        Loading your reports...
      </p>
    </div>
  );
};

export default ReportsLoader;
