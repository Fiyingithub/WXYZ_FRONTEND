const DashboardCards = () => {
  const data = [
    { title: 'Total Balance', amount: '₦15,000', bgColor: 'bg-blue-500', icon: '💰' },
    { title: 'Income', amount: '₦7,500', bgColor: 'bg-green-500', icon: '📈' },
    { title: 'Expenses', amount: '₦4,000', bgColor: 'bg-red-500', icon: '📉' },
    { title: 'Total Savings', amount: '₦3,500', bgColor: 'bg-yellow-500', icon: '💸' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((item, index) => (
        <div key={index} className={`p-5 rounded-lg shadow-lg ${item.bgColor} text-white`}>
          <div className="flex items-center justify-between">
            <div className="text-2xl">{item.icon}</div>
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-2xl font-bold mt-1">{item.amount}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;