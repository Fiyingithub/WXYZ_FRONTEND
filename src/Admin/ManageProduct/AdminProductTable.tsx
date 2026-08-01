import { useState } from "react";
import type { Product } from "./AdminProduct";
import Pagination from "../../Components/Pagination";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { formatDateParts } from "../../utils/formatDate";

interface AdminProductTableProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string) => void;
}

const getHue = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++)
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
};

const formatPrice = (price: number) => `₦${price.toLocaleString("en-NG")}`;

const AdminProductTable = ({
  products,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onTogglePublish,
}: AdminProductTableProps) => {
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    // onDelete is expected to be synchronous local state today; the awaited
    // shape here just keeps this ready for when it becomes an API call.
    await Promise.resolve(onDelete(productToDelete.id));
    setIsDeleting(false);
    setProductToDelete(null);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wide">
              <th className="pl-6 py-4 w-50 font-bold">Product</th>
              <th className="pl-6 py-4 w-50 font-bold">Category</th>
              <th className="pl-6 py-4 w-50 font-bold">Quantity</th>
              <th className="pl-6 py-4 w-50 font-bold">Date</th>
              <th className="pl-6 py-4 w-50 font-bold">Price</th>
              <th className="pl-6 py-4 w-50 font-bold">Status</th>
              <th className="pl-6 py-4 w-50 font-bold">Publish/Draft</th>
              <th className="px-8 py-4 w-50 font-bold text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="pl-4 py-4 ">
                  <div className="flex items-center gap-3 sm:w-45">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                      style={{
                        backgroundColor: `hsl(${getHue(product.name)}, 65%, 55%)`,
                      }}
                    >
                      {product.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-800">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="pl-6 py-4 w-28 text-gray-600 ">
                  {product.categoryName}
                </td>
                <td className="pl-6 py-4 w-50 text-gray-600">
                  {product.quantity}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {(() => {
                    const { date, time } = formatDateParts(product.createdAt);
                    return (
                      <div className="flex flex-col items-start leading-tight">
                        <span className="font-medium">{date}</span>
                        <span className="text-xs text-gray-400 ml-4">at</span>
                        <span>{time}</span>
                      </div>
                    );
                  })()}
                </td>
                <td className="pl-6 py-4 w-50 text-gray-600 whitespace-nowrap">
                  {formatPrice(product.price)}
                </td>
                <td className="pl-6 py-4 w-64">
                  <span
                    className={`text-xs font-medium ${product.inStock ? "text-emerald-600" : "text-rose-500"}`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td className="pl-6 py-4 w-12">
                  <button
                    onClick={() => onTogglePublish(product.id)}
                    className={`text-xs font-medium hover:underline ${
                      product.publishStatus === "published"
                        ? "text-teal-600"
                        : "text-blue-500"
                    }`}
                  >
                    {product.publishStatus === "published"
                      ? "Published"
                      : "Draft"}
                  </button>
                </td>
                <td className="px-8 py-4 w-50">
                  <div className="flex items-center justify-end gap-3 text-gray-400">
                    <button
                      onClick={() => onView(product)}
                      className="hover:text-blue-700 transition-colors text-xl"
                      aria-label="View"
                      title="View"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => onEdit(product)}
                      className="hover:text-green-700 transition-colors text-xl"
                      aria-label="Edit"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setProductToDelete(product)}
                      className="hover:text-rose-500 transition-colors text-xl"
                      aria-label="Delete"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="pl-6 py-1 w-502 text-center text-gray-400"
                >
                  No products match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />

      <ConfirmDeleteModal
        isOpen={!!productToDelete}
        title="Delete Product"
        message={
          productToDelete
            ? `Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`
            : ""
        }
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
};

export default AdminProductTable;