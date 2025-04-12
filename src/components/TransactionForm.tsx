
import { useState } from "react";
import { useTransactions } from "@/context/TransactionContext";
import { TransactionType } from "@/types";
import { CategorySelector } from "@/components/CategorySelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export function TransactionForm() {
  const { addTransaction } = useTransactions();
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !category) {
      // Simple validation
      return;
    }
    
    addTransaction({
      type,
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString(),
    });
    
    // Reset form
    setAmount("");
    setDescription("");
    setCategory("");
  };

  return (
    <div className="glass-card p-5 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
      
      <Tabs value={type} onValueChange={(value) => setType(value as TransactionType)} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="expense" className="flex items-center gap-2">
            <ArrowDownCircle className="h-4 w-4 text-expense" />
            Expense
          </TabsTrigger>
          <TabsTrigger value="income" className="flex items-center gap-2">
            <ArrowUpCircle className="h-4 w-4 text-income" />
            Income
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <CategorySelector
              value={category}
              onChange={setCategory}
              transactionType={type}
            />
          </div>

          <Button type="submit" className="w-full">
            Add {type === "expense" ? "Expense" : "Income"}
          </Button>
        </form>
      </Tabs>
    </div>
  );
}
