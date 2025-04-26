"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const OnboardingIllustration = () => {

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20 p-12">
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,transparent,black)] bg-[size:20px_20px]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center space-y-8"
      >
        <div className="space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Welcome to Toggle
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto font-medium">
            Your journey to efficient time management starts here
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative w-[450px] h-[320px]">
            <Image
              src="/assets/onboarding-illustration.svg"
              alt="Team collaboration illustration"
              fill
              className="object-contain dark:invert-[0.85] dark:hue-rotate-180"
              priority
            />
          </div>
        </div>

        <motion.div 
          className="flex flex-col gap-6 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="relative">
            <div className="absolute left-[21px] top-[76px] w-0.5 h-[calc(100%-60px)] bg-gradient-to-b from-indigo-500 to-blue-500 opacity-20"></div>
            
            <motion.div 
              className="flex items-center gap-6 p-5 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 cursor-pointer group relative"
              whileHover={{ x: 8 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 dark:from-indigo-600 dark:to-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-200/50 dark:shadow-indigo-900/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Create Organization</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base">Build your team&apos;s digital workspace and set the foundation</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-6 p-5 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 cursor-pointer group"
              whileHover={{ x: 8 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 dark:from-green-600 dark:to-emerald-800 flex items-center justify-center shadow-lg shadow-green-200/50 dark:shadow-green-900/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Invite Team Members</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base">Bring your colleagues together in one collaborative space</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-6 p-5 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 cursor-pointer group"
              whileHover={{ x: 8 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-600 dark:from-purple-600 dark:to-violet-800 flex items-center justify-center shadow-lg shadow-purple-200/50 dark:shadow-purple-900/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Create Projects</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base">Organize work into projects and set clear objectives</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-6 p-5 rounded-2xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all duration-300 cursor-pointer group"
              whileHover={{ x: 8 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-600 dark:from-blue-600 dark:to-cyan-800 flex items-center justify-center shadow-lg shadow-blue-200/50 dark:shadow-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">Track Time</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base">Monitor progress and optimize productivity effortlessly</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};