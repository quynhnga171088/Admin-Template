import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { IRegisterState } from '@/types/types';

export const registerStore = create<IRegisterState>()(
  persist(
    set => ({
      phone: null,
      email: null,
      fullName: null,
      password: null,
      avatarUrl: null,
      errorMessage: null,
      confirmPassword: null,
      setPhone: (phone: string | null) => set({ phone }),
      setFullName: (fullName: string | null) => set({ fullName }),
      setEmail: (email: string | null) => set({ email }),
      setAvatarUrl: (avatarUrl: string | null) => set({ avatarUrl }),
      setPassword: (password: string | null) => set({ password }),
      setConfirmPassword: (confirmPassword: string | null) => set({ confirmPassword }),
      setErrorMessage: (errorMessage: string | null) => set({ errorMessage }),
      reset: () => set({
        phone: null,
        email: null,
        fullName: null,
        password: null,
        avatarUrl: null,
        errorMessage: null,
        confirmPassword: null
      })
    }),
    {
      name: 'register-store',
      partialize: (state: IRegisterState) => ({
        errorMessage: state.errorMessage,
        fullName: state.fullName,
        phone: state.phone,
        email: state.email,
        password: state.password,
        avatarUrl: state.avatarUrl,
        confirmPassword: state.confirmPassword
      })
    }
  )
);