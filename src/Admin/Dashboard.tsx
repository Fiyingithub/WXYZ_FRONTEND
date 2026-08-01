import DashboardCards from "./DashboardCards";
import MoneyFlow from "./MoneyFlow";
import BudgetCard from "./BudgetCard";
import TransactionsTable from "./TransactionsTable";


function Dashboard() {

  return (
    <div>
      <div className="space-y-10 mt-10">
        <DashboardCards />
        <div className="flex flex-col lg:flex-row gap-10">
          <MoneyFlow />
          <BudgetCard />
        </div>
        <div className="hidden lg:flex">
          <TransactionsTable />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
