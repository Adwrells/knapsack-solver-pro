import { KnapsackItem, KnapsackResult } from '../types';

export const solveKnapsack = (items: KnapsackItem[], capacity: number): KnapsackResult => {
  const n = items.length;
  // dp[i][w] stores the max value for first i items with capacity w
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));
  
  // pathTrace helps us reconstruct the solution visually
  // true if we included item i at capacity w
  const pathTrace: boolean[][] = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(false));

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1]; // Items are 0-indexed
    for (let w = 0; w <= capacity; w++) {
      if (item.weight <= w) {
        const includeValue = item.value + dp[i - 1][w - item.weight];
        const excludeValue = dp[i - 1][w];
        
        if (includeValue > excludeValue) {
          dp[i][w] = includeValue;
          pathTrace[i][w] = true; // We picked the item
        } else {
          dp[i][w] = excludeValue;
          pathTrace[i][w] = false; // We skipped the item
        }
      } else {
        dp[i][w] = dp[i - 1][w];
        pathTrace[i][w] = false; // Item too heavy
      }
    }
  }

  // Backtrack to find selected items
  const selectedItems: KnapsackItem[] = [];
  let w = capacity;
  let totalWeight = 0;
  
  for (let i = n; i > 0; i--) {
    if (pathTrace[i][w]) {
      const item = items[i - 1];
      selectedItems.push(item);
      totalWeight += item.weight;
      w -= item.weight;
    }
  }

  return {
    maxProfit: dp[n][capacity],
    selectedItems: selectedItems.reverse(), // Optional: keeps original order
    dpTable: dp,
    pathTrace,
    capacity,
    totalWeight
  };
};