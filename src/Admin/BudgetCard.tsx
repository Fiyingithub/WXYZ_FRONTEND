import React from 'react';
import Chart from 'react-apexcharts';

const BudgetCard = () => {
  const options = {
    chart: {
      type: 'donut',
    },
    colors: ['#EF4444', '#F87171', '#FCA5A5', '#FCD34D', '#FDBA74', '#FEF3C7'],
    labels: [
      'Cafe & Restaurants',
      'Entertainment',
      'Investments',
      'Food & Groceries',
      'Health & Beauty',
      'Traveling',
    ],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: '₦400',
              fontSize: '16px',
              fontWeight: 600,
              color: '#333',
              formatter: () => '₦5,950',
            },
          },
        },
      },
    },
    legend: {
      show: false,
    },
  };

  const series = [600, 350];

  return (
    <div className="p-6 flex flex-col justify-center bg-white border-2 border-gray-100 rounded-xl shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl font-semibold " style={{textAlign: 'left'}}>Budget</h2>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-10">
        <div className="relative grid grid-cols-2 lg:grid-cols-1">
          <div className="flex items-center mb-2">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            <span>Cafe & Restaurants</span>
          </div>
          <div className="flex items-center mb-2">
            <span className="w-3 h-3 bg-red-400 rounded-full mr-2"></span>
            <span>Entertainment</span>
          </div>
          <div className="flex items-center mb-2">
            <span className="w-3 h-3 bg-red-300 rounded-full mr-2"></span>
            <span>Investments</span>
          </div>
          <div className="flex items-center mb-2">
            <span className="w-3 h-3 bg-red-200 rounded-full mr-2"></span>
            <span>Food & Groceries</span>
          </div>
          <div className="flex items-center mb-2">
            <span className="w-3 h-3 bg-red-100 rounded-full mr-2"></span>
            <span>Health & Beauty</span>
          </div>
          <div className="flex items-center mb-2">
            <span className="w-3 h-3 bg-red-50 rounded-full mr-2"></span>
            <span>Traveling</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="">
            <Chart options={options} series={series} type="donut" width="230" />
          </div>
          <div>
            <div className="text-2xl font-semibold">₦5,950.00</div>
            <div className="text-gray-500">Total for month</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;