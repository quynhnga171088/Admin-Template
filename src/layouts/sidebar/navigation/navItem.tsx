import { Link, useLocation } from 'react-router-dom';

import { handlerDrawerOpen } from '@/stores/sidebar.store.ts';

const NavItem = ({ item }: { item: Record<string, any> }) => {
  const pathname = useLocation().pathname;
  const itemPath = item?.link || item?.url;

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  const isSelected = itemPath ? pathname === itemPath : false;
  if (item.disabled) return null;
  return (
    <li className={`pc-item ${isSelected ? 'active' : ''}`}>
      <Link
        to={item?.url || '#'}
        className="pc-link"
        target={itemTarget}
        onClick={() => {
          handlerDrawerOpen(false);
        }}
      >
        {item?.icon && (
          <span className="pc-micon">
            <i className={item.icon} />
          </span>
        )}
        {item?.title && <span className="pc-mtext">{item.title}</span>}
      </Link>
    </li>
  );
};

export default NavItem;
