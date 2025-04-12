
import { useState } from "react";
import { useTransactions } from "@/context/TransactionContext";
import { TransactionItem } from "@/components/TransactionItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionType } from "@/types";
import { Filter, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function TransactionList() {
  const { transactions, filterTransactions, getCategories } = useTransactions();
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");
  const [filterCategory, setFilterCategory] = useState<string | "all">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = getCategories();
  
  const filteredTransactions = filterTransactions({
    type: filterType === "all" ? undefined : filterType,
    category: filterCategory === "all" ? undefined : filterCategory,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const clearFilters = () => {
    setFilterType("all");
    setFilterCategory("all");
    setStartDate("");
    setEndDate("");
    setIsFilterOpen(false);
  };

  const hasActiveFilters = filterType !== "all" || filterCategory !== "all" || startDate || endDate;

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">History</h2>
        
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              {hasActiveFilters ? "Filters Applied" : "Filter"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4" align="end">
            <div className="space-y-4">
              <div>
                <Label>Transaction Type</Label>
                <Select
                  value={filterType}
                  onValueChange={(value) => setFilterType(value as TransactionType | "all")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="expense">Expenses</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Category</Label>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
                <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {hasActiveFilters && (
        <div className="bg-muted/50 px-3 py-2 rounded-lg text-sm flex items-center justify-between mb-3">
          <span>
            Showing: {filterType !== "all" ? (filterType === "expense" ? "Expenses" : "Income") : "All transactions"}
            {filterCategory !== "all" ? ` in ${filterCategory}` : ""}
            {startDate ? ` from ${new Date(startDate).toLocaleDateString()}` : ""}
            {endDate ? ` to ${new Date(endDate).toLocaleDateString()}` : ""}
          </span>
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 w-7 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="divide-y">
        {filteredTransactions.length > 0 ? (
          filteredTransactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            <p className="mb-2">No transactions found</p>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
