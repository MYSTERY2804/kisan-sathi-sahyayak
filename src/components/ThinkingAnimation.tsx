
import React from 'react';
import { cn } from '@/lib/utils';
import { Sprout } from 'lucide-react';

interface ThinkingAnimationProps {
  className?: string;
}

const ThinkingAnimation: React.FC<ThinkingAnimationProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center gap-2 p-3", className)}>
      <div className="relative">
        <Sprout className="h-5 w-5 text-leaf-600 animate-bounce-slight" />
      </div>
      <div className="flex gap-1">
        <span className="h-2 w-2 bg-leaf-400 rounded-full animate-pulse-slow" style={{ animationDelay: "0ms" }}></span>
        <span className="h-2 w-2 bg-leaf-500 rounded-full animate-pulse-slow" style={{ animationDelay: "300ms" }}></span>
        <span className="h-2 w-2 bg-leaf-600 rounded-full animate-pulse-slow" style={{ animationDelay: "600ms" }}></span>
      </div>
    </div>
  );
};

export default ThinkingAnimation;
