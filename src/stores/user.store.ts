import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type IUserState } from '@/types/types';

export const userStore = create<IUserState>()(
  persist(
    set => ({
      search: '',
      action: false,
      setAction: (action: boolean) => set({ action }),
      setSearch: (search: string) => set({ search })
    }),
    {
      name: 'user',
      partialize: (state: IUserState) => ({
        search: state.search,
        action: state.action
      })
    }
  )
);
