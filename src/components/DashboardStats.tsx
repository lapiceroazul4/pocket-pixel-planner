
import { useTransactions } from "@/context/TransactionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownCircle, ArrowUpCircle, TrendingDown, TrendingUp, Wallet } from "lucide-react";

export function DashboardStats() {
  const { transactions } = useTransactions();

  // Calculate total income
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  // Calculate total expenses
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  // Calculate balance
  const balance = totalIncome - totalExpenses;

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  const getMonthlyData = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Filter transactions for this month
    const thisMonthTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    // Calculate this month's income and expenses
    const monthlyIncome = thisMonthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
      
    const monthlyExpenses = thisMonthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
      
    return { monthlyIncome, monthlyExpenses };
  };

  const { monthlyIncome, monthlyExpenses } = getMonthlyData();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatAmount(balance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total balance across all accounts
          </p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Income</CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-income" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-income">
            {formatAmount(totalIncome)}
          </div>
          <div className="flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1 text-income" />
            <p className="text-xs">
              <span className="font-medium text-income">{formatAmount(monthlyIncome)}</span>
              <span className="text-muted-foreground ml-1">this month</span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-expense" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-expense">
            {formatAmount(totalExpenses)}
          </div>
          <div className="flex items-center mt-1">
            <TrendingDown className="h-3 w-3 mr-1 text-expense" />
            <p className="text-xs">
              <span className="font-medium text-expense">{formatAmount(monthlyExpenses)}</span>
              <span className="text-muted-foreground ml-1">this month</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
