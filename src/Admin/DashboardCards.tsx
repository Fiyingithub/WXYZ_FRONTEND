import type { IconType } from "react-icons";
import {
  FaWallet,
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaPiggyBank,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa6";

interface CardData {
  title: string;
  amount: string;
  trend: number;
  icon: IconType;
  accent: string;
  iconBg: string;
  glow: string;
}

const data: CardData[] = [
  {
    title: "Total Balance",
    amount: "₦15,000",
    trend: 12.4,
    icon: FaWallet,
    accent: "text-[#f2592b]",
    iconBg: "bg-[#f2592b]/10",
    glow: "from-[#f2592b]/15",
  },
  {
    title: "Income",
    amount: "₦7,500",
    trend: 8.1,
    icon: FaArrowTrendUp,
    accent: "text-emerald-600",
    iconBg: "bg-emerald-50",
    glow: "from-emerald-500/15",
  },
  {
    title: "Expenses",
    amount: "₦4,000",
    trend: -3.2,
    icon: FaArrowTrendDown,
    accent: "text-rose-600",
    iconBg: "bg-rose-50",
    glow: "from-rose-500/15",
  },
  {
    title: "Total Savings",
    amount: "₦3,500",
    trend: 5.6,
    icon: FaPiggyBank,
    accent: "text-amber-600",
    iconBg: "bg-amber-50",
    glow: "from-amber-500/15",
  },
];

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item, index) => {
        const Icon = item.icon;
        const isPositive = item.trend >= 0;

        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            {/* Decorative glow */}
            <div
              className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-linnear-to-br ${item.glow} to-transparent blur-2xl`}
            />

            <div className="relative flex items-start justify-between">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${item.iconBg} ${item.accent}`}
              >
                <Icon />
              </div>

              <span
                className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                }`}
              >
                {isPositive ? <FaArrowUp className="text-[10px]" /> : <FaArrowDown className="text-[10px]" />}
                {Math.abs(item.trend)}%
              </span>
            </div>

            <div className="relative mt-5">
              <p className="text-sm font-medium text-gray-500">{item.title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1 tracking-tight">{item.amount}</p>
            </div>

            <p className="relative mt-3 text-xs text-gray-400">vs. last month</p>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;