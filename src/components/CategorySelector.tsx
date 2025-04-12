
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getExpenseCategories, getIncomeCategories } from "@/utils/categoryIcons";
import { TransactionType } from "@/types";
import { useTransactions } from "@/context/TransactionContext";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  transactionType: TransactionType;
}

export function CategorySelector({ value, onChange, transactionType }: CategorySelectorProps) {
  const { customCategories, addCustomCategory } = useTransactions();
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  
  const defaultCategories = transactionType === "expense" 
    ? getExpenseCategories() 
    : getIncomeCategories();
  
  const userCategories = customCategories[transactionType];
  
  // All categories combined
  const allCategories = [...defaultCategories, ...userCategories];
  
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCustomCategory(transactionType, newCategory.trim());
      setNewCategory("");
      setOpen(false);
    }
  };

  return (
    <div className="space-y-1">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Default Categories</SelectLabel>
            {defaultCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectGroup>
          
          {userCategories.length > 0 && (
            <SelectGroup>
              <SelectLabel>Custom Categories</SelectLabel>
              {userCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center gap-1 mt-1"
          >
            <PlusCircle className="h-4 w-4" /> 
            Add New Category
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New {transactionType === "expense" ? "Expense" : "Income"} Category</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newCategory">Category Name</Label>
              <Input 
                id="newCategory" 
                placeholder="Enter category name" 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="button" onClick={handleAddCategory}>Save Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
