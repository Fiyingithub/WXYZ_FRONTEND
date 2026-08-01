import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../Components/ProductCard";
import { userProductService } from '../../services/Users/product/userProductService';



const PREVIEW_LIMIT = 8;

const AllProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res: any = await userProductService.getAll();
        console.log("Fetched products:", res);
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
    // TODO: wire to your cart context/service
    console.log("Add to cart:", product.id);
  };

  return (
    <div className="w-full flex justify-center my-8 px-2">
      <div className="w-full max-w-275">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold opacity-85">All Products</h2>
            <p className="text-sm text-gray-400 mt-0.5">Discover our latest arrivals</p>
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
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-3/4" />
            ))}
          </div>
        ) : previewProducts.length === 0 ? (
          <div className="text-center text-gray-400 py-12">No products available yet.</div>
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
  );
};

export default AllProducts;