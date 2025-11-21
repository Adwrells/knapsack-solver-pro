import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import SolutionVisualizer from './components/SolutionVisualizer';
import AiInsights from './components/AiInsights';
import { KnapsackItem, KnapsackResult, AppState } from './types';
import { solveKnapsack } from './services/knapsackService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  
  const [items, setItems] = useState<KnapsackItem[]>([
    { id: 1, name: 'Project A', weight: 2, value: 40 },
    { id: 2, name: 'Project B', weight: 3, value: 50 },
    { id: 3, name: 'Project C', weight: 1, value: 100 },
    { id: 4, name: 'Project D', weight: 5, value: 95 },
    { id: 5, name: 'Project E', weight: 3, value: 30 },
  ]);
  
  const [capacity, setCapacity] = useState<number>(7);
  const [result, setResult] = useState<KnapsackResult | null>(null);

  const handleSolve = useCallback(() => {
    setAppState(AppState.SOLVING);
    // Small artificial delay for UX "processing" feel
    setTimeout(() => {
      const solution = solveKnapsack(items, capacity);
      setResult(solution);
      setAppState(AppState.RESULTS);
    }, 600);
  }, [items, capacity]);

  const handleReset = () => {
    setAppState(AppState.INPUT);
    setResult(null);
  };

  // Prepare chart data
  const chartData = items.map(item => ({
    name: item.name,
    value: item.value,
    weight: item.weight,
    ratio: parseFloat((item.value / item.weight).toFixed(2)),
    isSelected: result?.selectedItems.some(si => si.id === item.id)
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-primary-500/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
           <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
             {appState === AppState.INPUT ? 'Problem Configuration' : 'Optimization Results'}
           </h1>
           <p className="text-slate-400 max-w-2xl">
             {appState === AppState.INPUT 
               ? 'Define your constraints and available items. The algorithm will determine the optimal combination to maximize value within the weight limit.'
               : 'Analyze the optimal solution calculated via Dynamic Programming ($O(nW)$).'
             }
           </p>
        </div>

        {appState === AppState.INPUT && (
          <InputSection 
            items={items} 
            setItems={setItems} 
            capacity={capacity} 
            setCapacity={setCapacity}
            onSolve={handleSolve}
          />
        )}

        {appState === AppState.SOLVING && (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-slate-300">Computing Optimal Substructure...</p>
          </div>
        )}

        {appState === AppState.RESULTS && result && (
          <div className="space-y-8">
            <SolutionVisualizer items={items} result={result} onReset={handleReset} />
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Value vs Weight Distribution</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            cursor={{fill: '#1e293b'}}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                        <Bar dataKey="value" name="Value ($)" fill="#818cf8" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="weight" name="Weight (kg)" fill="#64748b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold text-white mb-4">Efficiency (Value/Weight)</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={80} />
                        <Tooltip 
                            cursor={{fill: '#1e293b'}}
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f1f5f9' }}
                        />
                        <Bar dataKey="ratio" name="Ratio (V/W)" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-slate-500 mt-4 text-center">
                    Items with higher ratios are generally preferred, but the greedy approach fails in the 0/1 Knapsack problem.
                  </p>
               </div>
            </div>

            {/* AI Integration */}
            <AiInsights 
                items={items}
                selectedItems={result.selectedItems}
                capacity={result.capacity}
                maxProfit={result.maxProfit}
            />
            
          </div>
        )}
      </main>
    </div>
  );
};

export default App;