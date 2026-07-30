import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../../Loaders/ToastContext";
import WaitingLoader from "../../Loaders/WaitingLoader";

import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdOutlineClose } from "react-icons/md";
import type { Product } from "../../Types/Product";

const mockProducts: Product[] = [
  {
    productId: "1",
    name: "Oversized Hoodie",
    description:
      "Soft fleece hoodie with a relaxed, oversized fit for everyday comfort.",
    price: 25000,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
    category: "Hoodies",
  },
  {
    productId: "2",
    name: "Classic White Tee",
    description: "Premium cotton t-shirt with a clean, minimal fit.",
    price: 12000,
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    category: "T-Shirts",
  },
  {
    productId: "3",
    name: "Denim Jacket",
    description: "Vintage-washed denim jacket with a slightly cropped cut.",
    price: 38000,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    category: "Jackets",
  },
  {
    productId: "4",
    name: "Slim Fit Jeans",
    description: "Stretch denim jeans with a modern slim silhouette.",
    price: 29000,
    imageUrl:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
    category: "Jeans",
  },
  {
    productId: "5",
    name: "Canvas Sneakers",
    description: "Everyday low-top sneakers with a durable canvas upper.",
    price: 21000,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    category: "Sneakers",
  },
  {
    productId: "6",
    name: "Leather Belt",
    description: "Genuine leather belt with a matte buckle finish.",
    price: 9000,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    category: "Accessories",
  },
  {
    productId: "7",
    name: "Cotton T-Shirt",
    description: "Soft cotton t-shirt with a classic fit.",
    price: 8000,
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    category: "T-Shirts",
  },

  {
    productId: "8",
    name: "Hooded Sweatshirt",
    description: "Warm hooded sweatshirt with a relaxed fit.",
    price: 18000,
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    category: "Hoodies",
  }
] as Product[];

const AllProducts: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useToast();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  console.log(allProducts);
  const [loading, setLoading] = useState<boolean>(true);
  const [addToCartAlertModal, setAddToCartAlertModal] =
    useState<boolean>(false);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await axios.get<Product[]>(
          "https://oneworld-fq81.onrender.com/api/Product/GetAllProduct",
        );
        setAllProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getAllProducts();
  }, []);

  const handleAddToCart = (item: Product) => {
    setAddToCartAlertModal(true);
    const sendToApi = {
      productId: item.productId,
      quantity: 1,
      price: item.price,
    };
    console.log(sendToApi);
    addToCart(sendToApi);
  };

  const getImageSrc = (url: string | null) => {
    if (!url) return "";
    const parts = url.split(",");
    return parts.length > 1 ? parts[1] : parts[0];
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);

  if (loading) return <WaitingLoader />;

  return (
    <div className="flex justify-center">
      <div className="flex flex-col mx-5 md:mx-10 lg:max-w-275 py-10 bg-white">
        <p className="text-2xl font-semibold my-5 opacity-85">All Categories</p>
        <div className="flex justify-between flex-col flex-wrap gap-10 sm:flex-row mx-4 sm:mx-0">
          {mockProducts.map((item) => (
            <div
              key={item.productId}
              className="group md:w-56 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all duration-500 ease-in-out"
            >
              <div className="w-full h-52 flex items-center justify-center bg-[#fff9f8] rounded-t-2xl relative overflow-hidden">
                <img
                  src={getImageSrc(item.imageUrl)}
                  alt={item.name}
                  className="w-[70%] lg:w-[85%] object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                />
              </div>

              <div className="flex flex-col justify-between px-3 py-4 gap-3">
                <div className="flex justify-between items-start gap-2">
                  <h1 className="font-semibold text-sm leading-tight">
                    {item.name}
                  </h1>
                  <p className="font-semibold text-sm whitespace-nowrap">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex gap-2 pt-1">
                  <button
                    className="flex-1 border border-[#f2592b] text-[#f2592b] py-1.5 rounded-full text-sm font-medium hover:bg-[#f2592b] hover:text-white transition-colors duration-300"
                    onClick={() =>
                      navigate(`/productdetails/?productId=${item.productId}`, {
                        state: item,
                      })
                    }
                    aria-label={`View ${item.name}`}
                  >
                    View
                  </button>
                  <button
                    className="flex-1 bg-linear-to-br from-[#f2592b] to-[orange] text-white py-1.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity duration-300"
                    onClick={() => handleAddToCart(item)}
                    aria-label={`Add ${item.name} to cart`}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {addToCartAlertModal && (
        <div
          className="fixed p-4 z-50 flex items-center justify-center left-0 top-0 w-full h-full bg-[#00000066]"
          onClick={() => setAddToCartAlertModal(false)}
        >
          <div
            className="bg-white py-14 px-4 lg:p-20 rounded-xl space-y-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center">
              <IoIosCheckmarkCircle className="text-xl lg:text-2xl text-green-500" />
              <span className="text-[11px] lg:text-[14px] ml-2">
                Product added to cart. Continue to cart?
              </span>
            </div>
            <div className="space-x-4">
              <button
                className="bg-yellow-400 rounded-md px-4 py-1 text-[11px] lg:text-[14px]"
                onClick={() => navigate("/cart")}
              >
                Yes
              </button>
              <button
                className="bg-[#f2592b] rounded-md px-4 py-1 text-white text-[11px] lg:text-[14px]"
                onClick={() => setAddToCartAlertModal(false)}
              >
                Add more items
              </button>
            </div>
            <MdOutlineClose
              className="cursor-pointer text-xl lg:text-2xl absolute right-4 top-1"
              onClick={() => setAddToCartAlertModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
