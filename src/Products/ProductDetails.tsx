import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaMinus,
  FaPlus,
  FaShoppingBag,
  FaHeart,
  FaShare,
  FaTruck,
  FaUndo,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store";
import { addProductToCartAction } from "../store/Users/cart/cartAction";
import { CartNotificationModal } from "../Components/CartNotificationModal";

// Services
import { userProductService } from "../services/Users/product/userProductService";
import { useAuth } from "../Context/Auth/useAuth";
import { AuthPromptModal } from "../Components/AuthPromptModal";

// Types
interface ProductImage {
  id: string;
  url: string;
  productId?: string;
}

interface Category {
  id: string;
  name: string;
  createdAt?: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  quantity: number;
  status: "ACTIVE" | "DRAFT" | string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  images: ProductImage[];
}

interface RelatedProduct {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  quantity: number;
  status: string;
  categoryId: string;
  category: Category;
  images: ProductImage[];
}

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get ID from URL params
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "reviews"
  >("description");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    type: "ADD" as "ADD" | "UPDATE" | "REMOVE" | "ERROR",
    item: null as any,
    message: "",
  });

  // Colors for product variants
  const colors = [
    { name: "Space Gray", value: "#4a4a4a" },
    { name: "Silver", value: "#c0c0c0" },
    { name: "Green", value: "#4a7c59" },
    { name: "Sky Blue", value: "#87CEEB" },
    { name: "Pink", value: "#ffb6c1" },
  ];

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

  // Calculate discount
  const discountPercentage = useMemo(() => {
    if (!product?.price) return 0;
    const price =
      typeof product.price === "string"
        ? parseFloat(product.price)
        : product.price;
    return price > 50000 ? 20 : 0;
  }, [product?.price]);

  const originalPrice = useMemo(() => {
    if (!product?.price || discountPercentage === 0) return null;
    const price =
      typeof product.price === "string"
        ? parseFloat(product.price)
        : product.price;
    return price / (1 - discountPercentage / 100);
  }, [product?.price, discountPercentage]);

  // Fetch product details using the ID from URL params
  useEffect(() => {
    const getProduct = async () => {
      if (!id) {
        setError("Product ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await userProductService.getById(id);

        let productData = response.data;

        if (response.data?.products && Array.isArray(response.data.products)) {
          productData = response.data.products[0];
        } else if (response.data?.data) {
          productData = response.data.data;
        }

        setProduct(productData);

        if (productData.images && productData.images.length > 0) {
          setSelectedImage(productData.images[0].url);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]); // Re-run when ID changes

  // Fetch related products
  useEffect(() => {
    const getRelatedProducts = async () => {
      if (!product?.categoryId) return;

      try {
        const response = await userProductService.getAll();

        let allProducts: RelatedProduct[] = [];
        if (response.data?.products) {
          allProducts = response.data.products;
        } else if (Array.isArray(response.data)) {
          allProducts = response.data;
        } else if (response.data?.data) {
          allProducts = Array.isArray(response.data.data)
            ? response.data.data
            : [response.data.data];
        }

        const filtered = allProducts
          .filter(
            (item: RelatedProduct) =>
              item.categoryId === product.categoryId && item.id !== id,
          )
          .slice(0, 8);

        setRelatedProducts(filtered);
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };

    getRelatedProducts();
  }, [product?.categoryId, id]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handlers
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleImageSelect = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const handleAddToCart = async () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    if (!product || addingToCart) return;

    setAddingToCart(true);
    try {
      // NOTE: addProductToCartAction expects Types/Admin/product's `Product`
      // shape (via toCartProduct in cartAction.ts). This file's local
      // `Product` interface isn't confirmed to match it — cast for now,
      // revisit once Types/Admin/product.ts is shared.
      await dispatch(addProductToCartAction(product as any, quantity));

      setNotification({
        open: true,
        type: "ADD",
        item: {
          name: product.name,
          quantity,
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
      setAddingToCart(false);
    }
  };

  // Buy Now adds the item then heads straight to checkout.
  // (Previously this just navigated without adding anything to the cart.)
  const handleBuyNow = async () => {
    if (!user) {
      setShowAuthPrompt(true);
      return;
    }
    if (!product || addingToCart) return;
    await handleAddToCart();
    navigate("/checkout");
  };

  const handlePrevImage = () => {
    const images = getImageArray();
    if (images.length === 0) return;
    const newIndex =
      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    setSelectedImage(images[newIndex]);
    setCurrentImageIndex(newIndex);
  };

  const handleNextImage = () => {
    const images = getImageArray();
    if (images.length === 0) return;
    const newIndex =
      currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    setSelectedImage(images[newIndex]);
    setCurrentImageIndex(newIndex);
  };

  const getImageArray = (): string[] => {
    if (!product?.images || product.images.length === 0) return [];
    return product.images
      .map((img) => img.url)
      .filter((url) => url.trim() !== "");
  };

  // Render star rating
  const renderStars = (rating: number = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-sm" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-sm" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-sm" />
        ))}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            <div className="bg-gray-200 h-100 rounded-lg"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 w-3/4 rounded"></div>
              <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
              <div className="bg-gray-200 h-6 w-1/3 rounded"></div>
              <div className="bg-gray-200 h-20 w-full rounded"></div>
              <div className="bg-gray-200 h-12 w-1/2 rounded"></div>
              <div className="bg-gray-200 h-12 w-full rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">Oops!</h2>
            <p className="text-gray-700 mb-6">{error || "Product not found"}</p>
            <button
              onClick={() => navigate("/shop")}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const images = getImageArray();
  const price =
    typeof product.price === "string"
      ? parseFloat(product.price)
      : product.price;
  const isInStock = product.quantity > 0;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3 px-4">
        <div className="max-w-6xl mx-auto text-sm text-gray-600">
          <span
            className="hover:text-primary cursor-pointer"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <span className="mx-2">/</span>
          <span className="hover:text-primary cursor-pointer">
            {product.category?.name || "Category"}
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium border-b border-orange-600">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section: Product Images */}
            <div>
              <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute cursor-pointer left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors z-10"
                    >
                      <FaChevronLeft className="text-gray-700" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors z-10"
                    >
                      <FaChevronRight className="text-gray-700" />
                    </button>
                  </>
                )}
                <img
                  src={selectedImage || "https://via.placeholder.com/500"}
                  alt={product.name}
                  className="w-full h-100 object-contain"
                />
              </div>

              {/* Thumbnail Navigation */}
              {images.length > 0 && (
                <div className="flex space-x-3 mt-4 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${product.name} - ${idx + 1}`}
                      className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer transition-all shrink-0 ${
                        selectedImage === img
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      onClick={() => handleImageSelect(img, idx)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Section: Product Details */}
            <div className="space-y-5">
              {/* Product Name & Category */}
              <div>
                {product.category && (
                  <span className="text-sm text-primary font-medium uppercase tracking-wide">
                    {product.category.name}
                  </span>
                )}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-1">
                  {product.name}
                </h1>
              </div>

              {/* Rating & Stock Status */}
              <div className="flex items-center space-x-3">
                {renderStars(4.5)}
                <span className="text-sm text-gray-500">(121 reviews)</span>
                <span
                  className={`text-sm font-medium ${isInStock ? "text-green-600" : "text-red-600"}`}
                >
                  {isInStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₦{formatAmount(price)}
                </span>
                {originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ₦{formatAmount(originalPrice)}
                    </span>
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description || "No description available."}
              </p>

              {/* Color Options */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Choose a Color
                </h3>
                <div className="flex space-x-3">
                  {colors.map((color, idx) => (
                    <button
                      key={idx}
                      style={{ backgroundColor: color.value }}
                      className={`w-10 h-10 cursor-pointer rounded-full border-2 transition-all hover:scale-110 ${
                        idx === 0
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity & Stock */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={decreaseQuantity}
                    className="px-4 py-2 text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <FaMinus className="text-xs" />
                  </button>
                  <span className="px-4 py-2 text-gray-800 font-medium min-w-10 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-4 py-2 text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors"
                    disabled={quantity >= product.quantity}
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>
                {product.quantity <= 10 && (
                  <span className="text-sm text-red-500 font-medium">
                    Only {product.quantity} items left!
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleBuyNow}
                  disabled={!isInStock || addingToCart}
                  className="bg-green-600 cursor-pointer text-white px-8 py-3.5 rounded-lg hover:bg-green-700 transition-colors font-medium flex-1 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FaShoppingBag />
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock || addingToCart}
                  className="bg-gray-200 cursor-pointer text-gray-800 px-8 py-3.5 rounded-lg hover:bg-gray-300 transition-colors font-medium flex-1 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
                <button className="p-3.5 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaHeart className="text-gray-600 hover:text-red-500 transition-colors" />
                </button>
                <button className="p-3.5 border cursor-pointer border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaShare className="text-gray-600" />
                </button>
              </div>

              {/* Delivery & Returns Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <FaTruck className="text-primary text-lg" />
                  <div>
                    <p className="font-medium">Free Delivery</p>
                    <p className="text-xs text-gray-400">2-5 business days</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <FaUndo className="text-primary text-lg" />
                  <div>
                    <p className="font-medium">30-Day Returns</p>
                    <p className="text-xs text-gray-400">Hassle-free returns</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <FaShieldAlt className="text-primary text-lg" />
                  <div>
                    <p className="font-medium">Secure Payment</p>
                    <p className="text-xs text-gray-400">
                      100% secure checkout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Tabs */}
          <div className="mt-12 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === "description"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === "specifications"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === "reviews"
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews
              </button>
            </div>

            <div className="p-6">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {product.description ||
                      "No detailed description available."}
                  </p>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Category</span>
                    <span className="text-gray-600">
                      {product.category?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">
                      Quantity Available
                    </span>
                    <span className="text-gray-600">{product.quantity}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Status</span>
                    <span
                      className={`${product.status === "ACTIVE" ? "text-green-600" : "text-yellow-600"}`}
                    >
                      {product.status}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">
                      Product ID
                    </span>
                    <span className="text-gray-600 text-sm">
                      {product.id.substring(0, 8)}
                    </span>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="text-center py-8">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-2">
                      {renderStars(4.5)}
                      <span className="text-xl font-semibold text-gray-900">
                        4.5
                      </span>
                    </div>
                    <p className="text-gray-500">Based on 121 reviews</p>
                    <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Write a Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                <span>Related Products</span>
                <button
                  onClick={() =>
                    navigate(`/shop?category=${product.categoryId}`)
                  }
                  className="text-sm text-primary hover:underline font-medium"
                >
                  View All
                </button>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {relatedProducts.map((related) => {
                  const relatedImages = related.images || [];
                  return (
                    <div
                      key={related.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                      onClick={() =>
                        navigate(`/products/${related.id}`, {
                          state: {
                            productId: related.id,
                            category: related.categoryId,
                          },
                        })
                      }
                    >
                      <div className="relative overflow-hidden aspect-square">
                        <img
                          src={
                            relatedImages[0]?.url ||
                            "https://via.placeholder.com/300"
                          }
                          alt={related.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {related.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {related.description || "No description"}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">
                            ₦{formatAmount(related.price)}
                          </span>
                          <button
                            className="bg-primary text-white p-1.5 rounded-full hover:bg-green-700 transition-colors text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add to cart logic
                            }}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
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
};

export default ProductDetails;
