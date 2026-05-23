"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  onDone: () => void;
  dayNumber: number;
};

const CONFETTI_COUNT = 40;
const COLORS = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444", "#3b82f6"];

export function Celebration({ onDone, dayNumber }: Props) {
  const [pieces] = useState(() =>
    Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      angle: (Math.PI * 2 * i) / CONFETTI_COUNT + Math.random() * 0.3,
      distance: 220 + Math.random() * 180,
      delay: Math.random() * 0.15,
      size: 8 + Math.random() * 8,
    })),
  );

  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onDone}
        role="dialog"
        aria-label="Daily tasks complete"
      >
        <div className="pointer-events-none relative">
          {pieces.map((p) => (
            <motion.span
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
              animate={{
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance,
                opacity: 0,
                scale: 1,
                rotate: 360,
              }}
              transition={{
                duration: 1.6,
                delay: p.delay,
                ease: "easeOut",
              }}
              className="absolute left-1/2 top-1/2 block rounded-sm"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
              }}
            />
          ))}

          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.05 }}
            className="relative rounded-2xl bg-white px-10 py-8 text-center shadow-2xl"
          >
            <p className="text-5xl">🎉</p>
            <p className="mt-3 text-2xl font-semibold text-zinc-950">
              Day {dayNumber} complete!
            </p>
            <p className="mt-1 text-sm text-zinc-600">All tasks done. Keep the streak going.</p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
