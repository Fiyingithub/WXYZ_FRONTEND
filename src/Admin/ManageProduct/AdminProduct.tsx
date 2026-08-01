import { useEffect, useMemo, useState } from "react";
import { FaChevronDown, FaDownload, FaPlus, FaSearch } from "react-icons/fa";
import AdminProductTable from "./AdminProductTable";
import type { ProductFormValues } from "./AdminProductModal";
import AdminProductModal from "./AdminProductModal";
import type { Category } from "../../Components/CategorySelect ";
import { productService } from "../../services/Admin/product/productService";
import { categoryService } from "../../services/Admin/product/categoryService";
import { useToast } from "../../Loaders/ToastContext";

export type PublishStatus = "draft" | "published";

/** Raw API status values. Adjust these two if your backend uses different strings. */
type ApiStatus = "ACTIVE" | "DRAFT" | string;

export interface ProductImage {
  id: string;
  url: string;
  productId?: string;
}

export interface Product {
  id: string;
  name: string;
  images: ProductImage[];
  image?: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  price: number;
  inStock: boolean;
  publishStatus: PublishStatus;
  createdAt: string;
  updatedAt?: string;
  description?: string | null;
  tags?: string[];
  weight?: number;
  discount?: number;
}

const initialCategories: Category[] = [
  { id: "cat-1", name: "Electronics" },
  { id: "cat-2", name: "Fashion & Accessories" },
  { id: "cat-3", name: "Fashion & Clothing" },
];

/** ACTIVE -> published, anything else -> draft. ASSUMPTION — confirm against your backend's enum. */
const apiStatusToPublishStatus = (status: ApiStatus): PublishStatus =>
  status === "ACTIVE" ? "published" : "draft";

const publishStatusToApiStatus = (status: PublishStatus): ApiStatus =>
  status === "published" ? "ACTIVE" : "DRAFT";

/** Maps a raw product object from the API into the shape the UI uses */
const mapApiProduct = (raw: any): Product => ({
  id: raw.id,
  name: raw.name,
  images: raw.images ?? [],
  image: raw.images?.[0]?.url,
  categoryId: raw.categoryId,
  categoryName: raw.category?.name ?? "",
  quantity: raw.quantity ?? 0,
  price:
    typeof raw.price === "string" ? parseFloat(raw.price) : (raw.price ?? 0),
  inStock: (raw.quantity ?? 0) > 0,
  publishStatus: apiStatusToPublishStatus(raw.status),
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
  description: raw.description,
  tags: raw.tags ?? [],
  weight: raw.weight,
  discount: raw.discount,
});

/** Builds the multipart form data sent to the create/update endpoints */
const buildProductFormData = (
  values: ProductFormValues,
  status: PublishStatus,
) => {
  const fd = new FormData();
  fd.append("name", values.name);
  fd.append("categoryId", values.categoryId);
  fd.append("description", values.description ?? "");
  fd.append("price", String(values.price));
  fd.append("quantity", String(values.quantity));
  fd.append("status", publishStatusToApiStatus(status));
  if (values.weight !== undefined) fd.append("weight", String(values.weight));
  if (values.discount !== undefined)
    fd.append("discount", String(values.discount));
  values.tags.forEach((tag) => fd.append("tags[]", tag));

  // ids of existing images to keep (backend can infer "delete the rest" or use removedImageIds below)
  values.existingImages.forEach((img) =>
    fd.append("existingImageIds[]", img.id),
  );
  values.removedImageIds.forEach((id) => fd.append("removedImageIds[]", id));

  // new files
  values.imageFiles.forEach((file) => fd.append("images", file));

  return fd;
};

const AdminProduct = () => {
  const { notifySuccess, notifyError, startWaitingLoader, stopWaitingLoader } =
    useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState<
    "all" | "in_stock" | "out_of_stock"
  >("all");
  const [publishFilter, setPublishFilter] = useState<"all" | PublishStatus>(
    "all",
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query || product.name.toLowerCase().includes(query);
      const matchesCategory =
        categoryFilter === "all" || product.categoryId === categoryFilter;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in_stock" ? product.inStock : !product.inStock);
      const matchesPublish =
        publishFilter === "all" || product.publishStatus === publishFilter;
      return matchesSearch && matchesCategory && matchesStock && matchesPublish;
    });
  }, [products, searchTerm, categoryFilter, stockFilter, publishFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Category

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      const categories = response.data ?? [];
      setCategories(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (formData: FormData) => {
    startWaitingLoader();
    try {
      // If you need to handle image upload, modify this part
      // For now, we'll just pass the name as before
      const res = await categoryService.create(formData);
      if (res.error === false) {
        notifySuccess(res.message);
        fetchCategories();
      }
    } catch (error) {
      notifyError("Error creating category");
    } finally {
      stopWaitingLoader();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    startWaitingLoader();
    try {
      const res = await categoryService.delete(id);
      if (res.error === false) {
        notifySuccess(res.message);
        fetchCategories();
      }
    } catch (error) {
      notifyError("Error deleting category");
    } finally {
      stopWaitingLoader();
    }
  };

  // Product

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts((response.data.products ?? []).map(mapApiProduct));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSubmitProduct = async (
    values: ProductFormValues,
    publishStatus: PublishStatus,
  ) => {
    console.log("handleSubmitProduct called with status:", publishStatus); // Debug log

    try {
      startWaitingLoader();
      const formData = buildProductFormData(values, publishStatus);
      let res = null;

      if (editingProduct) {
        res = await productService.update(editingProduct.id, formData);
      } else {
        res = await productService.create(formData);
      }

      if (res && res.error === false) {
        notifySuccess(res.message);
      }

      await fetchProducts();
      setIsModalOpen(false);
      console.log("Product submitted successfully"); // Debug log
    } catch (error) {
      console.error("Error submitting product:", error);
      notifyError(
        error instanceof Error ? error.message : "Error submitting product",
      );
      throw error; // Re-throw to let the modal know there was an error
    } finally {
      stopWaitingLoader();
      console.log("Loader stopped"); // Debug log
    }
  };

  const handleDeleteProduct = async (id: string) => {
    startWaitingLoader();
    try {
      const res = await productService.delete(id);
      if (res.error === false) {
        notifySuccess(res.message);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setIsModalOpen(false);
      }
    } catch (error) {
      notifyError("Error deleting product");
    } finally {
      stopWaitingLoader();
    }
  };

  const handleTogglePublish = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const nextStatus: PublishStatus =
      product.publishStatus === "draft" ? "published" : "draft";

    // optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, publishStatus: nextStatus } : p)),
    );

    startWaitingLoader();

    try {
      const res = await productService.updateStatus(
        id,
        publishStatusToApiStatus(nextStatus),
      );

      if (res.error === false) {
        notifySuccess(res.message);
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, publishStatus: nextStatus } : p,
          ),
        );
      }
    } catch (error) {
      notifyError("Error updating status");
      // revert on failure
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, publishStatus: product.publishStatus } : p,
        ),
      );
    } finally {
      stopWaitingLoader();
    }
  };

  const handleExport = () => {
    const header = [
      "Product",
      "Category",
      "Quantity",
      "Price",
      "Stock",
      "Status",
      "Date",
    ];
    const rows = filteredProducts.map((p) => [
      p.name,
      p.categoryName,
      p.quantity,
      p.price,
      p.inStock ? "In Stock" : "Out of Stock",
      p.publishStatus,
      p.createdAt,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="flex flex-col gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search for products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
          />
        </div>

        {/* Filters + actions */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 lg:justify-between">
          {/* Filter selects */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:items-center">
            <FilterSelect
              value={categoryFilter}
              onChange={(v) => {
                setCategoryFilter(v);
                setCurrentPage(1);
              }}
              options={[
                { label: "Categories", value: "all" },
                ...categories.map((c) => ({ label: c.name, value: c.id })),
              ]}
            />
            <FilterSelect
              value={stockFilter}
              onChange={(v) => {
                setStockFilter(v as typeof stockFilter);
                setCurrentPage(1);
              }}
              options={[
                { label: "All Status", value: "all" },
                { label: "In Stock", value: "in_stock" },
                { label: "Out of Stock", value: "out_of_stock" },
              ]}
            />
            <FilterSelect
              value={publishFilter}
              onChange={(v) => {
                setPublishFilter(v as typeof publishFilter);
                setCurrentPage(1);
              }}
              options={[
                { label: "All Published/Draft", value: "all" },
                { label: "Published", value: "published" },
                { label: "Draft", value: "draft" },
              ]}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <FaDownload className="text-xs" />
              Export
            </button>

            <button
              onClick={openAddModal}
              className="flex flex-1 sm:flex-none items-center justify-center gap-2 bg-[#f2592b] hover:bg-[#d94c22] text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              <FaPlus className="text-xs" />
              New Product
            </button>
          </div>
        </div>
      </div>

      <AdminProductTable
        products={paginatedProducts}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredProducts.length}
        pageSize={pageSize}
        onPageChange={goToPage}
        onView={openEditModal}
        onEdit={openEditModal}
        onDelete={handleDeleteProduct}
        onTogglePublish={handleTogglePublish}
      />

      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitProduct}
        onDelete={
          editingProduct
            ? () => handleDeleteProduct(editingProduct.id)
            : undefined
        }
        editingProduct={editingProduct}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
};

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

const FilterSelect = ({ value, onChange, options }: FilterSelectProps) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b] cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <FaChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
  </div>
);

export default AdminProduct;
