import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaRegHeart, FaChevronDown } from "react-icons/fa";
import { userProductService } from "../services/Users/product/userProductService";
import Footer from "../Components/Footer";
import TopNav from "../Components/TopNav";
import Navbar from "../Components/Navbar";
// import ProductCard from '../../Components/ProductCard';

// Types
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  quantity: number;
  status: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  images: Array<{
    id: string;
    url: string;
  }>;
  createdAt?: string;
}

function SortedProductDisplay() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("Newest");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await userProductService.getAll();

        // Extract products from response
        let allProducts: Product[] = [];
        if (response.data?.products) {
          allProducts = response.data.products;
        } else if (Array.isArray(response.data)) {
          allProducts = response.data;
        } else if (response.data?.data) {
          allProducts = Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data];
        }

        // Filter by category if provided
        let filteredProducts = allProducts;
        if (category) {
          filteredProducts = allProducts.filter(
            (product) =>
              product.category?.name?.toLowerCase() === category.toLowerCase(),
          );
        }

        // Only show ACTIVE products
        filteredProducts = filteredProducts.filter(
          (product) => product.status === "ACTIVE",
        );

        setProducts(filteredProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Sort products
  const getSortedProducts = () => {
    const sorted = [...products];

    switch (sortBy) {
      case "LowToHigh":
        return sorted.sort((a, b) => {
          const priceA =
            typeof a.price === "string" ? parseFloat(a.price) : a.price;
          const priceB =
            typeof b.price === "string" ? parseFloat(b.price) : b.price;
          return priceA - priceB;
        });
      case "HighToLow":
        return sorted.sort((a, b) => {
          const priceA =
            typeof a.price === "string" ? parseFloat(a.price) : a.price;
          const priceB =
            typeof b.price === "string" ? parseFloat(b.price) : b.price;
          return priceB - priceA;
        });
      case "Newest":
        return sorted.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });
      default:
        return sorted;
    }
  };

  const sortedProducts = getSortedProducts();

  // Handlers
  const handleViewProduct = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (product: Product) => {
    // Add to cart logic
    console.log("Add to cart:", product.id);
    // navigate('/cart');
  };

  // Format currency
  const formatAmount = (amt: number | string): string => {
    const num = typeof amt === "string" ? parseFloat(amt) : amt;
    return (
      num
        ?.toFixed(2)
        ?.toString()
        ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0.00"
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl aspect-3/4" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Oops!</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopNav />
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header with category name and sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {category ? `${category} Products` : "All Products"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {sortedProducts.length} product
                {sortedProducts.length === 1 ? "" : "s"} found
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                Sort by:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary cursor-pointer"
                >
                  <option value="Newest">Newest Arrivals</option>
                  <option value="Popularity">Popularity</option>
                  <option value="LowToHigh">Price: Low to High</option>
                  <option value="HighToLow">Price: High to Low</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => handleViewProduct(product)}
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={
                        product.images?.[0]?.url ||
                        "https://via.placeholder.com/300"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Wishlist logic
                      }}
                    >
                      <FaRegHeart className="text-primary" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    {product.category && (
                      <span className="text-xs text-primary font-medium">
                        {product.category.name}
                      </span>
                    )}
                    <h3 className="text-sm font-semibold text-gray-900 mt-1 truncate">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {product.description || "No description"}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        ₦{formatAmount(product.price)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-500 mb-6">
                  We couldn't find any products in this category. Try browsing
                  other categories.
                </p>
                <button
                  onClick={() => navigate("/shop")}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Browse All Products
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SortedProductDisplay;
