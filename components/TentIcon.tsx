import { Tent } from "lucide-react";

export default function TentIcon({ size = 24, className = "" }: { size?: number, className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
      <Tent size={size} className="text-primary relative z-10" />
    </div>
  );
}
