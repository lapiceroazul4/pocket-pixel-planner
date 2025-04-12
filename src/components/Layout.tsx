
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Database, DollarSign, HelpCircle } from "lucide-react";
import { useTransactions } from "@/context/TransactionContext";
import { toast } from "@/components/ui/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { transactions } = useTransactions();
  
  const exportData = () => {
    try {
      const dataStr = JSON.stringify(transactions, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `finance-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Export successful",
        description: "Your data has been exported successfully."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Finance Tracker</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportData}
              className="hidden sm:flex items-center gap-1"
            >
              <Database className="h-4 w-4 mr-1" />
              Export Data
            </Button>
            
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="flex-1 container py-6">
        {children}
      </main>
      
      <footer className="border-t py-6 bg-background">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Finance Tracker. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
