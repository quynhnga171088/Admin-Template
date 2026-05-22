import { useGetMenuMaster, handlerDrawerOpen } from '@/stores/sidebar.store.ts';
import HeaderSearch from 'src/layouts/header/header-content/HeaderSearch';
import 'src/layouts/header/Header.scss';
import HeaderSetting from 'src/layouts/header/header-content/HeaderSetting.tsx';
import UserProfile from '@/layouts/header/header-content/UserProfile.tsx';

const Header = () => {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;

  return (
    <header className="pc-header">
      <div className="header-wrapper flex grow !px-[25px] max-sm:px-[15px]">
        <div className="pc-mob-drp me-auto">
          <ul className="*:min-h-header-height inline-flex *:inline-flex *:items-center">
            <li className="pc-h-item pc-sidebar-collapse">
              <div className="pc-head-link ltr:!ml-0 rtl:!mr-0 cursor-pointer" id="sidebar-hide" onClick={() => handlerDrawerOpen(!drawerOpen)}>
                <i className="fa-regular fa-bars" />
              </div>
            </li>
            <HeaderSearch />
          </ul>
        </div>
        <div className="ms-auto">
          <ul className="*:min-h-header-height inline-flex *:inline-flex *:items-center">
            <HeaderSetting />
            <UserProfile />
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
export { Header as Component };
