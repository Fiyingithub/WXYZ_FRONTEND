import {useState} from 'react';

// Components
import Sidebar from './Sidebar';
import DashboardCards from './DashboardCards';
import MoneyFlow from './MoneyFlow';
import BudgetCard from './BudgetCard';
import TransactionsTable from './TransactionsTable';
import NavbarDashboard from './NavbarDashboard';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className='flex w-full'>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
      <div className='w-full'>
        <div className='sticky top-0 z-50'>
          <NavbarDashboard toggleSidebar={toggleSidebar}/>
        </div>
        <div className='px-4 space-y-10 mt-10'>
          <DashboardCards/>
          <div className='flex flex-col lg:flex-row gap-10'>
            <MoneyFlow/>
            <BudgetCard/>
          </div>
          <div className='hidden lg:flex'>
            <TransactionsTable/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard