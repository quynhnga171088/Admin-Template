import { authStore } from '@/stores/auth.store.ts';
import { coursesStore } from '@/stores/courses.store.ts';
import { queryClient } from '@/lib/queryClient';

export const clearAllDataWhenLogout = (): void => {
  authStore.getState().logout();
  coursesStore.getState().clearAll();
  queryClient.clear();
};
