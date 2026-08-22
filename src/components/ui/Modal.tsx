"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  /** Hides the close X button */
  hideClose?: boolean;
}

const widthMap: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "md",
  hideClose = false,
}: ModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-modal flex items-end sm:items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 backdrop-dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel — silk animation 400ms */}
          <motion.div
            className={[
              "relative w-full",
              widthMap[maxWidth],
              "bg-surface border border-rim rounded-2xl shadow-modal",
              "overflow-hidden",
            ].join(" ")}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1], // spring ease
            }}
          >
            {/* Gold accent line at top */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

            {/* Header */}
            {(title || !hideClose) && (
              <div className="flex items-start justify-between px-6 pt-6 pb-0">
                <div className="flex-1 min-w-0">
                  {title && (
                    <h2
                      id="modal-title"
                      className="font-display text-xl sm:text-2xl font-bold text-ivory leading-tight"
                    >
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="mt-1.5 text-sm text-ash leading-relaxed">
                      {subtitle}
                    </p>
                  )}
                </div>

                {!hideClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="ml-4 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-ash hover:text-ivory hover:bg-raised transition-colors duration-200"
                    aria-label="Fechar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
