import React from "react";
import { motion } from "framer-motion";

const TimerLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <motion.div
        className="relative w-20 h-20 rounded-full border-4 border-dashed border-blue-500"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 2,
        }}
      >
        <div className="absolute top-1/2 left-1/2 w-1 h-5 bg-blue-600 origin-bottom -translate-x-1/2 -translate-y-full rounded" />
        <div className="absolute top-1/2 left-1/2 w-1 h-3 bg-blue-400 origin-bottom -translate-x-1/2 -translate-y-full rounded rotate-45" />
      </motion.div>

      <p className="mt-4 text-blue-600 dark:text-blue-400 text-sm">Fetching your time entries...</p>
    </div>
  );
};

export default TimerLoader;
