// DashboardCards.tsx
import type { IconType } from "react-icons";
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaSpinner,
  FaUsers,
  FaBox,
} from "react-icons/fa6";
import type { DashboardSummary } from "../services/Admin/AdminDashboardService";
import { FaShoppingCart } from "react-icons/fa";

interface DashboardCardsProps {
  summary: DashboardSummary | null;
  loading: boolean;
}

// Define the actual response structure
interface DashboardSummaryResponse {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  successfulPayments: number;
  totalCustomers: number;
  totalProducts: number;
  totalRevenue: number;
}

// Map API fields to display cards
interface CardConfig {
  key: string;
  title: string;
  icon: IconType;
  accent: string;
  iconBg: string;
  bar: string;
  valueKey: keyof DashboardSummaryResponse;
  showTrend?: boolean;
}

const CARD_CONFIG: CardConfig[] = [
  {
    key: "totalRevenue",
    title: "Total Revenue",
    icon: FaWallet,
    accent: "text-[#f2592b]",
    iconBg: "bg-[#f2592b]/10",
    bar: "bg-[#f2592b]",
    valueKey: "totalRevenue",
  },
  {
    key: "totalOrders",
    title: "Total Orders",
    icon: FaShoppingCart,
    accent: "text-blue-600",
    iconBg: "bg-blue-50",
    bar: "bg-blue-500",
    valueKey: "totalOrders",
  },
  {
    key: "pendingOrders",
    title: "Pending Orders",
    icon: FaClock,
    accent: "text-amber-600",
    iconBg: "bg-amber-50",
    bar: "bg-amber-500",
    valueKey: "pendingOrders",
  },
  {
    key: "totalCustomers",
    title: "Total Customers",
    icon: FaUsers,
    accent: "text-emerald-600",
    iconBg: "bg-emerald-50",
    bar: "bg-emerald-500",
    valueKey: "totalCustomers",
  },
  {
    key: "processingOrders",
    title: "Processing Orders",
    icon: FaSpinner,
    accent: "text-purple-600",
    iconBg: "bg-purple-50",
    bar: "bg-purple-500",
    valueKey: "processingOrders",
  },
  {
    key: "totalProducts",
    title: "Total Products",
    icon: FaBox,
    accent: "text-rose-600",
    iconBg: "bg-rose-50",
    bar: "bg-rose-500",
    valueKey: "totalProducts",
  },
];

const formatNaira = (value: number | undefined | null) =>
  `₦${(value ?? 0).toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

const formatNumber = (value: number | undefined | null) =>
  `${(value ?? 0).toLocaleString()}`;

const CardSkeleton = () => (
  <div className="rounded-[28px] bg-white p-6 ring-1 ring-black/5 shadow-[0_2px_20px_-4px_rgba(20,20,31,0.06)] animate-pulse">
    <div className="flex items-start justify-between">
      <div className="w-12 h-12 rounded-2xl bg-gray-100" />
      <div className="w-14 h-6 rounded-full bg-gray-100" />
    </div>
    <div className="mt-6 h-3 w-20 bg-gray-100 rounded" />
    <div className="mt-2 h-7 w-28 bg-gray-100 rounded" />
  </div>
);

const DashboardCards = ({ summary, loading }: DashboardCardsProps) => {

  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CARD_CONFIG.map((c) => (
          <CardSkeleton key={c.key} />
        ))}
      </div>
    );
  }

  // Cast summary to the response type
  const data = summary as unknown as DashboardSummaryResponse;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {CARD_CONFIG.map((item) => {
        const Icon = item.icon;
        const value = data[item.valueKey] as number;
        
        // Determine if this is a revenue card (should show ₦)
        const isRevenue = item.key === "totalRevenue";
        const formattedValue = isRevenue ? formatNaira(value) : formatNumber(value);

        // Generate a random trend for demo purposes (in real app, this would come from API)
        const trend = Math.floor(Math.random() * 30) - 5; // -5% to 25%
        const isPositive = trend >= 0;

        return (
          <div
            key={item.key}
            className="group relative overflow-hidden rounded-[28px] bg-white p-6 ring-1 ring-black/5 shadow-[0_2px_20px_-4px_rgba(20,20,31,0.06)] hover:shadow-[0_8px_30px_-6px_rgba(20,20,31,0.12)] hover:-translate-y-0.5 transition-all duration-300"
          >
            {/* soft glow accent */}
            <div
              className={`absolute -top-12 -right-12 w-36 h-36 rounded-full ${item.iconBg} opacity-60 blur-2xl group-hover:opacity-90 transition-opacity`}
            />

            <div className="relative flex items-start justify-between">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${item.iconBg} ${item.accent}`}
              >
                <Icon />
              </div>

              <span
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  isPositive
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {isPositive ? (
                  <FaArrowUp className="text-[10px]" />
                ) : (
                  <FaArrowDown className="text-[10px]" />
                )}
                {Math.abs(trend)}%
              </span>
            </div>

            <div className="relative mt-5">
              <p className="text-sm font-medium text-gray-500">{item.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">
                {formattedValue}
              </p>
            </div>

            <div className="relative mt-4 flex items-center justify-between">
              <p className="text-xs text-gray-400">vs. last month</p>
              <div className="h-1 w-16 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.bar}`}
                  style={{ width: `${Math.min(Math.abs(trend) * 4, 100)}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;