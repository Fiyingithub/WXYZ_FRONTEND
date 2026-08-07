import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { userProductService } from "../services/Users/product/userProductService";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { addProductToCartAction } from "../store/Users/cart/cartAction";
import { CartNotificationModal } from "../Components/CartNotificationModal";
import ProductCard from "../Components/ProductCard";
import { AuthPromptModal } from "../Components/AuthPromptModal";
import { useAuth } from "../Context/Auth/useAuth";

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

interface Category {
  id: string;
  name: string;
}

function SortedProductDisplay() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoryId"); // Get categoryId from query params
  const { user } = useAuth();
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryId || "all",
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("Newest");
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    open: false,
    type: "ADD" as "ADD" | "UPDATE" | "REMOVE" | "ERROR",
    item: null as any,
    message: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch categories (if you have a category service)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await userProductService.getAll();
        const allProducts = response.data?.products || response.data || [];
        const uniqueCategories = allProducts
          .filter((p: any) => p.category)
          .reduce((acc: any[], curr: any) => {
            if (!acc.find((c) => c.id === curr.category.id)) {
              acc.push(curr.category);
            }
            return acc;
          }, []);
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products based on categoryId from query params
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let response;

        // If categoryId is provided and not "all", fetch by category
        if (categoryId && categoryId !== "all") {
          response = await userProductService.getByCategoryId(categoryId);
        } else {
          // Fetch all products
          response = await userProductService.getAll();
        }

        // Extract products from response - handle different response structures
        let allProducts: Product[] = [];

        if (response) {
          // Check if response has a data property
          const data = response.data || response;

          // Check if data has a products array (your getAll response)
          if (data.products && Array.isArray(data.products)) {
            allProducts = data.products;
          }
          // Check if data itself is an array (your getByCategoryId response)
          else if (Array.isArray(data)) {
            allProducts = data;
          }
          // Check if data is a single product object
          else if (data.id) {
            allProducts = [data];
          }
          // Fallback: check if response itself has products
          else if (response.products && Array.isArray(response.products)) {
            allProducts = response.products;
          }
        }

        // Filter by status
        const activeProducts = allProducts.filter(
          (product) => product.status === "ACTIVE",
        );

        setProducts(activeProducts);
        setSelectedCategory(categoryId || "all");
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

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
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    if (addingProductId === product.id) return;

    setAddingProductId(product.id);
    try {
      // NOTE: addProductToCartAction expects Types/Admin/product's `Product`
      // shape (see toCartProduct in cartAction.ts). This file's local
      // `Product` interface may not structurally match it (e.g. `category`
      // object vs `categoryId`) — revisit once Types/Admin/product.ts is
      // confirmed, may need a small mapper here too.
      await dispatch(addProductToCartAction(product as any, 1));

      setNotification({
        open: true,
        type: "ADD",
        item: {
          name: product.name,
          quantity: 1,
          price:
            typeof product.price === "string"
              ? parseFloat(product.price)
              : product.price,
          image: product.images?.[0]?.url,
        },
        message: `${product.name} added to cart!`,
      });
    } catch (err) {
      setNotification({
        open: true,
        type: "ERROR",
        item: null,
        message: "Could not add item to cart. Please try again.",
      });
    } finally {
      setAddingProductId(null);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      navigate("/products");
    } else {
      // Navigate with query parameter
      navigate(`/products?categoryId=${categoryId}`);
    }
  };

  // Get category display name
  const getCategoryDisplayName = () => {
    if (categoryId && categoryId !== "all") {
      const category = categories.find((c) => c.id === categoryId);
      return category?.name || "Category Products";
    }
    return "All Products";
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
              className="bg-[#f2592b] text-white px-6 py-2 rounded-lg hover:bg-[#e04a1f] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with category name and sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {getCategoryDisplayName()}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {sortedProducts.length} product
              {sortedProducts.length === 1 ? "" : "s"} found
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b] cursor-pointer min-w-35"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b] cursor-pointer min-w-40"
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
              <ProductCard
                key={product.id}
                product={product as any}
                onClick={() => handleViewProduct(product)}
                onAddToCart={() => handleAddToCart(product)}
                isAddingToCart={addingProductId === product.id}
              />
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
                onClick={() => navigate("/products")}
                className="bg-[#f2592b] text-white px-6 py-2 rounded-lg hover:bg-[#e04a1f] transition-colors"
              >
                Browse All Products
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notification Modal */}
      <CartNotificationModal
        isOpen={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
        type={notification.type}
        item={notification.item}
        message={notification.message}
      />

      <AuthPromptModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        message="Sign in to proceed to cart."
      />
    </div>
  );
}

export default SortedProductDisplay;
