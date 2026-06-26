import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import './MainLayout.scss';
import Sidebar from 'src/layouts/sidebar/sidebar';
import Header from '@/layouts/header/Header';
import Footer from '@/layouts/footer/Footer';
import Breadcrumbs from '@/layouts/breadcrumbs/Breadcrumbs';
import ModalWrapper from '@/components/ui/ModalWrapper';
import ModalProcessing from '@/components/ui/ModalProcessing';
import { authStore } from '@/stores/auth.store';
import {
  ROLES_FOR_ADMIN,
  SCREENS_PATH
} from '@/config/constant';

const MainLayout = () => {
  const isAuthenticated = authStore(state => state.isAuthenticated);
  const logout = authStore(state => state.logout);
  const user = authStore(state => state.user);

  /* Fix: logout() must not be called in render phase */
  const hasInvalidRole = !!user && !Object.keys(ROLES_FOR_ADMIN).includes(user.role);
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
