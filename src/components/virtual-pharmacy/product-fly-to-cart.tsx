"use client";

// [NEW] ProductFlyToCart — wraps the "Add to Cart" trigger with a burst animation
// [SAFE] Does not replace existing cart logic; only adds visual feedback on top
// [WARNING] Animation is purely visual; actual add-to-cart is called by parent

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

interface ProductFlyToCartProps {
  /** The underlying add-to-cart handler from the real hook */
  onAddToCart: () => void;
  disabled?: boolean;
  className?: string;
}

type AnimState = "idle" | "flying" | "done";

export function ProductFlyToCart({
  onAddToCart,
  disabled,
  className,
}: ProductFlyToCartProps) {
  const [anim, setAnim] = useState<AnimState>("idle");

  const handleClick = useCallback(() => {
    if (anim !== "idle" || disabled) return;

    // 1. Trigger the real cart action
    onAddToCart();

    // 2. Run visual sequence: flying → done → idle
    setAnim("flying");
    setTimeout(() => setAnim("done"), 600);
    setTimeout(() => setAnim("idle"), 1200);
  }, [anim, disabled, onAddToCart]);

  const isFlying = anim === "flying";
  const isDone   = anim === "done";

  return (
    <div className={cn("relative", className)}>
      {/* ── Main button ─────────────────────────────────────────── */}
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={disabled || anim !== "idle"}
        whileTap={{ scale: 0.93 }}
        className={cn(
          "relative flex h-8 items-center gap-1.5 overflow-hidden rounded-xl px-3",
          "bg-gradient-brand text-xs font-semibold text-white",
          "transition-opacity disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {/* Icon swap: cart → check */}
        <AnimatePresence mode="wait" initial={false}>
          {isDone ? (
            <motion.span
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Check className="h-3.5 w-3.5" />
            </motion.span>
          ) : (
            <motion.span
              key="cart"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </motion.span>
          )}
        </AnimatePresence>
        <span>{isDone ? "Added!" : "Add"}</span>

        {/* Ripple burst on click */}
        <AnimatePresence>
          {isFlying && (
            <motion.span
              key="ripple"
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute inset-0 rounded-xl bg-white"
              style={{ originX: "50%", originY: "50%" }}
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Floating cart particle — flies upward and fades ─────── */}
      <AnimatePresence>
        {isFlying && (
          <motion.div
            key="particle"
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -36, scale: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-md">
              <ShoppingCart className="h-3 w-3 text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
