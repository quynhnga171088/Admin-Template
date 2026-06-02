import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { IAdminUser, IAuthState } from '@/types/types';

export const authStore = create<IAuthState>()(
  persist(
    set => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      errorMessage: null,
      isAuthenticated: false,
      logout: () => set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
      setUser: (user: IAdminUser | null) => set({ user }),
      setAuth: (user: IAdminUser, accessToken: string, refreshToken) => set({ user, accessToken, refreshToken, isAuthenticated: true, errorMessage: null }),
      setAccessToken: (token: string | null) => set({ accessToken: token }),
      setAuthentication: (isAuthenticated: boolean) => set({ isAuthenticated }),
      setErrorMessage: (errorMessage: string | null) => set({ errorMessage, isAuthenticated: false }),
      setRefreshToken: (refreshToken: string | null) => set({ refreshToken })
    }),
    {
      name: 'auth-store',
      partialize: (state: IAuthState) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
