import { Fragment, useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import NavItem from '@/layouts/sidebar/navigation/navItem.tsx';
import NavCollapse from '@/layouts/sidebar/navigation/navCollapse.tsx';

const NavGroup = ({
  item,
  lastItem,
  remItems,
  lastItemId,
  setSelectedItems,
  selectedItems,
  setSelectedLevel,
  selectedLevel
}: {
  item: any;
  lastItem: any;
  remItems: any[];
  lastItemId: string | number;
  setSelectedItems: (items: any) => void;
  selectedItems: any;
  setSelectedLevel: (level: number) => void;
  selectedLevel: number;
}) => {
  const pathname = useLocation().pathname;

  const currentItem = useMemo(() => {
    if (lastItem && item.id === lastItemId) {
      return {
        ...item,
        children: remItems.flatMap((ele: Record<string, any>) => ele?.children || [])
      };
    }
    return item;
  }, [item, lastItem, lastItemId, remItems]);

  const checkOpenForParent = useCallback(
    (children: Record<string, any>[]) => {
      const recurse = (items: Record<string, any>[]) => {
        items.forEach((ele: Record<string, any>) => {
          if (ele.children?.length) {
            recurse(ele.children);
          }
        });
      };
      recurse(children);
    },
    [pathname, currentItem.id]
  );

  const checkSelectedOnload = useCallback(
    (data: Record<string, any>) => {
      const children = data.children ?? [];
      children.forEach((itemCheck: Record<string, any>) => {
        if (!itemCheck) return;

        if (itemCheck.children?.length) {
          checkOpenForParent(itemCheck.children);
        }
      });
    },
    [pathname, currentItem.id, checkOpenForParent]
  );

  useEffect(() => {
    checkSelectedOnload(currentItem);
  }, [pathname, currentItem, checkSelectedOnload]);


  const navCollapse = currentItem.children?.map((menuItem: Record<string, any>, index: number) => {
    const key = menuItem.id || `${menuItem.type}-${index}`;
    switch (menuItem.type) {
      case 'collapse':
        return (
          <NavCollapse
            key={key}
            menu={menuItem}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            level={1}
            parentId={currentItem.id}
          />
        );
      case 'item':
        return <NavItem key={key} item={menuItem} />;
      default:
        return (
          <h6 key={`fix-${menuItem.id ?? menuItem.title ?? menuItem.type}`} className="text-center text-red-500">
            Fix - Group Collapse or Items
          </h6>
        );
    }
  });

  return (
    <Fragment>
      <li className="pc-item pc-caption" key={item.id}>
        <label>{item.title}</label>
      </li>
      {navCollapse}
    </Fragment>
  );
};

export default NavGroup;
