"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useActiveBanners } from "@/hooks/use-admin";
import type { Banner } from "@/lib/api/admin";
import { cn } from "@/lib/utils";
import { 
  LuX, 
  LuInfo, 
  LuTriangle, 
  LuCheck, 
  LuX as LuXCircle, 
  LuMegaphone,
  LuChevronUp,
  LuChevronDown
} from "react-icons/lu";

interface BannerProps {
  className?: string;
  position?: "top" | "bottom";
  maxVisible?: number;
  allowDismiss?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

const BannerComponent = ({
  className,
  position = "top",
  maxVisible = 3,
  allowDismiss = true,
  autoHide = false,
  autoHideDelay = 10000,
}: BannerProps) => {
  const { data: banners, isLoading, error } = useActiveBanners();
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [visibleBanners, setVisibleBanners] = useState<Banner[]>([]);

  // Filter and sort banners
  useEffect(() => {
    if (!banners) return;

    const now = new Date();
    const activeBanners = banners
      .filter((banner) => {
        // Check if banner is dismissed
        if (dismissedBanners.has(banner.id)) return false;
        
        // Check date range
        if (banner.startDate && new Date(banner.startDate) > now) return false;
        if (banner.endDate && new Date(banner.endDate) < now) return false;
        
        return true;
      })
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .slice(0, maxVisible);

    setVisibleBanners(activeBanners);
  }, [banners, dismissedBanners, maxVisible]);

  // Auto-hide functionality
  useEffect(() => {
    if (!autoHide || visibleBanners.length === 0) return;

    const timers = visibleBanners.map((banner) => {
      if (!banner.isDismissible) return null;
      
      return setTimeout(() => {
        handleDismiss(banner.id);
      }, autoHideDelay);
    });

    return () => {
      timers.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [visibleBanners, autoHide, autoHideDelay]);

  const handleDismiss = (bannerId: string) => {
    setDismissedBanners((prev) => new Set([...prev, bannerId]));
  };

  const getIcon = (type: Banner["type"]) => {
    const iconClass = "w-5 h-5 flex-shrink-0";
    
    switch (type) {
      case "info":
        return <LuInfo className={iconClass} />;
      case "warning":
        return <LuTriangle className={iconClass} />;
      case "success":
        return <LuCheck className={iconClass} />;
      case "error":
        return <LuXCircle className={iconClass} />;
      case "promotion":
        return <LuMegaphone className={iconClass} />;
      default:
        return <LuInfo className={iconClass} />;
    }
  };

  const getTypeStyles = (banner: Banner) => {
    const baseStyles = "border-l-4";
    
    if (banner.backgroundColor && banner.textColor) {
      return {
        backgroundColor: banner.backgroundColor,
        color: banner.textColor,
        borderLeftColor: banner.textColor,
      };
    }

    switch (banner.type) {
      case "info":
        return `${baseStyles} bg-blue-50 border-blue-400 text-blue-800`;
      case "warning":
        return `${baseStyles} bg-yellow-50 border-yellow-400 text-yellow-800`;
      case "success":
        return `${baseStyles} bg-green-50 border-green-400 text-green-800`;
      case "error":
        return `${baseStyles} bg-red-50 border-red-400 text-red-800`;
      case "promotion":
        return `${baseStyles} bg-purple-50 border-purple-400 text-purple-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-400 text-gray-800`;
    }
  };

  const getButtonStyles = (banner: Banner) => {
    if (banner.buttonColor) {
      return {
        backgroundColor: banner.buttonColor,
        color: banner.textColor || "#ffffff",
      };
    }

    switch (banner.type) {
      case "info":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "error":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "promotion":
        return "bg-purple-600 hover:bg-purple-700 text-white";
      default:
        return "bg-gray-600 hover:bg-gray-700 text-white";
    }
  };

  if (isLoading || error || !banners || visibleBanners.length === 0) {
    return null;
  }

  return (
    <div 
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-300",
        position === "top" ? "top-0" : "bottom-0",
        className
      )}
    >
      {/* Collapse/Expand Button */}
      {visibleBanners.length > 1 && (
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "absolute right-4 bg-white/90 hover:bg-white text-gray-600 hover:text-gray-800 p-2 rounded-full shadow-md transition-all duration-200 z-10",
            position === "top" ? "top-2" : "bottom-2"
          )}
          aria-label={isCollapsed ? "Expand banners" : "Collapse banners"}
        >
          {isCollapsed ? (
            position === "top" ? <LuChevronDown className="w-4 h-4" /> : <LuChevronUp className="w-4 h-4" />
          ) : (
            position === "top" ? <LuChevronUp className="w-4 h-4" /> : <LuChevronDown className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Banners Container */}
      <div 
        className={cn(
          "transition-all duration-300 overflow-hidden",
          isCollapsed && visibleBanners.length > 1 ? "max-h-0" : "max-h-screen"
        )}
      >
        <div className="space-y-1">
          {visibleBanners.map((banner, index) => {
            const typeStyles = getTypeStyles(banner);
            const buttonStyles = getButtonStyles(banner);
            const isCustomColors = banner.backgroundColor && banner.textColor;

            return (
              <div
                key={banner.id}
                className={cn(
                  "relative px-4 py-3 shadow-sm",
                  !isCustomColors && typeStyles,
                  "animate-in slide-in-from-top-2 duration-300"
                )}
                style={isCustomColors ? (typeStyles as React.CSSProperties) : undefined}
              >
                <div className="flex items-center gap-3 max-w-7xl mx-auto">
                  {/* Icon */}
                  {banner.icon ? (
                    <div className="shrink-0">
                      <img src={banner.icon} alt="" className="w-5 h-5" />
                    </div>
                  ) : (
                    getIcon(banner.type)
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm sm:text-base">
                          {banner.title}
                        </h3>
                        {banner.message && (
                          <p className="text-sm opacity-90 mt-1">
                            {banner.message}
                          </p>
                        )}
                      </div>

                      {/* Action Button */}
                      {banner.buttonText && banner.buttonUrl && (
                        <div className="shrink-0">
                          <Button
                            size="sm"
                            className={cn(
                              "text-xs font-medium",
                              !banner.buttonColor && buttonStyles
                            )}
                            style={banner.buttonColor ? {
                              backgroundColor: banner.buttonColor,
                              color: banner.textColor || "#ffffff",
                            } : undefined}
                            onClick={() => {
                              window.open(banner.buttonUrl, "_blank", "noopener,noreferrer");
                            }}
                          >
                            {banner.buttonText}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dismiss Button */}
                  {allowDismiss && banner.isDismissible && (
                    <button
                      onClick={() => handleDismiss(banner.id)}
                      className="shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors duration-200"
                      aria-label="Dismiss banner"
                    >
                      <LuX className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Progress bar for auto-hide */}
                {autoHide && banner.isDismissible && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
                    <div 
                      className="h-full bg-current opacity-30"
                      style={{
                        animation: `shrink ${autoHideDelay}ms linear`,
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default BannerComponent;
