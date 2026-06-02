import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';

import { reportApi } from '@/lib/api/report.api.ts';
import { modalStore } from '@/stores/modal.store.ts';
import { SCREENS_PATH } from '@/config/constant.ts';
import HomeHeaderContent from '@/pages/home/homeDetail/HomeHeaderContent.tsx';
import { queryKeys } from '@/lib/queryKeys.ts';
import { authStore } from '@/stores/auth.store.ts';

const HomePage = () => {
  const setProcessing = modalStore.getState().setProcessing;

  const accessToken: string | null = authStore(state => state.accessToken);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.overview.all,
    queryFn: () =>
      reportApi
        .getOverview()
        .then((response: any) => response.data)
        .catch((error: any) => error.response)
  });

  setProcessing(isLoading);

  if (data && data.status && (data.status === 403 || data.status === 404)) {
    if (accessToken) {
      return <Navigate to={SCREENS_PATH.COURSE_LIST} />;
    } else {
      return <Navigate to={SCREENS_PATH.LOGIN} />;
    }
  }

  return (
    <HomeHeaderContent data={data} />
  );
};

export default HomePage;
export { HomePage as Component };
