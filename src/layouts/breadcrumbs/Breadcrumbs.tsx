import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import navigation from '@/layouts/sidebar/sideBarContentData';
import { SCREENS_PATH } from '@/config/constant.ts';

const Breadcrumbs = () => {
  const pathname = useLocation().pathname;

  const [main, setMain] = useState<{type?: string, title?: string}>({});
  const [item, setItem] = useState<Record<string, any>>({});

  const getCollapse = useCallback(
    function getCollapseRecursive(item: Record<string, any>) {
      if (item.children) {
        item.children.forEach((collapse: Record<string, any>) => {
          if (collapse.type === 'collapse') {
            getCollapseRecursive(collapse);
          } else if (collapse.type === 'item' && pathname === collapse.url) {
            setMain({
              type: 'collapse',
              title: typeof item.title === 'string' ? item.title : undefined
            });
            setItem({
              type: 'item',
              title: typeof collapse.title === 'string' ? collapse.title : undefined,
              breadcrumbs: collapse.breadcrumbs !== false
            });
          }
        });
      }
    },
    [pathname]
  );

  useEffect(() => {
    navigation.items.forEach((navItem: Record<string, any>) => {
      if (navItem.type === 'group') {
        getCollapse(navItem);
      }
    });
  }, [pathname, getCollapse]);

  let mainContent;
  let itemContent;
  let breadcrumbContent = null;
  let title: string;

  if (main?.type === 'collapse') {
    mainContent = (
      <li className="cursor-pointer flex items-center gap-1.25 text-base">
        <i className="fa-regular fa-angle-right" />
        <span>{main.title}</span>
      </li>
    );
  }

  if (item?.type === 'item') {
    title = item.title ?? '';
    itemContent = (
      <li className="cursor-pointer">
        <div className="text-capitalize flex items-center gap-1.25 text-base">
          <i className="fa-regular fa-angle-right" />
          <span>{title}</span>
        </div>
      </li>
    );

    if (item.breadcrumbs !== false) {
      breadcrumbContent = (
        <div className="page-header mb-1">
          <div className="page-block">
            <div className="page-header-title mb-1!">
              <div className="text-base font-semibold">{title}</div>
            </div>
            <ul className="breadcrumb mb-2!">
              <li className="cursor-pointer text-xs font-normal">
                <Link to={SCREENS_PATH.HOME}>Home</Link>
              </li>
              {mainContent}
              {itemContent}
            </ul>
          </div>
        </div>
      );
    }
  }

  return breadcrumbContent;
};

export default Breadcrumbs;
