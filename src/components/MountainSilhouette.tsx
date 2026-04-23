import { motion } from "framer-motion";

const MountainSilhouette = ({ className = "" }: { className?: string }) => (
  <div className={`absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none ${className}`}>
    <motion.svg
      viewBox="0 0 1440 320"
      className="w-full"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* Far mountains */}
      <motion.path
        d="M0,320 L0,240 L120,180 L200,200 L280,140 L360,190 L440,120 L520,170 L600,100 L680,160 L760,80 L840,150 L920,90 L1000,160 L1080,110 L1160,170 L1240,130 L1320,180 L1440,140 L1440,320 Z"
        fill="hsl(0 0% 10%)"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Near mountains */}
      <motion.path
        d="M0,320 L0,260 L160,200 L240,230 L360,170 L480,220 L560,160 L680,210 L760,150 L880,200 L960,170 L1080,220 L1200,180 L1320,230 L1440,190 L1440,320 Z"
        fill="hsl(0 0% 8%)"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      {/* Closest range */}
      <motion.path
        d="M0,320 L0,280 L200,240 L400,270 L520,230 L640,260 L800,220 L960,260 L1100,240 L1280,270 L1440,250 L1440,320 Z"
        fill="hsl(0 0% 6.7%)"
      />
    </motion.svg>
  </div>
);

export default MountainSilhouette;
