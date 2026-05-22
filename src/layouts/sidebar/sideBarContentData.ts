/* ------------------------ MENU ITEMS ------------------------ */

import { SCREENS_PATH } from '@/config/constant.ts';

const dashboard = {
  id: 'navigation',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      icon: 'fa-regular fa-home',
      url: SCREENS_PATH.HOME
    }
  ]
};

const mainFunctions = {
  id: 'main-functions',
  title: 'Main Functions',
  type: 'group',
  children: [
    {
      id: 'course-management',
      title: 'Course Management',
      type: 'item',
      icon: 'fa-regular fa-school',
      url: SCREENS_PATH.COURSE_LIST
    }, {
      id: 'course-registration',
      title: 'Course Registration',
      type: 'item',
      icon: 'fa-regular fa-calendar-pen',
      url: SCREENS_PATH.COURSE_REGISTRATION
    }, {
      id: 'typography',
      title: 'Typography',
      type: 'item',
      icon: 'fa-regular fa-font',
      url: SCREENS_PATH.TYPOGRAPHY
    }, {
      id: 'icons',
      title: 'Icons',
      type: 'item',
      icon: 'fa-regular fa-feather',
      url: '/icons'
    }
  ]
};

const pages = {
  id: 'pages',
  title: 'Pages',
  type: 'group',
  children: [
    {
      id: 'login',
      title: 'Login',
      type: 'item',
      icon: 'fa-regular fa-right-to-bracket',
      url: '/login',
      target: true
    },
    {
      id: 'register',
      title: 'Register',
      type: 'item',
      icon: 'fa-regular fa-registered',
      url: '/register',
      target: true
    }
  ]
};

const other = {
  id: 'other',
  title: 'Other',
  type: 'group',
  children: [
    {
      id: 'menu-levels',
      title: 'Menu Levels',
      type: 'collapse',
      icon: 'fa-regular fa-sitemap',
      children: [
        {
          id: 'level-2.1',
          title: 'Level 2.1',
          icon: 'fa-regular fa-rectangle',
          type: 'item'
        }, {
          id: 'level-2.2',
          title: 'Level 2.2',
          type: 'collapse',
          icon: 'fa-regular fa-rectangle',
          children: [
            {
              id: 'level-3.1',
              title: 'Level 3.1',
              icon: 'fa-regular fa-rectangle',
              type: 'item'
            }, {
              id: 'level-3.2',
              title: 'Level 3.2',
              icon: 'fa-regular fa-rectangle',
              type: 'item'
            }, {
              id: 'level-3.3',
              title: 'Level 3.3',
              icon: 'fa-regular fa-rectangle',
              type: 'collapse',
              children: [
                {
                  id: 'level-4.1',
                  title: 'Level 4.1',
                  icon: 'fa-regular fa-rectangle',
                  type: 'item'
                }, {
                  id: 'level-4.2',
                  title: 'Level 4.2',
                  icon: 'fa-regular fa-rectangle',
                  type: 'item'
                }
              ]
            }
          ]
        }, {
          id: 'level-2.3',
          title: 'Level 2.3',
          type: 'collapse',
          children: [
            {
              id: 'level-3.1',
              title: 'Level 3.1',
              icon: 'fa-regular fa-rectangle',
              type: 'item'
            }, {
              id: 'level-3.2',
              title: 'Level 3.2',
              icon: 'fa-regular fa-rectangle',
              type: 'item'
            }, {
              id: 'level-3.3',
              title: 'Level 3.3',
              icon: 'fa-regular fa-rectangle',
              type: 'collapse',
              children: [
                {
                  icon: 'fa-regular fa-rectangle',
                  id: 'level-4.1',
                  title: 'Level 4.1',
                  type: 'item'
                }, {
                  icon: 'fa-regular fa-rectangle',
                  id: 'level-4.2',
                  title: 'Level 4.2',
                  type: 'item'
                }
              ]
            }
          ]
        }
      ]
    }, {
      id: 'sample-page',
      title: 'Sample Page',
      type: 'item',
      icon: 'fa-regular fa-desktop',
      url: '/sample-page'
    }
  ]
};

export interface IMenuItems {
  items: Record<string, any>[];
}

const menuItems: IMenuItems = {
  items: [dashboard, mainFunctions, pages, other]
};

export default menuItems;
