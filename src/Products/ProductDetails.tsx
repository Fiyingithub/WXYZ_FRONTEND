import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
// import queryString from 'query-string';

// Components
import TopNav from "../Components/TopNav";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
// import { FaStar } from "react-icons/fa";

const ProductDetails = () => {
  // Get data from query
  // const q = queryString.parse(window.location.search);
  // const { productId } = q;

  const location = useLocation();
  const productId = location.state.productId;
  const productCategory = location.state.category;
  // console.log(productCategory)

  const [product, setProduct] = useState({});
  const [imageDisplay, setImageDisplay] = useState(null);
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(`https://oneworld-fq81.onrender.com/api/Product/GetProductById/${productId}`);
        setProduct(res.data.data);
        setImageDisplay(res.data.data.imageUrl.split(",")[0]);
        console.log(res.data.data)
      } catch (err) {
        console.log(err)
      }
    }

    if(productId) {
      getProduct()
    };
  }, [productId]);

  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const colors = ["#e63946", "#b0c7a1", "#cbd5e1", "#94a3b8", "#d1d5db"];

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleAddToCart = (e) => {
    e.preventDefault();
    navigate('/cart');
    // alert('Product added to cart successfully.');
  }

  const [relatedProducts, setRelatedProducts] = useState([]);
  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await axios.get('https://oneworld-fq81.onrender.com/api/Product/GetAllProduct');
        // Filter
        const filteredProducts = res.data.filter((item) => item.category === productCategory);
        setRelatedProducts(filteredProducts)
        console.log(filteredProducts)
      } catch (err) {
        console.log(err)
      }
    }
    getAllProducts()
  }, [productCategory]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const productImages = product.imageUrl !== undefined && product !== undefined ? product.imageUrl.split(",") : null;

  const formatAmount = (amt) =>
    amt
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <div>
      <TopNav/>
      <div className="sticky top-0 z-50">
        <Navbar/>
      </div>
      <div className="min-h-screen bg-gray-50 py-10 px-4 lg:max-w-[1100px] mx-auto ">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section: Product Images */}
          <div>
            <img
              src={product.imageUrl !== undefined ? imageDisplay : `https://via.placeholder.com/500`}
              alt={product.name}
              className="w-full rounded-lg"
            />
            <div className="flex space-x-4 mt-4">
              {productImages !== null && productImages.map((item, idx) => (
                  <img
                    key={idx}
                    src={item}
                    alt="Airpods Color"
                    className="w-16 h-16 object-cover rounded-lg border"
                    onClick={() => setImageDisplay(item)}
                  />
                ))}
            </div>
          </div>

          {/* Right Section: Product Details */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-500">
              {product.description}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-green-500 font-semibold">★ ★ ★ ★ ★</span>
              <span className="text-gray-500">(121)</span>
            </div>
            <div className="text-2xl font-semibold text-gray-900">₦{product !== undefined && product.price !== undefined ? formatAmount(product.price) : null}</div>

            {/* Color Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Choose a Color
              </h3>
              <div className="flex space-x-4">
                {colors.map((color, idx) => (
                  <button
                    key={idx}
                    style={{ backgroundColor: color }}
                    className="w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  />
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={decreaseQuantity}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <span className="text-red-500 font-medium">Only {product.quantity} items left!</span>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-green-700">
                Buy Now
              </button>
              <button className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>

            {/* Delivery Information */}
            {/* <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">🚚 Free Delivery</span>
                <input
                  type="text"
                  placeholder="Enter Postal Code"
                  className="border border-gray-300 rounded px-4 py-2"
                />
              </div>
              <p className="text-sm text-gray-500">
                Free 30-days Delivery Returns.{" "}
                <Link to="#" className="text-blue-500 underline">
                  Details
                </Link>
              </p>
            </div> */}
          </div>
        </div>

        {/* Full Product Description Section */}
        {/* <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-2">
            Product Details
          </h2>
          <div className="bg-white shadow-md rounded-lg p-8">
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Experience the ultimate combination of high-fidelity audio, sleek design, and unmatched comfort with the AirPods Max. Featuring industry-leading noise cancellation, spatial audio, and luxurious materials, these headphones set a new standard in personal audio.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features:</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <span className="bg-blue-500 w-3 h-3 rounded-full mr-3"></span> 
                    High-Fidelity Audio for an immersive experience
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-500 w-3 h-3 rounded-full mr-3"></span> 
                    Active Noise Cancellation with Transparency Mode
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-500 w-3 h-3 rounded-full mr-3"></span> 
                    Crafted with premium materials for all-day comfort
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-500 w-3 h-3 rounded-full mr-3"></span> 
                    Spatial Audio with dynamic head tracking
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Specifications:</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-900">Dimensions:</span>
                    <span>7.37 x 6.64 x 3.28 inches</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-900">Weight:</span>
                    <span>384.8 grams</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-900">Battery Life:</span>
                    <span>Up to 20 hours</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-900">Connectivity:</span>
                    <span>Bluetooth 5.0</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-900">Available Colors:</span>
                    <span>Space Gray, Silver, Green, Sky Blue, Pink</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div> */}

        {/* Related Products Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Related Products</h2>
          <div className="flex space-x-4 overflow-x-scroll lg:overflow-hidden scrollbar-hide p-2 -m-2">
            {relatedProducts !== null && relatedProducts.length > 0 &&
              relatedProducts.map((product) => (
                <div
                  key={product.productId}
                  className="flex-shrink-0 w-64 border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={product === undefined && product.imageUrl === null ? null : product.imageUrl.split(",")[0]}
                    alt="Related Product"
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-medium text-gray-900">{product === undefined && product === null ? null : product.name}</h3>
                  <p className="text-sm text-gray-500">{product === undefined && product === null ? null : product.description}</p>
                  <div className="mt-2 text-xl font-semibold text-gray-900">₦{product === undefined && product === null ? null : formatAmount(product.price)}</div>
                  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
                    onClick={() => navigate(`/productdetails/?product-id=${product.productId}`, { state: product })}>
                    View Details
                  </button>
                </div>
              ))}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;