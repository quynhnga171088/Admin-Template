import { create } from 'zustand';

export interface ISidebarState {
  isDashboardDrawerOpened: boolean;
  setDrawerOpen: (value: boolean) => void;
}

export const sideBarStore = create<ISidebarState>(set => ({
  isDashboardDrawerOpened: false,
  setDrawerOpen: (value: boolean) => set({ isDashboardDrawerOpened: value })
}));

export const useGetMenuMaster = () => {
  const isDashboardDrawerOpened = sideBarStore((state: ISidebarState) => state.isDashboardDrawerOpened);
  return {
    menuMaster: { isDashboardDrawerOpened },
    menuMasterLoading: false
  };
};

/**
 * @param {boolean} isDashboardDrawerOpened
 */
export const handlerDrawerOpen = (isDashboardDrawerOpened: boolean) => {
  sideBarStore.getState().setDrawerOpen(isDashboardDrawerOpened);
};
