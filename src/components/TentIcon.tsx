import { motion } from "framer-motion";

const TentIcon = ({ size = 48, className = "" }: { size?: number; className?: string }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={className}
    initial={{ pathLength: 0 }}
    animate={{ pathLength: 1 }}
    transition={{ duration: 2, ease: "easeInOut" }}
  >
    <motion.path
      d="M24 6L4 42H44L24 6Z"
      stroke="hsl(157 100% 50%)"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
    <motion.path
      d="M24 6L24 42"
      stroke="hsl(157 100% 50% / 0.4)"
      strokeWidth="1.5"
      strokeDasharray="4 4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 0.8 }}
    />
    <motion.path
      d="M18 42L24 28L30 42"
      stroke="hsl(22 100% 50%)"
      strokeWidth="2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, delay: 1.2 }}
    />
  </motion.svg>
);

export default TentIcon;
