
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { Transaction } from "@/types";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/CategoryBadge";
import { useTransactions } from "@/context/TransactionContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const { deleteTransaction } = useTransactions();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formattedDate = new Date(transaction.date).toLocaleDateString();
  const timeAgo = formatDistanceToNow(new Date(transaction.date), { addSuffix: true });
  
  const amount = transaction.amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    setIsDialogOpen(false);
  };

  return (
    <div className="p-4 border-b last:border-b-0 transaction-card flex items-center justify-between">
      <div className="flex items-start flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex flex-col">
          <h3 className="font-medium">{transaction.description}</h3>
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            <span>{formattedDate}</span>
            <span className="text-xs opacity-60">({timeAgo})</span>
          </div>
        </div>
        <CategoryBadge category={transaction.category} className="mt-1 sm:mt-0 sm:ml-3" />
      </div>
      
      <div className="flex items-center gap-3">
        <span className={`font-medium ${transaction.type === 'expense' ? 'expense-text' : 'income-text'}`}>
          {transaction.type === 'expense' ? '- ' : '+ '}{amount}
        </span>
        
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this transaction? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
