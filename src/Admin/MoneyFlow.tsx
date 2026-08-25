// components/MoneyFlow.tsx
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface MoneyFlowPoint {
  month: string;
  income: number;
  expense: number;
}

interface MoneyFlowProps {
  data: MoneyFlowPoint[];
  loading: boolean;
  year: number;
  years: number[];
  onYearChange: (year: number) => void;
}

const MoneyFlow = ({ data, loading, year, years, onYearChange }: MoneyFlowProps) => {
  const safeData = Array.isArray(data) ? data : [];
  const categories = safeData.map((d) => d.month);
  const series = [
    { name: "Income", data: safeData.map((d) => d.income) },
    { name: "Expenses", data: safeData.map((d) => d.expense) },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 300,
      stacked: true,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#f2592b", "#1e293b"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "42%",
        borderRadius: 8,
        borderRadiusApplication: "end",
      },
    },
    grid: {
      borderColor: "#F1F1F4",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#9CA3AF", fontSize: "12px" } },
    },
    yaxis: {
      labels: {
        style: { colors: "#9CA3AF", fontSize: "12px" },
        formatter: (val: number) => `₦${(val / 1000).toFixed(0)}k`,
      },
    },
    legend: { show: false },
    tooltip: {
      y: {
        formatter: (value: number) => `₦${value.toLocaleString()}`,
      },
    },
  };

  return (
    <div className="rounded-[28px] bg-white p-6 lg:w-[70%] w-full ring-1 ring-black/5 shadow-[0_2px_20px_-4px_rgba(20,20,31,0.06)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
            Overview
          </p>
          <h2 className="text-xl font-bold text-gray-900 mt-0.5">Moneyflow</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <span className="w-2.5 h-2.5 bg-[#f2592b] rounded-full" />
            Income
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <span className="w-2.5 h-2.5 bg-[#1e293b] rounded-full" />
            Expense
          </div>
          <select
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f2592b]/30"
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-75 flex items-center justify-center text-gray-300 text-sm">
          Loading money flow…
        </div>
      ) : safeData.length === 0 ? (
        <div className="h-75 flex items-center justify-center text-gray-400 text-sm">
          No transactions recorded for {year} yet.
        </div>
      ) : (
        <Chart options={options} series={series} type="bar" height={300} />
      )}
    </div>
  );
};

export default MoneyFlow;