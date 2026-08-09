import { useState } from "react";
import type { Address, AddressInput } from "../Types/user/address/addressType";

interface AddressFormProps {
  initialValue?: Address | null;
  onSubmit: (input: AddressInput) => Promise<void>;
  onCancel: () => void;
}

const EMPTY_FORM: AddressInput = {
  street: "",
  city: "",
  state: "",
  country: "",
};

export const AddressForm: React.FC<AddressFormProps> = ({
  initialValue,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState<AddressInput>(
    initialValue
      ? {
          street: initialValue.street,
          city: initialValue.city,
          state: initialValue.state,
          country: initialValue.country,
        }
      : EMPTY_FORM,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid =
    form.street.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.country.trim();

  const handleChange = (field: keyof AddressInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError("Could not save address. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street Address
        </label>
        <input
          type="text"
          value={form.street}
          onChange={(e) => handleChange("street", e.target.value)}
          placeholder="e.g. No 1 Adamson Street"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={form.city}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="e.g. Ikorodu"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            value={form.state}
            onChange={(e) => handleChange("state", e.target.value)}
            placeholder="e.g. Lagos State"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <input
          type="text"
          value={form.country}
          onChange={(e) => handleChange("country", e.target.value)}
          placeholder="e.g. Nigeria"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f2592b]/40 focus:border-[#f2592b]"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid || submitting}
          className="flex-1 bg-[#f2592b] text-white py-2.5 rounded-lg font-medium hover:bg-[#e04a1f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting
            ? "Saving..."
            : initialValue
              ? "Save Changes"
              : "Add Address"}
        </button>
      </div>
    </form>
  );
};
