import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Address, AddressState } from "../../../Types/user/address/addressType";


const initialState: AddressState = {
  addresses: [],
  selectedAddressId: null,
  loading: false,
  error: null,
};

export const addressSlice = createSlice({
  name: "address",
  initialState,

      reducers: {
            fetchAddressStart(state) {
                  state.loading = true;
                  state.error = null;
            },

            fetchAddressFailure(state, action: PayloadAction<string>) {
                  state.loading = false;
                  state.error = action.payload;
            },

            setAddresses(state, action: PayloadAction<Address[]>) {
                  state.loading = false;
                  state.addresses = action.payload;

                  // No isDefault flag from the backend, so fall back to "most
                  // recently added" (last in the list) if nothing is selected yet,
                  // or if the previously selected address no longer exists.
                  const stillExists = state.addresses.some(
                  (a: any) => a.id === state.selectedAddressId,
                  );
                  if (!stillExists) {
                  state.selectedAddressId =
                  state.addresses.length > 0
                        ? state.addresses[state.addresses.length - 1].id
                        : null;
                  }
            },

            upsertAddress(state, action: PayloadAction<Address>) {
                  state.loading = false;
                  const existingIndex = state.addresses.findIndex(
                  (a: any) => a.id === action.payload.id,
                  );

                  if (existingIndex !== -1) {
                  state.addresses[existingIndex] = action.payload;
                  } else {
                  state.addresses.push(action.payload);
                  // auto-select a newly created address
                  state.selectedAddressId = action.payload.id;
                  }
            },

            removeAddress(state, action: PayloadAction<string>) {
                  state.loading = false;
                  state.addresses = state.addresses.filter((a: any) => a.id !== action.payload);

                  if (state.selectedAddressId === action.payload) {
                  state.selectedAddressId =
                  state.addresses.length > 0
                        ? state.addresses[state.addresses.length - 1].id
                        : null;
                  }
            },

            selectAddress(state, action: PayloadAction<string>) {
                  state.selectedAddressId = action.payload;
            },

            resetAddressState() {
                  return initialState;
            },
      },
});

export const { fetchAddressStart,fetchAddressFailure,setAddresses,upsertAddress,removeAddress,selectAddress,resetAddressState } = addressSlice.actions;

export default addressSlice.reducer;