import React from 'react';
import { Box, GraduationCap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary-600/20 p-2 rounded-lg">
            <Box className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">Knapsack Solver Pro</h1>
            <p className="text-xs text-slate-400 font-medium">Master's Data Analytics Toolkit</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-300">Educational Mode: Active</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;