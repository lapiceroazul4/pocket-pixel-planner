
export type TransactionType = "expense" | "income";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
}

export interface CategoryTotal {
  category: string;
  amount: number;
  percentage: number;
}

export interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
}

export interface CategoryIconMap {
  [key: string]: string;
}

export interface CustomCategories {
  expense: string[];
  income: string[];
}
