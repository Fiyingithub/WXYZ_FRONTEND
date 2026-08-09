import type { AppDispatch } from "../../store";
import { userAddressService } from "../../../services/Users/address/userAddressService";
import { fetchAddressStart,fetchAddressFailure,setAddresses,upsertAddress,removeAddress } from "./addressSlice";
import type { AddressInput } from "../../../Types/user/address/addressType";


export const getAddressesAction = () => async (dispatch: AppDispatch) => {
      dispatch(fetchAddressStart());

      try {
            const addresses = await userAddressService.getAll();
            dispatch(setAddresses(addresses));
      } catch (error: any) {
            dispatch(fetchAddressFailure(error.message));
      }
};

export const createAddressAction = (input: AddressInput) => async (dispatch: AppDispatch) => {
      dispatch(fetchAddressStart());

      try {
            const address = await userAddressService.create(input);
            dispatch(upsertAddress(address));
            return address;
      } catch (error: any) {
            dispatch(fetchAddressFailure(error.message));
            throw error;
      }
};

export const updateAddressAction = (id: string, input: AddressInput) => async (dispatch: AppDispatch) => {
      dispatch(fetchAddressStart());

      try {
            const address = await userAddressService.update(id, input);
            dispatch(upsertAddress(address));
            return address;
      } catch (error: any) {
            dispatch(fetchAddressFailure(error.message));
            throw error;
      }
};

export const deleteAddressAction = (id: string) => async (dispatch: AppDispatch) => {
      dispatch(fetchAddressStart());

      try {
            await userAddressService.remove(id);
            dispatch(removeAddress(id));
      } catch (error: any) {
            dispatch(fetchAddressFailure(error.message));
            throw error;
      }
};