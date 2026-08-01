import { useEffect, useRef, useState } from "react";
import { FaCheck, FaChevronDown, FaPlus, FaSearch, FaTimes, FaTrashAlt } from "react-icons/fa";

export interface Category {
  id: string;
  name: string;
}

interface CategorySelectProps {
  categories: Category[];
  value: string; // selected category id
  onChange: (categoryId: string) => void;
  onAddCategory: (name: string) => Promise<void> | void;
  onDeleteCategory?: (id: string) => Promise<void> | void;
  placeholder?: string;
}

const CategorySelect = ({
  categories,
  value,
  onChange,
  onAddCategory,
  onDeleteCategory,
  placeholder = "Select category",
}: CategorySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = categories.find((c) => c.id === value);
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
    setSearch("");
  };

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    setIsSubmitting(true);
    try {
      await onAddCategory(name);
      setNewCategoryName("");
      setIsAddOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-left bg-white hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b] transition-colors"
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected ? selected.name : placeholder}
        </span>
        <FaChevronDown className={`text-xs text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-2 w-full rounded-xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search category..."
                className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#f2592b]/40"
              />
            </div>
          </div>

          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-400">No categories found</li>
            )}
            {filtered.map((category) => (
              <li key={category.id} className ="flex ">
                <button
                  type="button"
                  onClick={() => handleSelect(category.id)}
                  className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f2592b] transition-colors"
                >
                  {category.name}
                  {category.id === value && <FaCheck className="text-xs text-[#f2592b]" />}
                </button>

                {onDeleteCategory && (
                  <button
                    type="button"
                    onClick={() => onDeleteCategory(category.id)}
                    className="w-8 flex items-center justify-center text-gray-400 hover:text-gray-500"
                  >
                    <FaTrashAlt className="text-xs" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setIsAddOpen(true);
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#f2592b] border-t border-gray-100 hover:bg-orange-50 transition-colors"
          >
            <FaPlus className="text-xs" />
            Add New Category
          </button>
        </div>
      )}

      {/* Add category modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-800">Add Category</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            <label className="text-sm font-medium text-gray-700">Category Name</label>
            <input
              autoFocus
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="e.g. Electronics"
              className="w-full mt-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            />

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="flex-1 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={isSubmitting || !newCategoryName.trim()}
                className="flex-1 rounded-xl bg-[#f2592b] hover:bg-[#d94c22] text-white text-sm font-medium py-2.5 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelect;