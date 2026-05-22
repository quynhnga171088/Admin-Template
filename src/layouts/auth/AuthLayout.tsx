import { Outlet } from 'react-router-dom';

import ModalWrapper from '@/components/ui/ModalWrapper';
import ModalProcessing from '@/components/ui/ModalProcessing';
import 'src/layouts/auth/AuthLayout.scss';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-content">
        <Outlet />
      </div>
      <ModalWrapper />
      <ModalProcessing />
    </div>
  );
};

export default AuthLayout;
