import { useEffect, useRef, useState } from "react";
import { FaImage, FaTimes, FaPlus } from "react-icons/fa";
import type { Product, PublishStatus } from "./AdminProduct";
import type { Category } from "../../Components/CategorySelect ";
import CategorySelect from "../../Components/CategorySelect ";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export interface ProductFormValues {
  name: string;
  categoryId: string;
  description: string;
  price: number;
  tags: string[];
  quantity: number;
  weight?: number;
  discount?: number;
  existingImages: { id: string; url: string }[];
  removedImageIds: string[];
  imageFiles: File[];
}

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues, publishStatus: PublishStatus) => Promise<void>;
  onDelete?: () => void;
  editingProduct: Product | null;
  categories: Category[];
  onAddCategory: (formData: FormData) => Promise<void> | void;
  onDeleteCategory: (id: string) => void;
  maxImages?: number;
}

const emptyForm: ProductFormValues = {
  name: "",
  categoryId: "",
  description: "",
  price: 0,
  tags: [],
  quantity: 0,
  weight: undefined,
  discount: undefined,
  existingImages: [],
  removedImageIds: [],
  imageFiles: [],
};

const AdminProductModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
  categories,
  onAddCategory,
  onDeleteCategory,
  maxImages = 6,
}: AdminProductModalProps) => {
  const [form, setForm] = useState<ProductFormValues>(emptyForm);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for category deletion
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  
  // State for product submission loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        categoryId: editingProduct.categoryId,
        description: editingProduct.description ?? "",
        price: editingProduct.price,
        tags: editingProduct.tags ?? [],
        quantity: editingProduct.quantity,
        weight: editingProduct.weight,
        discount: editingProduct.discount,
        existingImages: editingProduct.images ?? [],
        removedImageIds: [],
        imageFiles: [],
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingProduct, isOpen]);

  // Build/clean up object URLs whenever the selected files are selected
  useEffect(() => {
    const urls = form.imageFiles.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [form.imageFiles]);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const incoming = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (incoming.length === 0) return;

    setForm((prev) => {
      const remainingSlots = maxImages - (prev.existingImages.length + prev.imageFiles.length);
      if (remainingSlots <= 0) return prev;
      return { ...prev, imageFiles: [...prev.imageFiles, ...incoming].slice(0, prev.imageFiles.length + remainingSlots) };
    });

    // allow re-selecting the same file again later (e.g. after removing it)
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeNewImageAt = (index: number) => {
    setForm((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }));
  };

  const removeExistingImage = (id: string) => {
    setForm((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((img) => img.id !== id),
      removedImageIds: [...prev.removedImageIds, id],
    }));
  };

  const isValid = form.name.trim() && form.categoryId && form.price > 0;

  const handleSave = async (status: PublishStatus) => {
    if (!isValid || isSubmitting) return;
    
    console.log("handleSave called with status:", status); // Debug log
    
    setIsSubmitting(true);
    try {
      await onSubmit(form, status);
      // Modal will be closed by parent after successful submission
      console.log("Product saved successfully"); // Debug log
    } catch (error) {
      // Error handling is done in parent
      console.error("Error saving product:", error);
    } finally {
      setIsSubmitting(false);
      console.log("isSubmitting set to false"); // Debug log
    }
  };

  const totalTiles = form.existingImages.length + form.imageFiles.length;
  const canAddMore = totalTiles < maxImages;

  // Handle category delete confirmation
  const handleCategoryDeleteClick = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;
    setCategoryToDelete(category);
  };

  const handleConfirmCategoryDelete = () => {
    if (!categoryToDelete) return;
    setIsDeletingCategory(true);
    // Call the delete function
    onDeleteCategory(categoryToDelete.id);
    setIsDeletingCategory(false);
    setCategoryToDelete(null);
  };

  const handleCancelCategoryDelete = () => {
    setCategoryToDelete(null);
  };

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-130 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-[#f2592b] text-white shrink-0">
          <div>
            <h2 className="text-lg font-semibold">{editingProduct ? "Edit Product" : "Product Details"}</h2>
            <p className="text-xs text-white/80 mt-0.5">
              {editingProduct ? `Editing "${editingProduct.name}"` : "New products are saved as draft by default"}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Product Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Classic Leather Strap Wristwatch"
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <CategorySelect
              categories={categories}
              value={form.categoryId}
              onChange={(id: string) => setForm((prev) => ({ ...prev, categoryId: id }))}
              onAddCategory={onAddCategory}
              onDeleteCategory={handleCategoryDeleteClick}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Price</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">NGN</span>
              <input
                type="number"
                min="0"
                value={form.price || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-gray-200 pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Quantity in stock (optional)</label>
              <input
                type="number"
                min="0"
                value={form.quantity || ""}
                onChange={(e) => setForm((prev) => ({ ...prev, quantity: parseInt(e.target.value, 10) || 0 }))}
                placeholder="100"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Variant (optional)</label>
              <input
                type="text"
                min="0"
                value={form.weight ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, weight: e.target.value ? parseFloat(e.target.value) : undefined }))
                }
                placeholder="Enter weight"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Product Description {`( optional )`}</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the product..."
              rows={3}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b] disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Product Images</label>
            <p className="text-xs text-gray-400 -mt-1">
              Click a tile to upload an image from your device. Up to {maxImages} images, JPG/PNG recommended.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFilesSelected(e.target.files)}
              disabled={isSubmitting}
            />

            <div className="grid grid-cols-3 gap-3 mt-1">
              {/* Images already saved on the product */}
              {form.existingImages.map((img) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200"
                >
                  <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    disabled={isSubmitting}
                    className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 disabled:cursor-not-allowed"
                  >
                    <FaTimes className="text-[10px]" />
                  </button>
                </div>
              ))}

              {/* Newly selected files, with live preview */}
              {form.imageFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="relative aspect-square rounded-xl overflow-hidden group border-2 border-[#f2592b] ring-1 ring-[#f2592b]/20"
                >
                  <img src={previews[index]} alt={file.name} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImageAt(index)}
                    disabled={isSubmitting}
                    className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 disabled:cursor-not-allowed"
                  >
                    <FaTimes className="text-[10px]" />
                  </button>
                </div>
              ))}

              {/* Upload tile — visible while under the max */}
              {canAddMore && (
                <button
                  type="button"
                  onClick={openFilePicker}
                  disabled={isSubmitting}
                  className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 bg-gray-50 border-2 border-dashed border-gray-200 text-gray-400 hover:border-[#f2592b] hover:text-[#f2592b] hover:bg-[#f2592b]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-400 disabled:hover:bg-gray-50"
                >
                  {totalTiles === 0 ? (
                    <>
                      <FaImage className="text-lg" />
                      <span className="text-[11px] font-medium">Upload</span>
                    </>
                  ) : (
                    <FaPlus className="text-base" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-5 border-t border-gray-100 shrink-0">
          {/* {onDelete && (
            <button
              onClick={onDelete}
              disabled={isSubmitting}
              className="text-sm font-medium text-rose-500 hover:text-rose-600 px-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          )} */}
          {/* <div className="flex-1" />
          <button
            onClick={() => handleSave("draft")}
            disabled={!isValid || isSubmitting}
            className="rounded-xl border border-gray-200 text-gray-600 text-sm font-medium px-5 py-2.5 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
          >
            {isSubmitting ? "Saving..." : "Save as Draft"}
          </button> */}
          <button
            onClick={() => handleSave("published")}
            disabled={!isValid || isSubmitting}
            className="rounded-xl bg-[#f2592b] hover:bg-[#d94c22] text-white text-sm font-medium px-5 py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-30"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Category Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!categoryToDelete}
        title="Delete Category"
        message={
          categoryToDelete
            ? `Are you sure you want to delete the category "${categoryToDelete.name}"? This action cannot be undone.`
            : ""
        }
        isLoading={isDeletingCategory}
        onConfirm={handleConfirmCategoryDelete}
        onCancel={handleCancelCategoryDelete}
      />
    </>
  );
};

export default AdminProductModal;