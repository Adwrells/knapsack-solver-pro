export interface KnapsackItem {
  id: number;
  name: string;
  weight: number;
  value: number;
  ratio?: number; // Value per weight unit
}

export interface KnapsackResult {
  maxProfit: number;
  selectedItems: KnapsackItem[];
  dpTable: number[][];
  pathTrace: boolean[][]; // To visualize the selection path
  capacity: number;
  totalWeight: number;
}

export enum AppState {
  INPUT = 'INPUT',
  SOLVING = 'SOLVING',
  RESULTS = 'RESULTS'
}

export interface GeminiExplanation {
  summary: string;
  strategyAnalysis: string;
  realWorldAnalogy: string;
}