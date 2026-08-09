export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  country: string;
}

export type AddressInput = Pick<Address, "street" | "city" | "state" | "country">;

export interface AddressState {
  addresses: Address[];
  selectedAddressId: string | null;
  loading: boolean;
  error: string | null;
}