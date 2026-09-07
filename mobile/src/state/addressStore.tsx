import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from './storage';

interface AddressType {
  receiverName: string;
  receiverPhoneNumber: string;
  label: 'Home' | 'Work' | 'Other';
  flatNumber?: string;
  floor: string;
  street: string;
  street1?: 'string';
  landmark?: 'string';
  city: 'string';
  state: 'string';
  postalCode: 'string';
  country?: 'string';
  latitude: number;
  longitude: number;
  placeId?: 'string';
  isDefault: boolean;
}

interface AddressStoreType {
  addresses: AddressType[];
  currentAddress: AddressType | null;
  setCurrentAddress: (address: AddressType) => void;
}

export const useAddressStore = create<AddressStoreType>()(
  persist(
    (set, get) => ({
      addresses: [],
      currentAddress: null,
      setCurrentAddress: (address: AddressType) => {
        set({
          currentAddress: address,
        });
      },
    }),
    {
      name: 'address-store',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
