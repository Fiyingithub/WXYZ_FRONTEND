import Navbar from '../Components/Navbar'
import TopNav from "../Components/TopNav";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";

const LandingPageLayout = () => {
  return (
    <div>
      <TopNav />
      <div className="sticky top-0 z-50 w-full">
        <Navbar />
      </div>
      
      <main>
            <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPageLayout;
