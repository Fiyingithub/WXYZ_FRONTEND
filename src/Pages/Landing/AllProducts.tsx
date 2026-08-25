import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../Components/ProductCard";
import { userProductService } from "../../services/Users/product/userProductService";
import { CartNotificationModal } from "../../Components/CartNotificationModal";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { fetchProductFailure,fetchProductStart,fetchProductSuccess } from "../../store/Users/products/productSlice";
import { addProductToCartAction } from "../../store/Users/cart/cartAction";
import type { Product } from "../../Types/Admin/product";
import { useAuth } from "../../Context/Auth/useAuth";
import { AuthPromptModal } from "../../Components/AuthPromptModal";

const PREVIEW_LIMIT = 8;

const AllProducts = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    type: "ADD" as "ADD" | "ERROR",
    item: undefined as any,
    message: "",
  });

  // tracks which product id is currently being added, so we can
  // disable/spin just that card instead of a global loading flag
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const fetchedRecord = useSelector(
    (state: RootState) => state.getProduct.listRecords,
  ) || [];

  const fetchedLoading = useSelector(
    (state: RootState) => state.getProduct.loading,
  );
  const error = useSelector((state: RootState) => state.getProduct.error);

  useEffect(() => {
    if (!fetchedLoading) fetchProduct();
  }, [dispatch]);

  const fetchProduct = async () => {
    dispatch(fetchProductStart());
    try {
      const data = await userProductService.getAllActiveProduct();
      dispatch(fetchProductSuccess(data));
    } catch (err) {
      dispatch(fetchProductFailure((err as Error).message));
    }
  };

  const previewProducts = fetchedRecord.slice(0, PREVIEW_LIMIT);

  const handleViewProduct = (product: any) => {
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
      await dispatch(addProductToCartAction(product, 1));

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
        item: undefined,
        message: "Could not add item to cart. Please try again.",
      });
    } finally {
      setAddingProductId(null);
    }
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
          </div>

          {error ? (
            <div className="text-center text-red-400 py-12">{error}</div>
          ) : previewProducts.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              No products available yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {previewProducts.map((product) => (
                <ProductCard
                  key={product?.id}
                  product={product}
                  onClick={handleViewProduct}
                  onAddToCart={handleAddToCart}
                  isAddingToCart={addingProductId === product.id}
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
        message={notification.message}
      />

      <AuthPromptModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        message="Sign in to proceed to checkout."
      />
    </>
  );
};

export default AllProducts;
