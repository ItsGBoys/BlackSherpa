"use client";

import { motion } from "framer-motion";

export default function MountainSilhouette({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none ${className}`}>
      <motion.svg
        viewBox="0 0 1440 320"
        className="w-full h-auto opacity-10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <path
          fill="hsl(var(--primary))"
          d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,202.7C960,181,1056,139,1152,138.7C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </motion.svg>
    </div>
  );
}
