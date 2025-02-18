"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const previewImages = [
  {
    title: "Dashboard",
    light: "/images/dashboard-light.png",
    dark: "/images/dashboard-dark.png",
  },
  {
    title: "Analytics",
    light: "/images/analytics-light.png",
    dark: "/images/analytics-dark.png",
  },
];

export function PreviewCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((current) =>
          current === previewImages.length - 1 ? 0 : current + 1
        );
        setIsTransitioning(false);
      }, 500); // Match this with CSS transition duration
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="relative">
        <Image
          src={previewImages[currentIndex].dark}
          alt={`${previewImages[currentIndex].title} Preview`}
          width={1280}
          height={720}
          className={cn(
            "rounded-lg border shadow-2xl transition-all duration-500 hidden dark:block",
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}
          priority
        />
        <Image
          src={previewImages[currentIndex].light}
          alt={`${previewImages[currentIndex].title} Preview`}
          width={1280}
          height={720}
          className={cn(
            "rounded-lg border shadow-2xl transition-all duration-500 block dark:hidden",
            isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}
          priority
        />
        <div className="absolute -bottom-8 -left-8 h-64 w-64 blur-3xl bg-primary/20 rounded-full" />
        <div className="absolute -top-8 -right-8 h-64 w-64 blur-3xl bg-primary/20 rounded-full" />
      </div>

      {/* Preview Indicators */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex gap-2">
        {previewImages.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentIndex === index
                ? "bg-primary w-6"
                : "bg-primary/20 hover:bg-primary/40"
            )}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
              }, 500);
            }}
          />
        ))}
      </div>
    </div>
  );
}
