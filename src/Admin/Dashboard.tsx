// Dashboard.tsx
import { useEffect, useState } from "react";
import DashboardCards from "./DashboardCards";
import MoneyFlow from "./MoneyFlow";
import BudgetCard from "./BudgetCard";
import TransactionsTable from "./TransactionsTable";
import { adminDashboardService, type BudgetResponse, type DashboardSummary, type MoneyFlowPoint, type Transaction } from "../services/Admin/AdminDashboardService";

const YEARS = [2023, 2024, 2025, 2026];

function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [budget, setBudget] = useState<BudgetResponse | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [moneyFlow, setMoneyFlow] = useState<MoneyFlowPoint[]>([]);
  const [year, setYear] = useState(2026);

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingBudget, setLoadingBudget] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingMoneyFlow, setLoadingMoneyFlow] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Summary cards, budget donut, and transactions load once on mount.
  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const [summaryRes, budgetRes, transactionsRes] = await Promise.all([
          adminDashboardService.getSummary(),
          adminDashboardService.getBudget(),
          adminDashboardService.getTransactions({ limit: 10 }),
        ]);

        
        setSummary(summaryRes);
        setBudget(budgetRes);
        setTransactions(transactionsRes);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Could not load dashboard data. Please refresh the page.");
      } finally {
        setLoadingSummary(false);
        setLoadingBudget(false);
        setLoadingTransactions(false);
      }
    };

    loadStaticData();
  }, []);

  // Money flow refetches whenever the selected year changes.
  useEffect(() => {
    const loadMoneyFlow = async () => {
      setLoadingMoneyFlow(true);
      try {
        const data = await adminDashboardService.getMoneyFlow(year);
        console.log("Money flow response for year", year, ":", data);
        
        if (!Array.isArray(data)) {
          console.error("Unexpected money-flow response shape:", data);
          setError(
            "Money flow data came back in an unexpected format — check the /admin/dashboard/money-flow response shape.",
          );
          setMoneyFlow([]);
          return;
        }
        setMoneyFlow(data);
      } catch (err) {
        console.error("Error loading money flow:", err);
        setError("Could not load money flow data.");
        setMoneyFlow([]);
      } finally {
        setLoadingMoneyFlow(false);
      }
    };

    loadMoneyFlow();
  }, [year]);

  return (
    <div className="min-h-screen bg-[#F6F5F9] px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm px-4 py-3">
          {error}
        </div>
      )}

      <div className="space-y-8 max-w-350 mx-auto">
        <DashboardCards summary={summary} loading={loadingSummary} />

        <div className="flex flex-col lg:flex-row gap-6">
          <MoneyFlow
            data={moneyFlow}
            loading={loadingMoneyFlow}
            year={year}
            years={YEARS}
            onYearChange={setYear}
          />
          <BudgetCard budget={budget} loading={loadingBudget} />
        </div>

        <TransactionsTable transactions={transactions} loading={loadingTransactions} />
      </div>
    </div>
  );
}

export default Dashboard;