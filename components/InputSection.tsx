import React, { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCw, Play } from 'lucide-react';
import { KnapsackItem } from '../types';

interface InputSectionProps {
  items: KnapsackItem[];
  setItems: React.Dispatch<React.SetStateAction<KnapsackItem[]>>;
  capacity: number;
  setCapacity: (c: number) => void;
  onSolve: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({ items, setItems, capacity, setCapacity, onSolve }) => {
  
  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, { id: newId, name: `Item ${newId}`, weight: 1, value: 10 }]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: number, field: keyof KnapsackItem, value: string | number) => {
    setItems(items.map(i => {
      if (i.id === id) {
        return { ...i, [field]: value };
      }
      return i;
    }));
  };

  // Preset scenarios for quick testing
  const loadPreset = (type: 'basic' | 'complex') => {
    if (type === 'basic') {
      setCapacity(10);
      setItems([
        { id: 1, name: 'Laptop', weight: 3, value: 10 },
        { id: 2, name: 'Camera', weight: 4, value: 15 },
        { id: 3, name: 'Food', weight: 2, value: 5 },
        { id: 4, name: 'Water', weight: 1, value: 3 },
        { id: 5, name: 'Tent', weight: 5, value: 20 },
      ]);
    } else {
      setCapacity(20);
      setItems([
        { id: 1, name: 'Gold Bar', weight: 6, value: 30 },
        { id: 2, name: 'Silver Ingot', weight: 4, value: 16 },
        { id: 3, name: 'Bronze Statue', weight: 3, value: 10 },
        { id: 4, name: 'Diamond', weight: 1, value: 25 },
        { id: 5, name: 'Platinum Ring', weight: 2, value: 22 },
        { id: 6, name: 'Antique Vase', weight: 8, value: 15 },
      ]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Left Panel: Configuration */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary-500 rounded-full"></span>
            Global Constraints
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Knapsack Capacity (W)</label>
              <div className="relative">
                <input 
                  type="number" 
                  min="1"
                  max="100"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                />
                <span className="absolute right-4 top-2.5 text-slate-500 text-sm">kg/units</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                *For visualization purposes, keep capacity ≤ 50.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <label className="block text-sm font-medium text-slate-400 mb-3">Quick Presets</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => loadPreset('basic')}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors border border-slate-700"
                >
                  Basic (n=5)
                </button>
                <button 
                  onClick={() => loadPreset('complex')}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors border border-slate-700"
                >
                  Complex (n=6)
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onSolve}
          className="w-full group relative overflow-hidden bg-primary-600 hover:bg-primary-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary-900/20 transition-all duration-300 active:scale-[0.98]"
        >
          <div className="flex items-center justify-center gap-2 relative z-10">
            <Play className="w-5 h-5 fill-current" />
            <span>Optimize Selection</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </button>
      </div>

      {/* Right Panel: Items Table */}
      <div className="lg:col-span-2">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
              Item Inventory (n={items.length})
            </h2>
            <button 
              onClick={addItem}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-sm font-medium transition-colors border border-slate-700"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          <div className="flex-grow overflow-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400 uppercase sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 font-medium">Item Name</th>
                  <th className="px-6 py-3 font-medium text-center">Weight ($w_i$)</th>
                  <th className="px-6 py-3 font-medium text-center">Value ($v_i$)</th>
                  <th className="px-6 py-3 font-medium text-center">Ratio (v/w)</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                {items.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-3">
                      <input 
                        type="text" 
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="bg-transparent border-b border-transparent group-hover:border-slate-600 focus:border-primary-500 focus:ring-0 outline-none w-full text-slate-200 placeholder-slate-600"
                        placeholder="Item Name"
                      />
                    </td>
                    <td className="px-6 py-3 text-center">
                      <input 
                        type="number" 
                        min="1"
                        value={item.weight}
                        onChange={(e) => updateItem(item.id, 'weight', parseInt(e.target.value) || 0)}
                        className="bg-slate-950/50 w-20 text-center rounded border border-slate-700 focus:border-primary-500 outline-none py-1 text-slate-200"
                      />
                    </td>
                    <td className="px-6 py-3 text-center">
                      <input 
                        type="number" 
                        min="0"
                        value={item.value}
                        onChange={(e) => updateItem(item.id, 'value', parseInt(e.target.value) || 0)}
                        className="bg-slate-950/50 w-20 text-center rounded border border-slate-700 focus:border-primary-500 outline-none py-1 text-slate-200"
                      />
                    </td>
                    <td className="px-6 py-3 text-center text-slate-500 font-mono">
                      {(item.value / (item.weight || 1)).toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:bg-rose-500/20 hover:text-rose-400 text-slate-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No items added. Click "Add Item" to start.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputSection;