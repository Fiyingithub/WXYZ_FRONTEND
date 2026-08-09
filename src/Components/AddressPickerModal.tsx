import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { createAddressAction } from "../store/Users/address/addressAction";
import { selectAddress } from "../store/Users/address/addressSlice";
import { AddressForm } from "./AddressForm";
import { FaMapMarkerAlt } from "react-icons/fa";
import type { AddressInput } from "../Types/user/address/addressType";


interface AddressPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddressPickerModal: React.FC<AddressPickerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const addresses = useSelector((state: RootState) => state.getAddress.addresses);
  const selectedAddressId = useSelector(
    (state: RootState) => state.getAddress.selectedAddressId,
  );
  const [showForm, setShowForm] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (id: string) => {
    dispatch(selectAddress(id));
    onClose();
  };

  const handleCreate = async (input: AddressInput) => {
    await dispatch(createAddressAction(input));
    // newly created address is auto-selected by the upsertAddress reducer
    setShowForm(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {showForm ? "New Address" : "Choose Delivery Address"}
        </h3>

        {showForm ? (
          <AddressForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        ) : (
          <>
            <div className="space-y-2 mb-4">
              {addresses.map((address) => (
                <button
                  key={address.id}
                  onClick={() => handleSelect(address.id)}
                  className={`w-full flex items-start gap-3 text-left p-3 rounded-lg border transition-colors ${
                    address.id === selectedAddressId
                      ? "border-[#f2592b] bg-[#f2592b]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FaMapMarkerAlt className="text-[#f2592b] mt-0.5 shrink-0" />
                  <span className="text-sm">
                    <span className="block font-medium text-gray-900">
                      {address.street}
                    </span>
                    <span className="block text-gray-500">
                      {address.city}, {address.state}, {address.country}
                    </span>
                  </span>
                </button>
              ))}

              {addresses.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No saved addresses yet.
                </p>
              )}
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="w-full border border-dashed border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-medium hover:border-[#f2592b] hover:text-[#f2592b] transition-colors"
            >
              + Add New Address
            </button>
          </>
        )}
      </div>
    </div>
  );
};