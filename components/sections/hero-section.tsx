"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useActiveHeroSections } from "@/hooks/use-admin";
import type { HeroSection } from "@/lib/api/admin";
import { cn } from "@/lib/utils";
import { LuPlay, LuPause, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Route } from "next";

interface HeroSectionProps {
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
  showIndicators?: boolean;
}

const HeroSectionComponent = ({
  className,
  autoPlay = true,
  autoPlayInterval = 5000,
  showNavigation = true,
  showIndicators = true,
}: HeroSectionProps) => {
  const { data: heroSections, isLoading, error } = useActiveHeroSections();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || !heroSections || heroSections.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSections.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, heroSections, autoPlayInterval]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!heroSections || heroSections.length <= 1) return;

      if (event.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + heroSections.length) % heroSections.length);
      } else if (event.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % heroSections.length);
      } else if (event.key === " ") {
        event.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [heroSections]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  const goToPrevious = () => {
    if (!heroSections) return;
    setCurrentIndex((prev) => (prev - 1 + heroSections.length) % heroSections.length);
    setIsPlaying(false);
  };

  const goToNext = () => {
    if (!heroSections) return;
    setCurrentIndex((prev) => (prev + 1) % heroSections.length);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  if (isLoading) {
    return (
      <section className={cn("relative h-screen bg-linear-to-r from-gray-900 to-gray-700", className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  if (error || !heroSections || heroSections.length === 0) {
    return (
      <section className={cn("relative h-screen bg-linear-to-r from-gray-900 to-gray-700", className)}>
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome</h1>
            <p className="text-xl md:text-2xl mb-8">Your content will appear here</p>
          </div>
        </div>
      </section>
    );
  }

  const currentHero = heroSections[currentIndex];

  return (
    <section className={cn("relative h-screen overflow-hidden", className)}>
      {/* Background Media */}
      <div className="absolute inset-0">
        {currentHero.backgroundVideo ? (
          <video
            key={currentHero.id}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
          >
            <source src={currentHero.backgroundVideo} type="video/mp4" />
            {currentHero.backgroundImage && (
              <Image
                src={currentHero.backgroundImage}
                alt={currentHero.title}
                fill
                className="object-cover"
                priority
              />
            )}
          </video>
        ) : currentHero.backgroundImage ? (
          <Image
            src={currentHero.backgroundImage}
            alt={currentHero.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-r from-blue-600 to-purple-700" />
        )}
        
        {/* Overlay */}
        {currentHero.overlayOpacity && (
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: currentHero.overlayOpacity / 100 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className={cn(
              "max-w-4xl",
              currentHero.textAlignment === "center" && "mx-auto text-center",
              currentHero.textAlignment === "right" && "ml-auto text-right"
            )}
          >
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {currentHero.title}
            </h1>

            {/* Subtitle */}
            {currentHero.subtitle && (
              <h2 className="text-xl sm:text-2xl md:text-3xl text-gray-200 mb-6 font-light">
                {currentHero.subtitle}
              </h2>
            )}

            {/* Description */}
            {currentHero.description && (
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                {currentHero.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {currentHero.primaryButtonText && currentHero.primaryButtonUrl && (
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                >
                  <Link href={currentHero.primaryButtonUrl as Route}>
                    {currentHero.primaryButtonText}
                  </Link>
                </Button>
              )}

              {currentHero.secondaryButtonText && currentHero.secondaryButtonUrl && (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-semibold"
                >
                  <Link href={currentHero.secondaryButtonUrl as Route}>
                    {currentHero.secondaryButtonText}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      {heroSections.length > 1 && (
        <>
          {/* Previous/Next Buttons */}
          {showNavigation && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                aria-label="Previous hero section"
              >
                <LuChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                aria-label="Next hero section"
              >
                <LuChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Indicators */}
          {showIndicators && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroSections.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-200",
                    index === currentIndex
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/75"
                  )}
                  aria-label={`Go to hero section ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="absolute bottom-8 right-8 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
            aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? <LuPause className="w-5 h-5" /> : <LuPlay className="w-5 h-5" />}
          </button>
        </>
      )}

      {/* Progress Bar */}
      {heroSections.length > 1 && isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div 
            className="h-1 bg-white/30"
            style={{
              animation: `progress ${autoPlayInterval}ms linear infinite`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default HeroSectionComponent;
