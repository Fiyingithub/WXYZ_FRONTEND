// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Footer from "../Components/Footer";
// import TopNav from "../Components/TopNav";
// import Navbar from "../Components/Navbar";
// import axios from "axios";

// import { MdOutlineDeleteForever } from "react-icons/md";

// // Images
// // import img1 from "../Asset/images/bag 3.png";
// // import img2 from "../Asset/images/bag2.png";
// // import img3 from "../Asset/images/brown bag.png";
// // import img4 from "../Asset/images/black backpack.png";
// // import img5 from "../Asset/images/download 1.jpg";
// // { id: 1, name: "Product 1", image: img1, description: "This is the description for the product 1", price: 20, quantity: 1, checked: false },
// //     { id: 2, name: "Product 2", image: img2, description: "This is the description for the product 2", price: 35, quantity: 1, checked: false },
// //     { id: 3, name: "Product 3", image: img3, description: "This is the description for the product 3", price: 50, quantity: 1, checked: false },
// //     { id: 4, name: "Product 4", image: img4, description: "This is the description for the product 4", price: 75, quantity: 1, checked: false },
// //     { id: 5, name: "Product 5", image: img5, description: "This is the description for the product 5", price: 100, quantity: 1, checked: false },

// const Cart = () => {
//   const cartId = localStorage.getItem('cartId')
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([
    
//   ]);
//   const [fetchedData, setFetchedData] = useState([]);

//   const [isAllChecked, setIsAllChecked] = useState(false);
//   useEffect(() => {
//     const getCart = async () => {
//       try{
//         const res = await axios.get(`https://oneworld-fq81.onrender.com/api/Cart/${cartId}`)
//         console.log(res.data.items)
//         setCartItems(res.data.items)
//       } catch(err){
//         console.log(err)
//       }
//     }
//     getCart();
//   }, [cartId])

//   useEffect(() => {
//     const getdatabyid = async (productId) => {
//       try {
//         const response = await axios.get(
//           `https://oneworld-fq81.onrender.com/api/Product/GetProductById/${productId}`
//         );
//         return response.data;
//       } catch (error) {
//         console.error(`Error fetching data for ID ${productId}:`, error.message);
//       }
//     };

//     const fetchAllData = async () => {
//       if (cartItems.length > 0) {
//         const result = await Promise.all(
//           cartItems.map(async (item) => {
//             const additionalData = await getdatabyid(item.productId);
//             return { ...item, ...additionalData };
//           })
//         );
//         setFetchedData(result);
//         // setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, [cartItems]);

//   const updatedData = fetchedData.map((item, index) => {
//     return { ...item, id: index + 1 };
//   });
//   console.log('Updated', updatedData)

//   const handleQuantityChange = (id, increment) => {
//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === id
//           ? {
//               ...item,
//               quantity: Math.max(1, item.quantity + (increment ? 1 : -1)),
//             }
//           : item
//       )
//     );
//   };

//   const handleRemoveItem = (id) => {
//     setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
//   };

//   const calculateTotal = () => {
//     return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//   };

//   const handleHeadCheckboxChange = () => {
//     const newCheckState = !isAllChecked;
//     setIsAllChecked(newCheckState);
//     setCartItems((prevItems) =>
//       prevItems.map((item) => ({ ...item, checked: newCheckState }))
//     );
//   };

//   const handleRowCheckboxChange = (id) => {
//     setCartItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === id ? { ...item, checked: !item.checked } : item
//       )
//     );
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div>
//       <TopNav />
//       <div className="sticky top-0 z-50">
//        <Navbar />
//       </div>

//       <div className=" rounded-md mx-auto max-w-[1100px] pt-10 flex flex-col lg:flex-row justify-between pb-10">
//         <div className="border border-[#ce5733] rounded-lg lg:w-[700px] p-4">
//           <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
//           <table className="w-full">
//             <thead>
//               <tr className="border-b">
//                 <th className="text-left lg:p-2">
//                   <input
//                     type="checkbox"
//                     className="mr-4"
//                     checked={isAllChecked}
//                     onChange={handleHeadCheckboxChange}
//                   />
//                   Product
//                 </th>
//                 <th className="text-left p-2">Quantity</th>
//                 <th className="text-left p-2">Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fetchedData && fetchedData.length > 0 ? (
//                 updatedData.map((item) => (
//                   <tr className="border-b" key={item.id}>
//                     <td className="lg:pr-10">
//                       <div className="flex items-center lg:p-2 lg:space-x-4">
//                         <input
//                           type="checkbox"
//                           checked={item.checked}
//                           onChange={() => handleRowCheckboxChange(item.id)}
//                           className="mr-2"
//                         />
//                         <div className="flex items-center space-x-1 lg:space-x-4">
//                           <img src={item.data.imageUrl !== undefined ? item.data.imageUrl.split(",")[1] : null} className="w-10 h-10" alt="" />
//                           <div>
//                             <h3 className="font-medium">{item.data.name}</h3>
//                             <p className="text-[10px] text-gray-500">{item.data.description}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="p-1 lg:p-2 lg:pr-10">
//                       <div className="flex flex-col space-y-1 items-center">
//                         <div className="border border-[#ce5733] rounded-lg px-4 py-1 flex items-center justify-between w-28">
//                           <button
//                             onClick={() => handleQuantityChange(item.id, false)}
//                             className="text-[18px] text-gray-700"
//                           >
//                             -
//                           </button>
//                           <span className="px-2">{item.quantity}</span>
//                           <button
//                             onClick={() => handleQuantityChange(item.id, true)}
//                             className="text-[18px] text-gray-700"
//                           >
//                             +
//                           </button>
//                         </div>
//                         <button
//                           onClick={() => handleRemoveItem(item.id)}
//                           className="flex items-center text-sm text-red-500"
//                         >
//                           <MdOutlineDeleteForever /> <span>Remove</span>
//                         </button>
//                       </div>
//                     </td>
//                     <td className="p-2">₦{item.price.toFixed(2)}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <div className="flex justify-center items-center ">
//                   <p className="text-gray-500">Your cart is empty.</p>
//                 </div>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="border border-[#ce5733] rounded-lg lg:w-[350px] h-[230px] p-4 my-4 lg:my-0">
//           <div className="space-y-4">
//             <div className="border-b space-y-4 my-4">
//               <div className="flex justify-between">
//                 <h1>Subtotal</h1>
//                 <p>₦{calculateTotal().toFixed(2)}</p>
//               </div>
//               <div className="flex justify-between">
//                 <h1>Discount</h1>
//                 <p>₦0</p>
//               </div>
//             </div>
//             <div className="flex justify-between">
//               <h1 className="text-lg font-bold">Ground Total</h1>
//               <h1>₦{calculateTotal().toFixed(2)}</h1>
//             </div>
//             <button className="mt-2 w-full bg-[#f2592b] transition-all duration-400 text-white py-2 rounded-md shadow-md hover:bg-hover" onClick={() => navigate("/checkout/summary")}>
//               Checkout
//             </button>
//             {/* <button className="mt-2 w-full bg-[#f2592b] transition-all duration-400 text-white py-2 rounded-md shadow-md hover:bg-hover" onClick={() => localStorage.removeItem('cartId')}>
//               Checkout
//             </button> */}
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Cart;



// src/pages/Cart.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import TopNav from "../Components/TopNav";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { MdOutlineDeleteForever } from "react-icons/md";

// Interfaces
interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  checked?: boolean;
}

interface ProductData {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
}

interface MergedCartItem extends CartItem {
  data: ProductData;
  price: number;
}

const Cart = () => {
  const cartId = localStorage.getItem("cartId");
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [fetchedData, setFetchedData] = useState<MergedCartItem[]>([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  useEffect(() => {
    const getCart = async () => {
      try {
        const res = await axios.get(
          `https://oneworld-fq81.onrender.com/api/Cart/${cartId}`
        );
        setCartItems(res.data.items);
      } catch (err) {
        console.log(err);
      }
    };
    getCart();
  }, [cartId]);

  useEffect(() => {
    const getdatabyid = async (productId: string) => {
      try {
        const response = await axios.get(
          `https://oneworld-fq81.onrender.com/api/Product/GetProductById/${productId}`
        );
        return response.data;
      } catch (error) {
        console.error(`Error fetching data for ID ${productId}:`, error);
      }
    };

    const fetchAllData = async () => {
      if (cartItems.length > 0) {
        const result = await Promise.all(
          cartItems.map(async (item) => {
            const additionalData = await getdatabyid(item.productId);
            return {
              ...item,
              data: additionalData,
              price: additionalData?.price ?? 0,
            };
          })
        );
        setFetchedData(result);
      }
    };

    fetchAllData();
  }, [cartItems]);

  const updatedData = fetchedData.map((item, index) => ({
    ...item,
    id: index + 1, // Overwriting ID for rendering
  }));

  const handleQuantityChange = (id: number, increment: boolean) => {
    setCartItems((prevItems) =>
      prevItems.map((item, index) =>
        index + 1 === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + (increment ? 1 : -1)),
            }
          : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((_, index) => index + 1 !== id)
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item, index) => {
      const matched = fetchedData[index];
      return total + (matched?.price ?? 0) * item.quantity;
    }, 0);
  };

  const handleHeadCheckboxChange = () => {
    const newCheckState = !isAllChecked;
    setIsAllChecked(newCheckState);
    setCartItems((prevItems) =>
      prevItems.map((item) => ({ ...item, checked: newCheckState }))
    );
  };

  const handleRowCheckboxChange = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item, index) =>
        index + 1 === id ? { ...item, checked: !item.checked } : item
      )
    );
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

      <div className="rounded-md mx-auto max-w-[1100px] pt-10 flex flex-col lg:flex-row justify-between pb-10">
        <div className="border border-[#ce5733] rounded-lg lg:w-[700px] p-4">
          <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left lg:p-2">
                  <input
                    type="checkbox"
                    className="mr-4"
                    checked={isAllChecked}
                    onChange={handleHeadCheckboxChange}
                  />
                  Product
                </th>
                <th className="text-left p-2">Quantity</th>
                <th className="text-left p-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {fetchedData && fetchedData.length > 0 ? (
                updatedData.map((item) => (
                  <tr className="border-b" key={item.id}>
                    <td className="lg:pr-10">
                      <div className="flex items-center lg:p-2 lg:space-x-4">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => handleRowCheckboxChange(item.id)}
                          className="mr-2"
                        />
                        <div className="flex items-center space-x-1 lg:space-x-4">
                          <img
                            src={
                              item.data.imageUrl !== undefined
                                ? item.data.imageUrl.split(",")[1]
                                : ""
                            }
                            className="w-10 h-10"
                            alt=""
                          />
                          <div>
                            <h3 className="font-medium">{item.data.name}</h3>
                            <p className="text-[10px] text-gray-500">
                              {item.data.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-1 lg:p-2 lg:pr-10">
                      <div className="flex flex-col space-y-1 items-center">
                        <div className="border border-[#ce5733] rounded-lg px-4 py-1 flex items-center justify-between w-28">
                          <button
                            onClick={() => handleQuantityChange(item.id, false)}
                            className="text-[18px] text-gray-700"
                          >
                            -
                          </button>
                          <span className="px-2">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, true)}
                            className="text-[18px] text-gray-700"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="flex items-center text-sm text-red-500"
                        >
                          <MdOutlineDeleteForever /> <span>Remove</span>
                        </button>
                      </div>
                    </td>
                    <td className="p-2">₦{item.price.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">
                    Your cart is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border border-[#ce5733] rounded-lg lg:w-[350px] h-[230px] p-4 my-4 lg:my-0">
          <div className="space-y-4">
            <div className="border-b space-y-4 my-4">
              <div className="flex justify-between">
                <h1>Subtotal</h1>
                <p>₦{calculateTotal().toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <h1>Discount</h1>
                <p>₦0</p>
              </div>
            </div>
            <div className="flex justify-between">
              <h1 className="text-lg font-bold">Ground Total</h1>
              <h1>₦{calculateTotal().toFixed(2)}</h1>
            </div>
            <button
              className="mt-2 w-full bg-[#f2592b] transition-all duration-400 text-white py-2 rounded-md shadow-md hover:bg-hover"
              onClick={() => navigate("/checkout/summary")}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
