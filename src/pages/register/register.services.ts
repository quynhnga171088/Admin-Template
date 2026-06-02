import { secureApi } from '@/lib/api/auth.api';
import { registerStore } from '@/stores/register.store';
import { modalStore } from '@/stores/modal.store';
import { SCREENS_PATH } from '@/config/constant';
import type { IAuthResponse, IRegisterForm } from '@/types/types';
import { authStore } from '@/stores/auth.store.ts';
import { queryClient } from '@/lib/queryClient.ts';
export const register = async (formData: IRegisterForm, navigate: (path: string, options?: object) => void) => {
  const { setErrorMessage } = registerStore.getState();
  const setProcessing = modalStore.getState().setProcessing;

  setErrorMessage(null);
  setProcessing(true, 'Creating your account, please wait...');

  const registerData: IRegisterForm = {
    fullName: formData.fullName,
    email: formData.email,
    phone: formData.phone,
    password: formData.password
  };

  await secureApi.teachRegister(registerData)
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

      /* Clear register store & localStorage */
      registerStore.getState().reset();

      navigate(SCREENS_PATH.HOME, { replace: true });
    })
    .catch(error => {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed. Please try again.';
      setErrorMessage(errorMessage);
      throw error;
    })
    .finally(() => {
      setProcessing(false);
    });
};
