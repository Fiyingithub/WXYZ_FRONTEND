import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMapMarkerAlt, FaPen, FaTrash, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import {
  getAddressesAction,
  createAddressAction,
  updateAddressAction,
  deleteAddressAction,
} from "../../store/Users/address/addressAction";
import { AddressForm } from "../../Components/AddressForm";
import type { Address, AddressInput } from "../../Types/user/address/addressType";


type ViewMode = { mode: "list" } | { mode: "create" } | { mode: "edit"; address: Address };

const AddressBook = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const addresses = useSelector((state: RootState) => state.getAddress.addresses);
  const loading = useSelector((state: RootState) => state.getAddress.loading);
  const selectedAddressId = useSelector(
    (state: RootState) => state.getAddress.selectedAddressId,
  );

  const [view, setView] = useState<ViewMode>({ mode: "list" });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getAddressesAction());
  }, [dispatch]);

  const handleCreate = async (input: AddressInput) => {
    await dispatch(createAddressAction(input));
    setView({ mode: "list" });
  };

  const handleUpdate = async (input: AddressInput) => {
    if (view.mode !== "edit") return;
    await dispatch(updateAddressAction(view.address.id, input));
    setView({ mode: "list" });
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await dispatch(deleteAddressAction(id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-[#f2592b] transition-colors mb-6"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Saved Addresses</h1>
        {view.mode === "list" && (
          <button
            onClick={() => setView({ mode: "create" })}
            className="flex items-center gap-2 bg-[#f2592b] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e04a1f] transition-colors"
          >
            <FaPlus className="text-xs" /> Add New
          </button>
        )}
      </div>

      {view.mode === "create" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold mb-4">New Address</h2>
          <AddressForm onSubmit={handleCreate} onCancel={() => setView({ mode: "list" })} />
        </div>
      )}

      {view.mode === "edit" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold mb-4">Edit Address</h2>
          <AddressForm
            initialValue={view.address}
            onSubmit={handleUpdate}
            onCancel={() => setView({ mode: "list" })}
          />
        </div>
      )}

      {view.mode === "list" && (
        <>
          {loading && addresses.length === 0 ? (
            <p className="text-gray-400 text-center py-12">Loading addresses...</p>
          ) : addresses.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <FaMapMarkerAlt className="text-3xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">You haven't saved any addresses yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`flex items-start justify-between gap-4 p-4 bg-white rounded-xl border transition-colors ${
                    address.id === selectedAddressId
                      ? "border-[#f2592b] ring-1 ring-[#f2592b]/20"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex gap-3">
                    <FaMapMarkerAlt className="text-[#f2592b] mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{address.street}</p>
                      <p className="text-sm text-gray-500">
                        {address.city}, {address.state}, {address.country}
                      </p>
                      {address.id === selectedAddressId && (
                        <span className="inline-block mt-1 text-xs font-medium text-[#f2592b] bg-[#f2592b]/10 px-2 py-0.5 rounded-full">
                          Selected for checkout
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setView({ mode: "edit", address })}
                      aria-label="Edit address"
                      className="p-2 text-gray-500 hover:text-[#f2592b] hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <FaPen className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      disabled={deletingId === address.id}
                      aria-label="Delete address"
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddressBook;