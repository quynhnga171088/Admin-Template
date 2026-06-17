import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { useOverviewQuery } from '@/lib/queries/overview.queries';
import { modalStore } from '@/stores/modal.store.ts';
import { SCREENS_PATH } from '@/config/constant.ts';
import HomeHeaderContent from '@/pages/home/homeDetail/HomeHeaderContent.tsx';
import { authStore } from '@/stores/auth.store.ts';

const HomePage = () => {
  const setProcessing = modalStore(state => state.setProcessing);
  const user = authStore(state => state.user);
  const isAdmin = user?.role === 'ADMIN';

  const { data, isLoading } = useOverviewQuery(isAdmin);

  useEffect(() => {
    setProcessing(isLoading);
  }, [isLoading, setProcessing]);

  if (!isAdmin) {
    return <Navigate to={SCREENS_PATH.COURSE_LIST} />;
  }

  return (
    <HomeHeaderContent data={data} />
  );
};

export default HomePage;
export { HomePage as Component };
