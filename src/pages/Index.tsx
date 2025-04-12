
import { Layout } from "@/components/Layout";
import { DashboardStats } from "@/components/DashboardStats";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { ExpenseChart } from "@/components/ExpenseChart";
import { TransactionProvider } from "@/context/TransactionContext";

const Index = () => {
  return (
    <TransactionProvider>
      <Layout>
        <div className="space-y-6">
          <DashboardStats />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <TransactionForm />
            </div>
            
            <div className="md:col-span-2">
              <ExpenseChart />
            </div>
          </div>
          
          <div>
            <TransactionList />
          </div>
        </div>
      </Layout>
    </TransactionProvider>
  );
};

export default Index;
