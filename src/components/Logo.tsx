
import React from 'react';
import { Sprout } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-leaf-100 p-2 rounded-lg">
        <Sprout className="h-6 w-6 text-leaf-700" />
      </div>
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-leaf-800">
          <span className="text-leaf-600">KRISH</span> MITRA
        </h1>
        <p className="text-xs text-muted-foreground -mt-1">Agricultural Assistant</p>
      </div>
    </div>
  );
};

export default Logo;
