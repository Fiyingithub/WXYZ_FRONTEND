// components/BudgetCard.tsx
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { BudgetResponse } from "../services/Admin/AdminDashboardService";



interface BudgetCardProps {
  budget: BudgetResponse | null;
  loading: boolean;
}

const PALETTE = [
  "#f2592b",
  "#f47c4f",
  "#f79d76",
  "#fabb9e",
  "#fdd7c4",
  "#fef0e7",
];

const formatNaira = (value: number) =>
  `₦${value.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

const BudgetCard = ({ budget, loading }: BudgetCardProps) => {
  console.log("Budget data:", budget);

  // Check for loading state
  if (loading) {
    return (
      <div className="p-6 bg-white rounded-[28px] ring-1 ring-black/5 shadow-[0_2px_20px_-4px_rgba(20,20,31,0.06)] animate-pulse min-h-80" />
    );
  }

  // Check if budget is null or undefined
  if (!budget || !budget.data) {
    return (
      <div className="p-6 flex flex-col justify-center bg-white rounded-[28px] ring-1 ring-black/5 shadow-[0_2px_20px_-4px_rgba(20,20,31,0.06)] w-full lg:w-[30%]">
        <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
          Spending
        </p>
        <h2 className="text-xl font-bold text-gray-900 mt-0.5 mb-6">Budget</h2>
        <div className="flex items-center justify-center py-10">
          <p className="text-sm text-gray-400">No budget data available.</p>
        </div>
      </div>
    );
  }

  // Extract data from the response
  const { totalRevenue, totalExpenses, remainingBudget } = budget.data;

  // Create categories for the donut chart
  const categories = [
    {
      label: "Revenue",
      amount: totalRevenue || 0,
    },
    {
      label: "Expenses",
      amount: totalExpenses || 0,
    },
    {
      label: "Remaining Budget",
      amount: remainingBudget || 0,
    }
  ].filter(cat => cat.amount > 0); // Only show categories with amount > 0

  // If all categories are 0, show a message
  if (categories.length === 0) {
    return (
      <div className="p-6 flex flex-col justify-center bg-white rounded-[28px] ring-1 ring-black/5 shadow-[0_2px_20px_-4px_rgba(20,20,31,0.06)] w-full lg:w-[30%]">
        <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
          Spending
        </p>
        <h2 className="text-xl font-bold text-gray-900 mt-0.5 mb-6">Budget</h2>
        <div className="flex items-center justify-center py-10">
          <p className="text-sm text-gray-400">No budget data available.</p>
        </div>
      </div>
    );
  }

  const totalBudget = totalRevenue || 0;

  const options: ApexOptions = {
    chart: { type: "donut", fontFamily: "inherit" },
    colors: PALETTE.slice(0, categories.length),
    labels: categories.map((c) => c.label),
    stroke: { width: 3, colors: ["#fff"] },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            value: {
              fontSize: "22px",
              fontWeight: 700,
              color: "#111827",
              formatter: () => formatNaira(totalBudget),
            },
            total: {
              show: true,
              label: "Total Budget",
              fontSize: "12px",
              fontWeight: 500,
              color: "#9CA3AF",
              formatter: () => formatNaira(totalBudget),
            },
          },
        },
      },
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: { 
      y: { 
        formatter: (v: number) => formatNaira(v) 
      } 
    },
  };

  const series = categories.map((c) => c.amount);

  return (
    <div className="p-6 flex flex-col justify-center bg-white rounded-[28px] ring-1 ring-black/5 shadow-[0_2px_20px_-4px_rgba(20,20,31,0.06)] w-full lg:w-[30%]">
      <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
        Spending
      </p>
      <h2 className="text-xl font-bold text-gray-900 mt-0.5 mb-6">Budget</h2>

      <div className="flex flex-col items-center gap-6">
        <Chart options={options} series={series} type="donut" width="220" />

        <div className="w-full space-y-2.5">
          {categories.map((c, i) => (
            <div
              key={c.label}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
                />
                <span className="text-gray-600 truncate">{c.label}</span>
              </div>
              <span className="font-semibold text-gray-800 shrink-0 ml-3">
                {formatNaira(c.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;