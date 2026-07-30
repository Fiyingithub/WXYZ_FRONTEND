import { useState } from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';




const MoneyFlow = () => {
  const dataByYear: Record<string, { income: number[]; expenses: number[] }> = {
    2023: {
      income: [7000, 9000, 8000, 10000, 7000, 9500, 6000],
      expenses: [4000, 6000, 5000, 8000, 3000, 7000, 5000],
    },
    2024: {
      income: [7500, 8500, 8800, 11000, 7600, 10000, 6200],
      expenses: [4200, 6100, 5400, 7800, 3200, 7100, 5300],
    },
    2025: {
      income: [8000, 9500, 8700, 12000, 7400, 9600, 6100],
      expenses: [4500, 6200, 5100, 8200, 3500, 6800, 5400],
    },
  };

  const [selectedYear, setSelectedYear] = useState('2023');
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([
    { name: 'Income', data: dataByYear[selectedYear].income },
    { name: 'Expenses', data: dataByYear[selectedYear].expenses },
  ]);

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    colors: ['#EF4444', '#FCA5A5'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    yaxis: {
      title: {
        text: 'Amount (₦)',
      },
    },
    title: {
      text: `Money Flow - ${selectedYear}`,
      align: 'left',
    },
    tooltip: {
      y: {
        formatter: (value: number) => `₦${value}`,
      },
    },
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    setSelectedYear(year);
    setSeries([
      { name: 'Income', data: dataByYear[year].income },
      { name: 'Expenses', data: dataByYear[year].expenses },
    ]);
  };

  return (
    <div className="rounded-lg border-2 p-2 lg:w-[70%] w-full">
      <div className="flex flex-col lg:flex-row items-center justify-between text-center md:p-1 mb-5 bg-white">
        <h2 className="text-xl font-semibold">Moneyflow</h2>
        <div className="flex md:space-x-2">
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span>Income</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 bg-red-300 rounded-full"></span>
            <span>Expense</span>
          </div>
          <div className="flex items-center space-x-2">
            <select className="border rounded px-2" onChange={handleYearChange} value={selectedYear}>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
            <select className="border rounded px-2">
              <option>This year</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white flex justify-center p-4 w-full">
        <Chart options={options} series={series} type="bar" height={250} style={{ width: '100%' }} />
      </div>
    </div>
  );
};

export default MoneyFlow;
