import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { useOverviewQuery } from '@/lib/queries/overview.queries';
import { modalStore } from '@/stores/modal.store.ts';
import { SCREENS_PATH } from '@/config/constant.ts';
import HomeHeaderContent from '@/pages/home/homeDetail/HomeHeaderContent.tsx';
import { authStore } from '@/stores/auth.store.ts';

const HomePage = () => {
  const setProcessing = modalStore(state => state.setProcessing);
  const accessToken: string | null = authStore(state => state.accessToken);

  const { data, isLoading } = useOverviewQuery();

  useEffect(() => {
    setProcessing(isLoading);
  }, [isLoading, setProcessing]);

  if (data && (data as any).status && ((data as any).status === 403 || (data as any).status === 404)) {
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
