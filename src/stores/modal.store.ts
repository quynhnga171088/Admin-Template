import { create } from 'zustand';

import { COMMON_MESSAGES } from '@/config/constant.ts';

type ModalCallback = (...args: any[]) => void;

export interface IModalState {
  open: boolean;
  title: string;
  message?: string;
  enableCancelButton: boolean;
  enableOkButton: boolean;
  callback: ModalCallback | null;
  /* Processing modal */
  isProcessing: boolean;
  processingMessage: string;
  setOpen: (value: boolean) => void;
  setTitle: (title: string) => void;
  setMessage: (message: string) => void;
  setMessageAndTitle: (message: string, title: string) => void;
  setEnableCancelButton: (enableCancelButton: boolean) => void;
  setEnableOkButton: (enableOkButton: boolean) => void;
  setCallback: (callback: ModalCallback | null) => void;
  setProcessing: (isProcessing: boolean, message?: string) => void;
}

export const modalStore = create<IModalState>(set => ({
  open: false,
  title: '',
  message: '',
  callback: null,
  enableCancelButton: false,
  enableOkButton: true,
  /* Processing modal */
  isProcessing: false,
  processingMessage: COMMON_MESSAGES.PLEASE_WAIT,
  setOpen: (open: boolean) => set({ open }),
  setTitle: (title: string) => set({ title }),
  setMessage: (message: string) => set({ message }),
  setMessageAndTitle: (message: string, title: string) => set({ message, title }),
  setEnableCancelButton: (enableCancelButton: boolean) => set({ enableCancelButton }),
  setEnableOkButton: (enableOkButton: boolean) => set({ enableOkButton }),
  setCallback: (callback: ModalCallback | null) => set({ callback }),
  setProcessing: (isProcessing: boolean, message = COMMON_MESSAGES.PLEASE_WAIT) => set({ isProcessing, processingMessage: message })
}));

