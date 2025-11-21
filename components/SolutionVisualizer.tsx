import React, { useState } from 'react';
import { Check, X, Info } from 'lucide-react';
import { KnapsackItem, KnapsackResult } from '../types';

interface SolutionVisualizerProps {
  items: KnapsackItem[];
  result: KnapsackResult;
  onReset: () => void;
}

const SolutionVisualizer: React.FC<SolutionVisualizerProps> = ({ items, result, onReset }) => {
  const [hoveredCell, setHoveredCell] = useState<{ i: number, w: number } | null>(null);

  const { dpTable, pathTrace, capacity } = result;

  // Only show the full table if capacity is reasonable
  const isTableTooLarge = capacity > 20;
  const displayCapacity = isTableTooLarge ? 20 : capacity;

  const getCellClass = (i: number, w: number) => {
    const isSelectedPath = pathTrace[i][w];
    const isHovered = hoveredCell?.i === i && hoveredCell?.w === w;
    
    // Highlight logic for path tracing during hover (simple version)
    const isTraceBack = false; // Could implement dynamic traceback highlight

    if (i === 0 || w === 0) return "bg-slate-900 text-slate-600";
    if (isHovered) return "bg-primary-500 text-white ring-2 ring-primary-300 z-10 scale-110 transition-transform";
    if (pathTrace[i][w] && w === capacity && i === items.length) return "bg-emerald-600 text-white font-bold";
    
    // Gradient background based on value relative to max
    const maxVal = result.maxProfit;
    const cellVal = dpTable[i][w];
    const intensity = maxVal > 0 ? (cellVal / maxVal) * 0.4 : 0; // Max opacity 0.4
    
    return `text-slate-300 hover:bg-slate-700 transition-colors`;
  };

  const getInlineStyle = (i: number, w: number) => {
    if (i === 0 || w === 0) return {};
    const maxVal = result.maxProfit;
    const cellVal = dpTable[i][w];
    const intensity = maxVal > 0 ? (cellVal / maxVal) * 0.2 : 0;
    if (hoveredCell?.i === i && hoveredCell?.w === w) return {};
    return { backgroundColor: `rgba(99, 102, 241, ${intensity})` };
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Total Value</p>
          <p className="text-3xl font-bold text-emerald-400 mt-1">${result.maxProfit}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Total Weight</p>
          <p className="text-3xl font-bold text-primary-400 mt-1">{result.totalWeight} <span className="text-sm text-slate-500">/ {result.capacity}</span></p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Items Selected</p>
          <p className="text-3xl font-bold text-white mt-1">{result.selectedItems.length} <span className="text-sm text-slate-500">/ {items.length}</span></p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-center">
            <button 
                onClick={onReset}
                className="text-sm text-slate-400 hover:text-white underline underline-offset-4"
            >
                Modify Inputs
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selected Items List */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-500" />
                Optimal Set
            </h3>
            <div className="space-y-3">
                {result.selectedItems.length > 0 ? (
                    result.selectedItems.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-950/50 p-3 rounded-lg border border-slate-800 hover:border-emerald-500/50 transition-colors">
                            <div>
                                <p className="text-slate-200 font-medium">{item.name}</p>
                                <p className="text-xs text-slate-500">Weight: {item.weight} | Value: {item.value}</p>
                            </div>
                            <div className="text-emerald-400 font-bold text-lg">
                                +${item.value}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-500">
                        No items fit in the knapsack.
                    </div>
                )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-800">
                <h4 className="text-sm font-medium text-slate-400 mb-3">Discarded Items</h4>
                <div className="flex flex-wrap gap-2">
                    {items.filter(i => !result.selectedItems.includes(i)).map((item) => (
                        <span key={item.id} className="px-2 py-1 bg-slate-800 text-slate-500 rounded text-xs line-through">
                            {item.name}
                        </span>
                    ))}
                    {items.filter(i => !result.selectedItems.includes(i)).length === 0 && (
                        <span className="text-xs text-slate-600 italic">All items were selected!</span>
                    )}
                </div>
            </div>
        </div>

        {/* DP Table Visualization */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg overflow-hidden flex flex-col">
           <div className="flex justify-between items-end mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">Dynamic Programming Matrix</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Rows ($i$) represent items considered. Columns ($w$) represent current capacity limit.
                        <br/>
                        Cell Value = Max profit using first $i$ items with capacity limit $w$.
                    </p>
                </div>
                {isTableTooLarge && (
                    <span className="text-xs text-amber-500 flex items-center gap-1 bg-amber-900/20 px-2 py-1 rounded">
                        <Info className="w-3 h-3" />
                        Table truncated (W &gt; 20)
                    </span>
                )}
           </div>

           <div className="overflow-auto flex-grow relative rounded-lg border border-slate-800 bg-slate-950">
                <table className="border-collapse table-fixed min-w-full">
                    <thead>
                        <tr>
                            <th className="w-12 h-10 sticky left-0 top-0 z-30 bg-slate-900 text-slate-500 text-xs border-b border-r border-slate-800">i \ w</th>
                            {Array.from({ length: displayCapacity + 1 }).map((_, w) => (
                                <th key={w} className="w-10 h-10 sticky top-0 z-20 bg-slate-900 text-slate-400 text-xs font-mono border-b border-slate-800">
                                    {w}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: items.length + 1 }).map((_, i) => (
                            <tr key={i}>
                                <th className="sticky left-0 z-20 bg-slate-900 text-slate-400 text-xs font-medium border-r border-slate-800 h-10 px-2 text-right">
                                    {i === 0 ? '0' : items[i-1].name.substring(0, 8) + (items[i-1].name.length > 8 ? '..' : '')}
                                </th>
                                {Array.from({ length: displayCapacity + 1 }).map((_, w) => (
                                    <td 
                                        key={w}
                                        onMouseEnter={() => setHoveredCell({i, w})}
                                        onMouseLeave={() => setHoveredCell(null)}
                                        className={`text-center text-xs border border-slate-800/50 cursor-help h-10 w-10 ${getCellClass(i, w)}`}
                                        style={getInlineStyle(i, w)}
                                    >
                                        {dpTable[i][w]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
           </div>
           
           {/* Legend / Interaction Hint */}
           {hoveredCell && hoveredCell.i > 0 && hoveredCell.w > 0 && (
               <div className="mt-4 p-3 bg-slate-800/50 rounded border border-slate-700 text-sm text-slate-300 animate-in slide-in-from-bottom-2">
                   <span className="font-bold text-primary-400">Cell [{hoveredCell.i}, {hoveredCell.w}]:</span> 
                   <span className="mx-2">
                       Max({dpTable[hoveredCell.i-1][hoveredCell.w]} [skip], 
                       {items[hoveredCell.i-1].weight <= hoveredCell.w 
                        ? `${items[hoveredCell.i-1].value} + ${dpTable[hoveredCell.i-1][hoveredCell.w-items[hoveredCell.i-1].weight]} [take]`
                        : 'Too Heavy'})
                   </span>
                   = <span className="font-bold text-white">{dpTable[hoveredCell.i][hoveredCell.w]}</span>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default SolutionVisualizer;