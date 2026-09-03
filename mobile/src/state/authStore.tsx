import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage, storage } from './storage';

// interface authStore {
//     user:Record<string, any> | null;
//     setUser:(user:any)=> void;
//     currentOrder:Record<string, any>|null;
//     setCurrentOrder:(order:any)=> void;
//     logout:()=> void;
// }

interface AuthStore {
  user: Record<string, any> | null;
  setUser: (user: Record<string, any>) => void;

  currentOrder: Record<string, any> | null;
  setCurrentOrder: (order: Record<string, any> | null) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      currentOrder: null,
      setCurrentOrder: order => set({ currentOrder: order }),
      setUser: data => set({ user: data }),
      logout: () => set({ user: null, currentOrder: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
