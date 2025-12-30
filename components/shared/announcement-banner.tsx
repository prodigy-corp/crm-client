"use client";

import { Button } from "@/components/ui/button";
import { useActiveAnnouncements } from "@/hooks/use-announcements";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";

export function AnnouncementBanner() {
  const { data: announcements, isLoading } = useActiveAnnouncements();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load dismissed IDs from local storage
  useEffect(() => {
    const saved = localStorage.getItem("dismissed_announcements");
    if (saved) {
      setDismissed(JSON.parse(saved));
    }
  }, []);

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissed, id];
    setDismissed(newDismissed);
    localStorage.setItem(
      "dismissed_announcements",
      JSON.stringify(newDismissed),
    );
  };

  const activeFiltered =
    announcements?.filter((a) => !dismissed.includes(a.id)) || [];

  if (isLoading || activeFiltered.length === 0) return null;

  const current = activeFiltered[currentIndex];

  const getIcon = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "WARNING":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "DANGER":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "PRIMARY":
        return <Info className="h-5 w-5 text-primary" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "SUCCESS":
        return "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800";
      case "WARNING":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800";
      case "DANGER":
        return "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800";
      case "PRIMARY":
        return "bg-primary/5 border-primary/20";
      default:
        return "bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800";
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative mb-6 flex items-start gap-4 rounded-xl border p-4 shadow-sm transition-all ${getBgColor(current.type)}`}
      >
        <div className="mt-0.5 rounded-full bg-background/50 p-2 shadow-sm">
          {getIcon(current.type)}
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-foreground">
              {current.title}
            </h4>
            {activeFiltered.length > 1 && (
              <span className="rounded-full border bg-background/50 px-1.5 py-0.5 text-[10px] font-medium">
                {currentIndex + 1} of {activeFiltered.length}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
            {current.content}
          </p>

          <div className="flex gap-2 pt-2">
            {activeFiltered.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[11px]"
                onClick={() =>
                  setCurrentIndex((currentIndex + 1) % activeFiltered.length)
                }
              >
                Next Announcement
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[11px] font-semibold hover:text-red-600"
              onClick={() => handleDismiss(current.id)}
            >
              Mark as Read
            </Button>
          </div>
        </div>

        <button
          onClick={() => handleDismiss(current.id)}
          className="absolute top-2 right-2 p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
