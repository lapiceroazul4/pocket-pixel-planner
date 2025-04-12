
import React, { createContext, useContext, useState, useEffect } from "react";
import { Transaction, TransactionType, CustomCategories } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { getDefaultCategories, getExpenseCategories, getIncomeCategories } from "@/utils/categoryIcons";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  filterTransactions: (filters: {
    type?: TransactionType;
    category?: string;
    startDate?: string;
    endDate?: string;
  }) => Transaction[];
  getCategories: () => string[];
  loading: boolean;
  customCategories: CustomCategories;
  addCustomCategory: (type: TransactionType, category: string) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [customCategories, setCustomCategories] = useState<CustomCategories>({
    expense: [],
    income: []
  });

  // Load transactions and custom categories from localStorage on mount
  useEffect(() => {
    // Load transactions
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error("Error parsing transactions:", error);
        toast({
          title: "Error loading transactions",
          description: "There was a problem loading your saved transactions.",
          variant: "destructive",
        });
      }
    }

    // Load custom categories
    const savedCategories = localStorage.getItem("customCategories");
    if (savedCategories) {
      try {
        setCustomCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error("Error parsing custom categories:", error);
      }
    }
    
    setLoading(false);
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }, [transactions, loading]);

  // Save custom categories to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("customCategories", JSON.stringify(customCategories));
    }
  }, [customCategories, loading]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
    toast({
      title: "Transaction added",
      description: `${transaction.type === "expense" ? "Expense" : "Income"} of $${transaction.amount} added successfully.`,
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
    toast({
      title: "Transaction deleted",
      description: "The transaction has been removed.",
    });
  };

  const filterTransactions = (filters: {
    type?: TransactionType;
    category?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    return transactions.filter((transaction) => {
      let match = true;

      if (filters.type && transaction.type !== filters.type) {
        match = false;
      }

      if (filters.category && transaction.category !== filters.category) {
        match = false;
      }

      if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
        match = false;
      }

      if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
        match = false;
      }

      return match;
    });
  };

  const getCategories = () => {
    const categories = new Set<string>();
    transactions.forEach((transaction) => {
      categories.add(transaction.category);
    });
    return Array.from(categories);
  };

  // Add new custom category
  const addCustomCategory = (type: TransactionType, category: string) => {
    // Check if category already exists (including default categories)
    const defaultCategories = type === "expense" ? getExpenseCategories() : getIncomeCategories();
    const existingCustomCategories = customCategories[type];
    
    if (defaultCategories.includes(category) || existingCustomCategories.includes(category)) {
      toast({
        title: "Category already exists",
        description: `The category "${category}" already exists.`,
        variant: "destructive",
      });
      return;
    }
    
    setCustomCategories(prev => ({
      ...prev,
      [type]: [...prev[type], category]
    }));
    
    toast({
      title: "Category added",
      description: `New ${type} category "${category}" has been added.`,
    });
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        filterTransactions,
        getCategories,
        loading,
        customCategories,
        addCustomCategory,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
}
