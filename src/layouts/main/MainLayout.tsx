import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import './MainLayout.scss';
import Sidebar from 'src/layouts/sidebar/sidebar.tsx';
import Header from '@/layouts/header/Header.tsx';
import Footer from '@/layouts/footer/Footer.tsx';
import Breadcrumbs from '@/layouts/breadcrumbs/Breadcrumbs.tsx';
import ModalWrapper from '@/components/ui/ModalWrapper.tsx';
import ModalProcessing from '@/components/ui/ModalProcessing.tsx';
import { authStore } from '@/stores/auth.store.ts';
import {
  ROLES,
  SCREENS_PATH
} from '@/config/constant.ts';

const MainLayout = () => {
  const isAuthenticated = authStore(state => state.isAuthenticated);
  const logout = authStore(state => state.logout);
  const user = authStore(state => state.user);

  /* Fix: logout() must not be called in render phase */
  const hasInvalidRole = !!user && !ROLES.includes(user.role);
  useEffect(() => {
    if (hasInvalidRole) logout();
  }, [hasInvalidRole, logout]);

  if (!isAuthenticated || !user || hasInvalidRole) {
    return <Navigate to={SCREENS_PATH.LOGIN} replace />;
  }

  return (
    <div className="layout">
      <Sidebar />
      <Header />
      <div className="pc-container">
        <div className="pc-content">
          <Breadcrumbs />
          <Outlet/>
        </div>
      </div>
      <ModalWrapper />
      <ModalProcessing />
      <Footer />
    </div>);
};
export default MainLayout;
