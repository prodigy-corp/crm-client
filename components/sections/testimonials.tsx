"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useActiveTestimonials } from "@/hooks/use-admin";
import type { Testimonial } from "@/lib/api/admin";
import { cn } from "@/lib/utils";
import { 
  LuStar, 
  LuChevronLeft, 
  LuChevronRight, 
  LuQuote,
  LuPlay,
  LuPause
} from "react-icons/lu";

interface TestimonialsProps {
  className?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
  featuredOnly?: boolean;
  layout?: "grid" | "carousel" | "masonry";
  columns?: 1 | 2 | 3 | 4;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showRating?: boolean;
  showNavigation?: boolean;
  showIndicators?: boolean;
}

const TestimonialsComponent = ({
  className,
  title = "What Our Customers Say",
  subtitle = "Don't just take our word for it - hear from our satisfied customers",
  limit = 6,
  featuredOnly = false,
  layout = "grid",
  columns = 3,
  autoPlay = true,
  autoPlayInterval = 5000,
  showRating = true,
  showNavigation = true,
  showIndicators = true,
}: TestimonialsProps) => {
  const { data: testimonials, isLoading, error } = useActiveTestimonials({
    limit,
    featured: featuredOnly,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Auto-play functionality for carousel
  useEffect(() => {
    if (!isPlaying || layout !== "carousel" || !testimonials || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, layout, testimonials, autoPlayInterval]);

  const goToPrevious = () => {
    if (!testimonials) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsPlaying(false);
  };

  const goToNext = () => {
    if (!testimonials) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <LuStar
            key={i}
            className={cn(
              "w-4 h-4",
              i < rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  const renderTestimonialCard = (testimonial: Testimonial, index?: number) => (
    <Card 
      key={testimonial.id} 
      className={cn(
        "h-full transition-all duration-300 hover:shadow-lg",
        layout === "carousel" && index !== currentIndex && "opacity-50 scale-95"
      )}
    >
      <CardContent className="p-6 h-full flex flex-col">
        {/* Quote Icon */}
        <div className="mb-4">
          <LuQuote className="w-8 h-8 text-primary/20" />
        </div>

        {/* Content */}
        <blockquote className="flex-1 mb-6">
          <p className="text-gray-700 leading-relaxed italic">
            "{testimonial.content}"
          </p>
        </blockquote>

        {/* Rating */}
        {showRating && testimonial.rating && (
          <div className="mb-4">
            {renderStars(testimonial.rating)}
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-center gap-4">
          {testimonial.avatar && (
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="font-semibold text-gray-900">
              {testimonial.name}
            </div>
            {testimonial.position && (
              <div className="text-sm text-gray-600">
                {testimonial.position}
                {testimonial.company && ` at ${testimonial.company}`}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <section className={cn("py-16 bg-gray-50", className)}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse" />
          </div>
          <div className={cn(
            "grid gap-6",
            columns === 1 && "grid-cols-1",
            columns === 2 && "grid-cols-1 md:grid-cols-2",
            columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}>
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-64">
                <CardContent className="p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-8" />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-16 bg-gray-50", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        {layout === "carousel" ? (
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="w-full shrink-0 px-4">
                    <div className="max-w-4xl mx-auto">
                      {renderTestimonialCard(testimonial, index)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Controls */}
            {testimonials.length > 1 && (
              <>
                {/* Previous/Next Buttons */}
                {showNavigation && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 p-3 rounded-full shadow-lg transition-all duration-200"
                      aria-label="Previous testimonial"
                    >
                      <LuChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900 p-3 rounded-full shadow-lg transition-all duration-200"
                      aria-label="Next testimonial"
                    >
                      <LuChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Indicators */}
                {showIndicators && (
                  <div className="flex justify-center gap-2 mt-8">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={cn(
                          "w-3 h-3 rounded-full transition-all duration-200",
                          index === currentIndex
                            ? "bg-primary scale-125"
                            : "bg-gray-300 hover:bg-gray-400"
                        )}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Play/Pause Button */}
                <button
                  onClick={togglePlayPause}
                  className="absolute bottom-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 p-2 rounded-full shadow-md transition-all duration-200"
                  aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                >
                  {isPlaying ? <LuPause className="w-4 h-4" /> : <LuPlay className="w-4 h-4" />}
                </button>
              </>
            )}
          </div>
        ) : (
          /* Grid/Masonry Layout */
          <div className={cn(
            "grid gap-6",
            layout === "masonry" && "masonry",
            columns === 1 && "grid-cols-1",
            columns === 2 && "grid-cols-1 md:grid-cols-2",
            columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
            columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}>
            {testimonials.map((testimonial) => renderTestimonialCard(testimonial))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsComponent;
