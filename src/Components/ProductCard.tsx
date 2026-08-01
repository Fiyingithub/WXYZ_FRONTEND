import { FaShoppingCart } from "react-icons/fa";

export interface LandingProduct {
  id: string;
  name: string;
  price: string;
  quantity: number;
  status: "ACTIVE" | "DRAFT";
  category: { id: string; name: string };
  images: { id: string; url: string }[];
}

interface ProductCardProps {
  product: LandingProduct;
  onClick: (product: LandingProduct) => void;
  onAddToCart?: (product: LandingProduct) => void;
}

const formatPrice = (price: string) => `₦${Number(price).toLocaleString("en-NG")}`;

const ProductCard = ({ product, onClick, onAddToCart }: ProductCardProps) => {
  const image = product.images?.[0]?.url;
  const inStock = product.quantity > 0;
  

  return (
    <div
      onClick={() => onClick(product)}
      className="group cursor-pointer rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <img
            src="https://res.cloudinary.com/dx99hljwc/image/upload/v1785579785/wxyz/1785579782019_wxyz_logo.png"
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {!inStock && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
            Out of Stock
          </span>
        )}

        {onAddToCart && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={!inStock}
            aria-label="Add to cart"
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#f2592b]  hover:bg-[#f2592b] hover:text-white"
          >
            <FaShoppingCart className="text-sm" />
          </button>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1">
        <span className="text-xs text-gray-400">{product.category?.name}</span>
        <h3 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-base font-bold text-[#f2592b] mt-1">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
};

export default ProductCard;