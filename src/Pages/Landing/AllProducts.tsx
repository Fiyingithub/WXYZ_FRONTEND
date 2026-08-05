import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../Components/ProductCard";
import { userProductService } from "../../services/Users/product/userProductService";
import { CartNotificationModal } from "../../Components/CartNotificationModal";
import { useCart } from "../../Context/cart/useCart";



const PREVIEW_LIMIT = 8;

const AllProducts = () => {
  const navigate = useNavigate();
  const { dispatch } = useCart();

  const [notification, setNotification] = useState({
    open: false,
    type: "ADD" as "ADD",
    item: undefined as any,
  });
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res: any = await userProductService.getAll();
        // console.log("Fetched products:", res);
        setProducts(res.products.filter((p: any) => p.status === "ACTIVE"));
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const previewProducts = products.slice(0, PREVIEW_LIMIT);

  const handleViewProduct = (product: any) => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: `cart_${Date.now()}_${product.id}`,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      image:
        product.images?.[0]?.url ??
        "https://res.cloudinary.com/dx99hljwc/image/upload/v1785579785/wxyz/1785579782019_wxyz_logo.png",
      category: product.category?.name ?? "Uncategorized",
      maxStock: product.quantity || 1,
    };

    dispatch({
      type: "ADD_ITEM",
      payload: cartItem,
    });

    setNotification({
      open: true,
      type: "ADD",
      item: cartItem,
    });
  };
  return (
    <>
      <div className="w-full flex justify-center my-8 px-2">
        <div className="w-full max-w-275">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-semibold opacity-85">All Products</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                Discover our latest arrivals
              </p>
            </div>
            {/* <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-1.5 text-sm font-medium text-[#f2592b] hover:gap-2.5 transition-all"
          >
            View All
            <FaArrowRight className="text-xs" />
          </button> */}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: PREVIEW_LIMIT }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-gray-100 animate-pulse aspect-3/4"
                />
              ))}
            </div>
          ) : previewProducts.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No products available yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {previewProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={handleViewProduct}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <CartNotificationModal
        isOpen={notification.open}
        onClose={() =>
          setNotification((prev) => ({
            ...prev,
            open: false,
          }))
        }
        type={notification.type}
        item={notification.item}
      />
    </>
  );
};

export default AllProducts;
