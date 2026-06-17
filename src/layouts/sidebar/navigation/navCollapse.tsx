import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import NavItem from './navItem';
import { useGetMenuMaster } from '../../../stores/sidebar.store.ts';

const NavCollapse = (
  { menu, level, parentId, setSelectedItems, selectedItems, setSelectedLevel, selectedLevel }: {
    menu: any;
    level: number;
    parentId?: number;
    setSelectedItems: (item: any) => void;
    selectedItems: any;
    setSelectedLevel: (level: number) => void;
    selectedLevel: number;
  }) => {
  void parentId;

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const [manualOpen, setManualOpen] = useState<boolean | null>(null);

  const isPathActive = useMemo(() => {
    if (pathname === menu.url) return true;
    return menu.children?.some((item: Record<string, any>) => {
      if (item.url === pathname || (item.link && pathname.startsWith(item.link))) return true;
      return item.children?.some((child: Record<string, any>) => child.url === pathname) ?? false;
    }) ?? false;
  }, [pathname, menu.url, menu.children]);

  const isSelectedByParent = menu.id === selectedItems?.id && level === 1;
  const isClosedByLevel = menu.id !== selectedItems?.id && level === selectedLevel && !isPathActive;

  const open = !isClosedByLevel && (isPathActive || isSelectedByParent || (manualOpen ?? false));

  const handleClick = (isRedirect: boolean) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 1024;
    setSelectedLevel(level);

    if (isMobile || !drawerOpen) {
      const nextOpen = !open;
      setManualOpen(nextOpen);
      setSelectedItems(nextOpen ? menu : selectedItems);
      if (menu.url && isRedirect) navigate(menu.url);
    }
  };

  const navCollapse = menu.children?.map((item: Record<string, any>) => {
    switch (item.type) {
      case 'collapse':
        return (
          <NavCollapse
            key={item.id}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            menu={item}
            level={level + 1}
            parentId={parentId}
          />
        );
      case 'item':
        return <NavItem key={item.id} item={item} />;
      default:
        return (
          <h6 key={item.id} className="text-center text-red-600">
            Fix - Collapse or Item
          </h6>
        );
    }
  });

  return (
    <li className={`pc-item pc-hasmenu ${open ? 'pc-trigger' : ''}`}>
      {menu.url ?
        <Link className="pc-link" to={menu.url || ''} onClick={() => handleClick(true)}>
          {menu.icon && (
            <span className="pc-micon">
              <i className={menu.icon} />
            </span>
          )}
          <span className="pc-mtext">{menu.title}</span>
          <span className="pc-arrow">
            <i className="fa-regular fa-chevron-right" />
          </span>
          {menu.badge && <span className="pc-badge">{menu.badge}</span>}
        </Link>
        :
        <div className="pc-link cursor-pointer" onClick={() => handleClick(true)}>
          {menu.icon && (
            <span className="pc-micon">
              <i className={menu.icon} />
            </span>
          )}
          <span className="pc-mtext">{menu.title}</span>
          <span className="pc-arrow">
            <i className="fa-regular fa-chevron-right" />
          </span>
          {menu.badge && <span className="pc-badge">{menu.badge}</span>}
        </div>
      }

      {open && <ul className="pc-submenu">{navCollapse}</ul>}
    </li>
  );
};

export default NavCollapse;
