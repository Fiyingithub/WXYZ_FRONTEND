// components/TransactionsTable.tsx
import { useState } from "react";

interface Transaction {
  id: string;
  createdAt: string;
  amount: number;
  customer: {
    email: string;
  }
  provider: string;
  status: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  loading: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  SUCCESS: "bg-green-100 text-green-600",
  FAILED: "bg-red-100 text-red-600",
  PENDING: "bg-amber-100 text-amber-600",
  PROCESSING: "bg-indigo-100 text-indigo-600",
  CANCELLED: "bg-rose-100 text-rose-600",
};

const statusStyle = (category: string) =>
  STATUS_STYLES[category] ?? "bg-gray-100 text-gray-600";

const formatAmount = (amount: number) => {
  const sign = amount < 0 ? "-" : "+";
  return `${sign}₦${Math.abs(amount).toLocaleString()}`;
};

const formatDateAndTime = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
}

const TransactionsTable = ({ transactions, loading }: TransactionsTableProps) => {
  const [account, setAccount] = useState("All accounts");

  return (
    <div className="bg-white rounded-[28px] ring-1 ring-black/5 shadow-[0_2px_20px_-4px_rgba(20,20,31,0.06)] p-6 w-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
            Activity
          </p>
          <h2 className="text-xl font-bold text-gray-900 mt-0.5">
            Recent Transactions
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f2592b]/30"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          >
            <option value="All accounts">All accounts</option>
          </select>
          <button className="text-sm font-semibold text-[#f2592b] hover:underline px-2">
            See all
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <th className="py-3 pr-4 font-semibold">Date</th>
              <th className="py-3 pr-4 font-semibold">Amount</th>
              <th className="py-3 pr-4 font-semibold">Payment Method</th>
              <th className="py-3 pr-4 font-semibold">Method</th>
              <th className="py-3 pr-4 font-semibold">Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-50 animate-pulse">
                  <td colSpan={5} className="py-4">
                    <div className="h-4 bg-gray-100 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  No transactions to show yet.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                >
                  <td className="py-3.5 pr-4 text-gray-500">{formatDateAndTime(t.createdAt)}</td>
                  <td
                    className={`py-3.5 pr-4 font-semibold ${
                      t.amount < 0 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {formatAmount(t.amount)}
                  </td>
                  <td className="py-3.5 pr-4 font-medium text-gray-800">
                    {t?.customer?.email}
                  </td>
                  <td className="py-3.5 pr-4 text-gray-500">{t.provider}</td>
                  <td className="py-3.5 pr-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle(
                        t.status,
                      )}`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;