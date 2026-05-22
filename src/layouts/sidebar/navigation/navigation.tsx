import { useState } from 'react';

import NavItem from '@/layouts/sidebar/navigation/navItem';
import menuItems from '@/layouts/sidebar/sideBarContentData';
import NavGroup from '@/layouts/sidebar/navigation/navGroup.tsx';
interface INavigationProps {
  selectedItems: any;
  setSelectedItems: (items: any) => void;
  setSelectTab?: (tab: string) => void;
}

const Navigation = ({ selectedItems, setSelectedItems }: INavigationProps) => {
  const [selectedLevel, setSelectedLevel] = useState(0);

  const lastItem = null;
  let lastItemIndex = menuItems.items.length - 1;
  let remItems = [];
  let lastItemId: any;

  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems.items[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item: Record<string, any>) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && {
        url: item.url
      })
    }));
  }

  const navGroups = menuItems.items.slice(0, lastItemIndex + 1).map((item: Record<string, any>) => {
    switch (item.type) {
      case 'group':
        if (item.url && item.id !== lastItemId) {
          return (
            <li key={item.id}>
              <NavItem item={item} />
            </li>
          );
        }

        return (
          <NavGroup
            key={item.id}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
          />
        );
      default:
        return (
          <h6 key={item.id} color="error" className="align-items-center">
            Fix - Navigation Group
          </h6>
        );
    }
  });

  return <ul className="pc-navbar d-block">{navGroups}</ul>;
};

export default Navigation;
