
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getExpenseCategories, getIncomeCategories } from "@/utils/categoryIcons";
import { TransactionType } from "@/types";

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  transactionType: TransactionType;
}

export function CategorySelector({ value, onChange, transactionType }: CategorySelectorProps) {
  const categories = transactionType === "expense" 
    ? getExpenseCategories() 
    : getIncomeCategories();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
