import React, { useState, useEffect } from 'react';
import { BrainCircuit, Lightbulb, ArrowRight, Loader2 } from 'lucide-react';
import { KnapsackItem } from '../types';
import { getKnapsackExplanation } from '../services/geminiService';

interface AiInsightsProps {
  items: KnapsackItem[];
  selectedItems: KnapsackItem[];
  capacity: number;
  maxProfit: number;
}

const AiInsights: React.FC<AiInsightsProps> = ({ items, selectedItems, capacity, maxProfit }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ summary: string; strategyAnalysis: string; realWorldAnalogy: string } | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const result = await getKnapsackExplanation(items, capacity, maxProfit, selectedItems);
      setData(result);
      setLoading(false);
    };

    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, selectedItems, capacity, maxProfit]);

  if (loading) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-lg mt-8 flex flex-col items-center justify-center min-h-[200px]">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-3" />
            <p className="text-slate-400 text-sm animate-pulse">Analyzing optimization strategy with AI...</p>
        </div>
    )
  }

  if (!data) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg mt-8 relative overflow-hidden group">
      {/* Decorative Background Gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-primary-400" />
            AI Strategic Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
                <h4 className="text-sm uppercase tracking-wider text-slate-500 font-semibold">Executive Summary</h4>
                <p className="text-slate-300 leading-relaxed text-sm">
                    {data.summary}
                </p>
            </div>

            <div className="space-y-2 md:border-l md:border-slate-800 md:pl-8">
                <h4 className="text-sm uppercase tracking-wider text-slate-500 font-semibold">Optimization Strategy</h4>
                <p className="text-slate-300 leading-relaxed text-sm">
                    {data.strategyAnalysis}
                </p>
            </div>

            <div className="space-y-2 bg-indigo-950/30 p-4 rounded-lg border border-indigo-500/20">
                <h4 className="text-sm uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Real World Analogy
                </h4>
                <p className="text-indigo-200 leading-relaxed text-sm italic">
                    "{data.realWorldAnalogy}"
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AiInsights;