import { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaShoppingBag,
} from "react-icons/fa";
import Footer from "../../Components/Footer";
import TopNav from "../../Components/TopNav";
import Navbar from "../../Components/Navbar";
import type { Order } from "../../Admin/order/AdminOrder";
// import AdminOrderTable from "./AdminOrderTable";
// import { Order } from "./AdminOrder";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinedAt: string;
}

const getHue = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++)
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
};

// Mock lookup — swap for a real fetch keyed off the route param
const mockCustomer: Customer = {
  id: "cust-1",
  name: "David John",
  email: "david.john@example.com",
  phone: "+234 803 123 4567",
  address: "14 Admiralty Way, Lekki Phase 1, Lagos",
  joinedAt: "March 2024",
};

const mockCustomerOrders: Order[] = [
  {
    id: "1",
    customerName: "David John",
    productType: "MacBook Pro, 2",
    orderId: "#GGH78",
    date: "04/17/23 at 8:25 PM",
    totalAmount: 286000,
    status: "pending",
  },
  {
    id: "2",
    customerName: "David John",
    productType: "Wrist watch",
    orderId: "#GGH79",
    date: "03/02/23 at 3:10 PM",
    totalAmount: 216000,
    status: "confirmed",
  },
  {
    id: "3",
    customerName: "David John",
    productType: "Portable Speaker",
    orderId: "#GGH80",
    date: "02/14/23 at 11:40 AM",
    totalAmount: 86000,
    status: "delivered",
  },
  {
    id: "4",
    customerName: "David John",
    productType: "Face Cap",
    orderId: "#GGH81",
    date: "01/29/23 at 9:05 AM",
    totalAmount: 16000,
    status: "canceled",
  },
  {
    id: "5",
    customerName: "David John",
    productType: "Bluetooth Speaker",
    orderId: "#GGH82",
    date: "01/12/23 at 5:55 PM",
    totalAmount: 86000,
    status: "delivered",
  },
];

const CustomerProfile = () => {
  const { customerId } = useParams();
  const customer = { ...mockCustomer, id: customerId ?? mockCustomer.id };

//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 5;

  const totalSpent = useMemo(
    () => mockCustomerOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    [],
  );
  const totalOrders = mockCustomerOrders.length;
  const avgOrderValue = totalOrders ? totalSpent / totalOrders : 0;

//   const totalPages = Math.max(
//     1,
//     Math.ceil(mockCustomerOrders.length / pageSize),
//   );
//   const paginatedOrders = mockCustomerOrders.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize,
//   );

//   const goToPage = (page: number) =>
//     setCurrentPage(Math.min(Math.max(page, 1), totalPages));

  const hue = getHue(customer.email);
  const initials = customer.name.slice(0, 2).toUpperCase();

  return (
    <div>
      <TopNav />
      <div className="sticky top-0 z-50 w-full">
        <Navbar />
      </div>
      <div className="w-full min-h-screen bg-gray-50 px-4 md:px-8 py-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          {/* Header card */}
          <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-100">
            <div className="h-24 bg-linear-to-r from-[#f2592b] to-[#f2592b]/70" />
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-semibold ring-4 ring-white shrink-0"
                  style={{ backgroundColor: `hsl(${hue}, 65%, 45%)` }}
                >
                  {initials}
                </div>
                <div className="pb-1">
                  <h1 className="text-lg font-bold text-gray-800">
                    {customer.name}
                  </h1>
                  <span className="inline-flex items-center text-xs font-medium text-[#f2592b] bg-orange-50 px-2.5 py-0.5 rounded-full mt-1">
                    Customer
                  </span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-6 text-sm text-gray-600">
                <InfoRow icon={<FaEnvelope />} label={customer.email} />
                <InfoRow icon={<FaPhone />} label={customer.phone} />
                <InfoRow icon={<FaMapMarkerAlt />} label={customer.address} />
                <InfoRow
                  icon={<FaCalendarAlt />}
                  label={`Customer since ${customer.joinedAt}`}
                />
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Total Orders"
              value={totalOrders.toString()}
              icon={<FaShoppingBag />}
              accent="text-[#f2592b]"
              iconBg="bg-orange-50"
            />
            <StatCard
              label="Total Spent"
              value={`₦${totalSpent.toLocaleString("en-NG")}`}
              icon={<FaShoppingBag />}
              accent="text-emerald-600"
              iconBg="bg-emerald-50"
            />
            <StatCard
              label="Average Order Value"
              value={`₦${Math.round(avgOrderValue).toLocaleString("en-NG")}`}
              icon={<FaShoppingBag />}
              accent="text-indigo-600"
              iconBg="bg-indigo-50"
            />
          </div>

          {/* Order history */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-3">
              Order History
            </h2>
            {/* <AdminOrderTable
            orders={paginatedOrders}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={mockCustomerOrders.length}
            pageSize={pageSize}
            onPageChange={goToPage}
          /> */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const InfoRow = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-2.5">
    <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 text-xs shrink-0">
      {icon}
    </span>
    <span className="truncate">{label}</span>
  </div>
);

const StatCard = ({
  label,
  value,
  icon,
  accent,
  iconBg,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string;
  iconBg: string;
}) => (
  <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 flex items-center gap-4">
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${iconBg} ${accent}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-lg font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  </div>
);

export default CustomerProfile;
