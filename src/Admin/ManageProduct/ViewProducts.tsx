import  {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar';
import NavbarDashboard from '../NavbarDashboard';

function ViewProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [viewModal, setViewModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Sort from new to old
  const sortedProducts = [...products].sort((a: any, b: any) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());

  useEffect(() => {
    const getAllProducts = async () => {
      try{
        const res = await axios.get('https://oneworld-fq81.onrender.com/api/Product/GetAllProduct')
        // console.log(res.data)
        setProducts(res.data)
      } catch(err){
        console.log(err)
      }
    }
    getAllProducts()
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const findProductsByName = (products: any[], searchQuery: string) => {
    if (!searchQuery) return products;
    const lowerCaseQuery = searchQuery.toLowerCase();
    const result = products.filter((product: any) => product.name.toLowerCase().includes(lowerCaseQuery));
    return result;
  }

  return (
    <div className='flex'>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
      <div className='w-full'>
        <div className='sticky top-0 z-50'>
          <NavbarDashboard toggleSidebar={toggleSidebar}/>
        </div>
        <div className="flex flex-col px-4 w-full py-10 bg-[white]">
          <div className="flex flex-col lg:flex-row justify-between my-6">
            <p className="text-2xl font-semibold opacity-85">All Products</p>
            <input type="text" placeholder="Search Product" className="border border-primary py-2 px-4 rounded-full w-87.5 outline-none" onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            {(() => {
              const filteredProducts = searchQuery ? findProductsByName(products, searchQuery) || [] : sortedProducts;

              return filteredProducts?.map((item: any) => (
                <div key={item.productId} className='lg:w-56 overflow-hidden h-78 transition-all duration-500 ease-in-out'>
                  <div className='w-full h-52 flex items-center justify-center bg-[#fff9f8] rounded-lg relative'>
                    <img src={item.imageUrl === null ? null : item.imageUrl.split(',')[0]} alt="" className=' w-[40%] lg:w-[90%] object-contain ' />
                  </div>
                  <div className='h-28 flex flex-col justify-between '>
                    <div>
                      <h1 className='font-semibold whitespace-nowrap text-[14px]'>{item.name}</h1>
                      <p className='font-semibold'><span className='text-[10px]'>₦</span>{item.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                    </div>
                    <div className='h-12'>
                      <p className='text-[13px] whitespace-nowrap '>{item.description}</p>
                    </div>
                    <div>
                      <button className='border border-primary py-1 px-4 rounded-full font-medium hover:bg-linear-to-br from-[#f2592b] to-white ' onClick={() => navigate(`/admin/dashboard/productInventory?=${item.productId}`, {state: item})}>Product inventory</button>
                    </div>
                  </div>
                </div>
              ))

            })()}
          </div>
        </div>

        {viewModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg">
              <p>{viewModal}</p>
              <button onClick={() => setViewModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewProducts