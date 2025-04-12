
import { CategoryIconMap, CustomCategories } from "@/types";

// Default category icons
export const categoryIcons: CategoryIconMap = {
  "Food & Drinks": "utensils",
  "Housing": "home",
  "Transportation": "car",
  "Entertainment": "film",
  "Shopping": "shopping-bag",
  "Utilities": "plug",
  "Health": "heart",
  "Travel": "plane",
  "Education": "book",
  "Personal": "user",
  "Groceries": "shopping-cart",
  "Investments": "trending-up",
  "Salary": "credit-card",
  "Business": "briefcase",
  "Gifts": "gift",
  "Other": "circle",
};

// Get default categories
export const getDefaultCategories = (): string[] => {
  return Object.keys(categoryIcons);
};

// Get expense categories
export const getExpenseCategories = (): string[] => {
  return [
    "Food & Drinks",
    "Housing",
    "Transportation",
    "Entertainment",
    "Shopping",
    "Utilities",
    "Health",
    "Travel",
    "Education",
    "Personal",
    "Groceries",
    "Other"
  ];
};

// Get income categories
export const getIncomeCategories = (): string[] => {
  return [
    "Salary",
    "Business",
    "Investments",
    "Gifts",
    "Other"
  ];
};

// Get all categories including custom ones
export const getAllCategories = (customCategories: CustomCategories) => {
  return {
    expense: [...getExpenseCategories(), ...customCategories.expense],
    income: [...getIncomeCategories(), ...customCategories.income]
  };
};

// Get icon for a category
export const getIconForCategory = (category: string): string => {
  return categoryIcons[category] || "circle";
};
