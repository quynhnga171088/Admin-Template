import {
  type IAuthForm,
  type IAuthResponse
} from '@/types/types';
import { secureApi } from '@/lib/api/auth.api.ts';
import { authStore } from '@/stores/auth.store';
import { modalStore } from '@/stores/modal.store.ts';
import { SCREENS_PATH } from '@/config/constant.ts';
import { queryClient } from '@/lib/queryClient.ts';

export const login = async (formLogin: IAuthForm, navigate: any) => {
  const { setErrorMessage, setRefreshToken, setAccessToken } = authStore.getState();
  const setProcessing = modalStore.getState().setProcessing;
  setErrorMessage(null);
  setProcessing(true, 'Please wait while we log you in...');
  await secureApi.login(formLogin)
    .then(async response => {

      const result: IAuthResponse = response.data;
      if (result && result.refreshToken && result.accessToken && result.user) {
        authStore.getState().setAccessToken(result.accessToken);
        authStore.getState().setRefreshToken(result.refreshToken);
        authStore.getState().setAuthentication(true);

        authStore.getState().setUser(result.user);
      }
      /* Reset all cache data */
      await queryClient.invalidateQueries({ queryKey: ['overview'] });

      navigate(SCREENS_PATH.HOME, { replace: true });
    })
    .catch(error => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed. Please try again.';
      setErrorMessage(errorMessage);
      setRefreshToken(null);
      setAccessToken(null);
    })
    .finally(() => {
      setProcessing(false);
    });
};
