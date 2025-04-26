import React from "react";
import { motion } from "framer-motion";

const InvoicesLoader = () => {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <motion.div
        className="w-full max-w-3xl bg-blue-100 dark:bg-blue-950 border border-blue-300/50 dark:border-blue-800 rounded-2xl shadow-sm p-6 space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Invoice Rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            variants={rowVariants}
            className="flex justify-between items-center animate-pulse"
          >
            <div className="h-4 w-2/5 bg-blue-300 dark:bg-blue-800 rounded" />
            <div className="h-4 w-1/6 bg-blue-200 dark:bg-blue-700 rounded" />
          </motion.div>
        ))}

        {/* Divider */}
        <div className="border-t border-blue-300/50 dark:border-blue-800 my-4" />

        {/* Total Row */}
        <motion.div
          variants={rowVariants}
          className="flex justify-between items-center animate-pulse"
        >
          <div className="h-4 w-1/5 bg-blue-400 dark:bg-blue-700 rounded" />
          <div className="h-5 w-1/4 bg-blue-500 dark:bg-blue-600 rounded" />
        </motion.div>
      </motion.div>

      <p className="mt-6 text-sm text-blue-600 dark:text-blue-400">
        Loading your invoices...
      </p>
    </div>
  );
};

export default InvoicesLoader;
