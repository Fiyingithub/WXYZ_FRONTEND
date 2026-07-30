// import { useEffect } from 'react';
// import Navbar from '../Components/Navbar';
// import TopNav from '../Components/TopNav';
// import Footer from '../Components/Footer';
// import QueryString from 'query-string';
// import { useNavigate } from 'react-router-dom';

// import { FaRegHeart } from "react-icons/fa";

// import { allProducts } from './ProductDummyData';

// function SortedProductDisplay() {
//   const navigate = useNavigate();
//   const queryString = QueryString.parse(window.location.search);
//   const {category} = queryString;
//   const sortedCategory = allProducts.filter((product) => product.category === category);

//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     navigate('/cart');
//     // alert('Product added to cart successfully.');
//   }

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div>
//       <TopNav />
//       <div className="sticky top-0 z-50">
//         <Navbar />
//       </div>

//       <div className='flex justify-center'>
//         <div className="bg-white w-[100%] mx-5 md:mx-10 lg:max-w-[1100px] lg:pt-8 pt-4 pb-16 lg:py-10 flex flex-col justify-center ">
//           <div className=" flex flex-col lg:flex-row lg:items-center justify-between my-8 py-2 gap-3 mx-auto container max-w-[1100px] ">
//             <p className="lg:text-xl font-semibold opacity-85">All {category} product <span className="text-sm text-gray-500">{`(${sortedCategory.length} product${sortedCategory.length === 1 ? '' : 's'} found)`}</span></p>
//             <div className="flex gap-2">
//               <p className="text-xl font-semibold opacity-85">Sort by</p>
//               <select name="product-sort" id="product-sort" className="border border-gray-500 px-2 rounded">
//                 <option value="Popularity">Newest Arivals</option>
//                 <option value="Popularity">Popularity</option>
//                 <option value="Popularity">Price: Low to High</option>
//                 <option value="Popularity">Price: High to Low</option>
//               </select>
//             </div>
//           </div>

//           {sortedCategory.length > 0 ? (
//             <div className="flex flex-col flex-wrap gap-10 sm:flex-row mx-4 sm:mx-0 ">
//               {sortedCategory.map((product) => (
//                 <div key={product.id} className='lg:w-56 overflow-hidden h-78 transition-all duration-500 ease-in-out'>
//                   <div className='w-[100%] h-52 flex items-center justify-center bg-[#fff9f8] rounded-lg relative'>
//                     <img src={product.img} alt="" className='w-[40%] lg:w-[80%] object-contain' />
//                     <div className='absolute top-2 right-2 h-7 w-7 bg-white rounded-full flex items-center justify-center'>
//                       <FaRegHeart className='text-primary'/>
//                     </div>
//                   </div>
//                   <div className='h-28 flex flex-col justify-between '>
//                     <div className='flex justify-between h-6'>
//                       <h1 className='font-semibold'>{product.title}</h1>
//                       <p className='font-semibold'><span className='text-[10px]'>₦</span>{product.price}</p>
//                     </div>
//                     <div className='h-12'>
//                       <p className='text-sm '>{product.description}</p>
//                     </div>
//                     <div className='space-x-2'>
//                       <button className='border border-primary py-1 px-4 rounded-full font-medium hover:bg-gradient-to-br from-primary to-[orange] ' onClick={() => navigate(`/productdetails/?product-id=${product.id}`)}>View</button>
//                       <button className='border border-primary py-1 px-4 rounded-full font-medium hover:bg-gradient-to-br from-primary to-[orange] ' onClick={handleAddToCart}>Add to cart</button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ):(
//             <div className='italic text-2xl text-[red]'>Sorry, No products found...</div>
//           )}
//         </div>
//       </div>

//       <Footer />
//     </div>
//   )
// }

// export default SortedProductDisplay




import { useEffect } from 'react';
import Navbar from '../Components/Navbar';
import TopNav from '../Components/TopNav';
import Footer from '../Components/Footer';
import QueryString from 'query-string';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa";
import { allProducts } from './ProductDummyData';

function SortedProductDisplay() {
  const navigate = useNavigate();

  const queryString = QueryString.parse(window.location.search);
  const { category } = queryString;

  const sortedCategory = allProducts.filter(
    (product) => product.category === category
  );

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/cart');
    // Optionally trigger toast here if you're using it
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <TopNav />
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="flex justify-center">
        <div className="bg-white w-full mx-5 md:mx-10 lg:max-w-[1100px] lg:pt-8 pt-4 pb-16 lg:py-10 flex flex-col justify-center">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between my-8 py-2 gap-3 mx-auto container max-w-[1100px]">
            <p className="lg:text-xl font-semibold opacity-85">
              All {category} products{' '}
              <span className="text-sm text-gray-500">
                ({sortedCategory.length} product{sortedCategory.length === 1 ? '' : 's'} found)
              </span>
            </p>
            <div className="flex gap-2">
              <p className="text-xl font-semibold opacity-85">Sort by</p>
              <select
                name="product-sort"
                id="product-sort"
                className="border border-gray-500 px-2 rounded"
              >
                <option value="Newest">Newest Arrivals</option>
                <option value="Popularity">Popularity</option>
                <option value="LowToHigh">Price: Low to High</option>
                <option value="HighToLow">Price: High to Low</option>
              </select>
            </div>
          </div>

          {sortedCategory.length > 0 ? (
            <div className="flex flex-col flex-wrap gap-10 sm:flex-row mx-4 sm:mx-0">
              {sortedCategory.map((product) => (
                <div
                  key={product.id}
                  className="lg:w-56 overflow-hidden h-78 transition-all duration-500 ease-in-out"
                >
                  <div className="w-full h-52 flex items-center justify-center bg-[#fff9f8] rounded-lg relative">
                    <img
                      src={product.img}
                      alt={product.title}
                      className="w-[40%] lg:w-[80%] object-contain"
                    />
                    <div className="absolute top-2 right-2 h-7 w-7 bg-white rounded-full flex items-center justify-center">
                      <FaRegHeart className="text-primary" />
                    </div>
                  </div>
                  <div className="h-28 flex flex-col justify-between">
                    <div className="flex justify-between h-6">
                      <h1 className="font-semibold">{product.title}</h1>
                      <p className="font-semibold">
                        <span className="text-[10px]">₦</span>
                        {product.price}
                      </p>
                    </div>
                    <div className="h-12">
                      <p className="text-sm">{product.description}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        className="border border-primary py-1 px-4 rounded-full font-medium hover:bg-gradient-to-br from-primary to-[orange]"
                        onClick={() =>
                          navigate(`/productdetails/?product-id=${product.id}`)
                        }
                      >
                        View
                      </button>
                      <button
                        className="border border-primary py-1 px-4 rounded-full font-medium hover:bg-gradient-to-br from-primary to-[orange]"
                        onClick={handleAddToCart}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="italic text-2xl text-[red]">
              Sorry, no products found...
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SortedProductDisplay;
