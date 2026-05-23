import { useEffect, useRef, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';

import './sidebar.scss';
import { useGetMenuMaster, handlerDrawerOpen } from '@/stores/sidebar.store.ts';
import {
  SCREENS_PATH,
  LOGO_WHITE,
  FAVICON
} from '@/config/constant.ts';
import SidebarContent from '@/layouts/sidebar/sidebarContent.tsx';
import { authStore } from '@/stores/auth.store.ts';
import type { IAuthState } from '@/types/types.ts';

const Sidebar = () => {
  const { menuMaster } = useGetMenuMaster();
  const [isMobile, setIsMobile] = useState(false);
  const [selectedItems, setSelectedItems] = useState();
  const overlayRef = useRef<HTMLDivElement>(null);
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;

  const user = authStore((state: IAuthState) => state.user);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (overlayRef.current?.contains(event.target)) {
        handlerDrawerOpen(false);
      }
    };
    if (isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile]);

  return (
    <nav className={`pc-sidebar pc-trigger ${drawerOpen ? 'pc-sidebar-hide mob-sidebar-active' : ''}`}>
      <div className="navbar-wrapper">
        <div className="m-header h-header-height flex items-center padding-6-4">
          <Link to={SCREENS_PATH.HOME} className="b-brand flex items-center gap-3">
            {user ?
              <Fragment>
                <img src={user.avatarUrl || 'https://codedthemes.com/demos/admin-templates/datta-able/react/default/assets/avatar-1-aH-LGLvV.png'}
                  className="img-fluid logo logo-lg h-[50px]" alt="Avatar"
                />
                <span className="text-white font-semibold">{user.fullName}</span>
              </Fragment>
              :
              <Fragment>
                <img src={LOGO_WHITE} className="img-fluid logo logo-lg h-auto w-full" alt="logo" width={0} height={0} />
                <img src={FAVICON} className="img-fluid logo logo-sm h-auto w-full" alt="logo" width={0} height={0} />
              </Fragment>
            }
          </Link>
        </div>
        <div className="navbar-content py-2.5">
          <SidebarContent selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
        </div>
      </div>
      {drawerOpen && isMobile && <div className="pc-menu-overlay" ref={overlayRef} />}
    </nav>);
};

export default Sidebar;
export { Sidebar as Component };
