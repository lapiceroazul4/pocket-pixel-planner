
import { useState } from "react";
import { useTransactions } from "@/context/TransactionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryTotal, MonthlyData } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { getIconForCategory } from "@/utils/categoryIcons";
import { CategoryBadge } from "@/components/CategoryBadge";
import { ChartPie, BarChart2 } from "lucide-react";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1', '#a4906c', '#e57f78', '#9579c5'];

export function ExpenseChart() {
  const { transactions } = useTransactions();
  const [chartType, setChartType] = useState<"category" | "monthly">("category");
  const [viewType, setViewType] = useState<"expense" | "income">("expense");

  // Process transaction data for the category pie chart
  const getCategoryData = (): CategoryTotal[] => {
    const filteredTransactions = transactions.filter(t => t.type === viewType);
    const total = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const categoryMap = new Map<string, number>();
    
    filteredTransactions.forEach(transaction => {
      const currentAmount = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, currentAmount + transaction.amount);
    });
    
    // Convert to array and calculate percentages
    return Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0
    }));
  };
  
  // Process data for monthly bar chart
  const getMonthlyData = (): MonthlyData[] => {
    const monthlyData = new Map<string, { expenses: number; income: number }>();
    
    // Get data for the last 6 months
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlyData.set(monthYear, { expenses: 0, income: 0 });
    }
    
    // Fill in transaction data
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      if (monthlyData.has(monthYear)) {
        const data = monthlyData.get(monthYear)!;
        if (transaction.type === 'expense') {
          data.expenses += transaction.amount;
        } else {
          data.income += transaction.amount;
        }
      }
    });
    
    // Convert to array sorted by date
    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        expenses: data.expenses,
        income: data.income
      }))
      .reverse();
  };

  const categoryData = getCategoryData();
  const monthlyData = getMonthlyData();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold">Analytics</CardTitle>
        
        <div className="flex items-center gap-2">
          <Tabs value={viewType} onValueChange={(v) => setViewType(v as "expense" | "income")}>
            <TabsList>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Tabs value={chartType} onValueChange={(v) => setChartType(v as "category" | "monthly")}>
            <TabsList>
              <TabsTrigger value="category" className="px-3">
                <ChartPie className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="monthly" className="px-3">
                <BarChart2 className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {chartType === "category" && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="w-full md:w-1/2 h-80">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="category"
                      label={({ category }) => category}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <p>No {viewType} data available</p>
                </div>
              )}
            </div>
            
            <div className="w-full md:w-1/2">
              <h3 className="text-lg font-medium mb-3">Breakdown</h3>
              <div className="space-y-3">
                {categoryData.length > 0 ? (
                  categoryData.map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <CategoryBadge category={item.category} />
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(item.amount)}</div>
                        <div className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-10">
                    No {viewType} transactions to display
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {chartType === "monthly" && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend />
                <Bar 
                  dataKey="expenses" 
                  name="Expenses" 
                  fill="#ff8042" 
                  radius={[4, 4, 0, 0]} 
                  hide={viewType === "income"}
                />
                <Bar 
                  dataKey="income" 
                  name="Income" 
                  fill="#82ca9d" 
                  radius={[4, 4, 0, 0]}
                  hide={viewType === "expense"} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
