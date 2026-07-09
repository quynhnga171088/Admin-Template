import { Navigate, useNavigate, Link } from 'react-router-dom';

import SimpleBarScroll from '@/components/SimpleBarScroll';
import { useDetectOutsideClick } from 'src/components/useDetectOutsideClick';
import { authStore } from '@/stores/auth.store';
import { clearAllDataWhenLogout } from '@/layouts/header/header-content/userProfile.services';
import type { IAuthState } from '@/types/types';
import {
  SCREENS_PATH,
  AVATAR_DEFAULT,
  ROLES_FOR_ADMIN
} from '@/config/constant';

const UserProfile = () => {
  const { ref, isOpen, setIsOpen } = useDetectOutsideClick(false);
  const navigate = useNavigate();

  const user = authStore((state: IAuthState) => state.user);

  const isAuthenticated = authStore((state: IAuthState) => state.isAuthenticated);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (!isAuthenticated || !user) {
    return <Navigate to={SCREENS_PATH.LOGIN} replace />;
  }

  return (
    <li className={`dropdown pc-h-item header-user-profile ${isOpen ? 'drp-show' : ''}`} ref={ref}>
      <a className="pc-head-link cursor-pointer dropdown-toggle arrow-none me-0" data-pc-toggle="dropdown" role="button" onClick={toggleDropdown}>
        <i className="fa-regular fa-user-circle" />
      </a>
      {isOpen && (
        <div className="dropdown-menu dropdown-user-profile dropdown-menu-end pc-h-dropdown overflow-hidden p-2">
          <div className="bg-linear-gradient-primary flex items-center justify-between px-[1.25rem]! py-[1rem]!">
            <div className="mb-1 flex items-center">
              <div className="shrink-0">
                <img src={user.avatarUrl || AVATAR_DEFAULT} alt={user.fullName} className="img-fluid" />
              </div>
              <div className="ms-3 grow">
                <h6 className="mb-1 text-white">{user.fullName}</h6>
                <span className="text-white">{user.email}</span>
              </div>
            </div>
          </div>
          <div className="dropdown-body px-[1.25rem]! py-[1rem]!">
            <SimpleBarScroll className="profile-notification-scroll position-relative" style={{ maxHeight: 'calc(100vh - 225px)' }}>
              {(user.role === ROLES_FOR_ADMIN.ADMIN || user.role === ROLES_FOR_ADMIN.TEACHER) && (
                <div
                  className="dropdown-item cursor-pointer"
                  onClick={() => { setIsOpen(false); navigate(SCREENS_PATH.USER_PROFILE); }}
                >
                  <span>
                    <i className="fa-thin fa-user-pen me-2 align-middle" />
                    <span>Edit Profile</span>
                  </span>
                </div>
              )}
              {(user.role === ROLES_FOR_ADMIN.ADMIN || user.role === ROLES_FOR_ADMIN.TEACHER) && (
                <Link className="dropdown-item" onClick={() => setIsOpen(false)} to={SCREENS_PATH.CHANGE_PASSWORD}>
                  <span>
                    <i className="fa-thin fa-lock me-2 align-middle" />
                    <span>Change Password</span>
                  </span>
                </Link>
              )}
              {user.role === ROLES_FOR_ADMIN.ADMIN &&
                <Link className="dropdown-item" onClick={() => setIsOpen(false)} to={SCREENS_PATH.SETTINGS}>
                  <span>
                    <i className="fa-thin fa-gear me-2 align-middle" />
                    <span>Settings</span>
                  </span>
                </Link>}
              <div className="my-3 grid">
                <button className="btn btn-primary flex items-center justify-center" onClick={() => clearAllDataWhenLogout()}>
                  <i className="fa-thin fa-arrow-left-from-arc" /> Logout
                </button>
              </div>
            </SimpleBarScroll>
          </div>
        </div>
      )}
    </li>
  );
};

export default UserProfile;
