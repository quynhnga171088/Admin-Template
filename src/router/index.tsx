import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/main/MainLayout';
import AuthLayout from '@/layouts/auth/AuthLayout';
import { SCREENS_PATH } from 'src/config/constant';

const router = createBrowserRouter([
  {
    path: SCREENS_PATH.HOME,
    element: <MainLayout />,
    children: [
      {
        index: true,
        lazy: () => import('@/pages/home/Home.tsx')
      }, {
        path: 'all-controls',
        lazy: () => import('@/pages/allControlsSample/AllControlsSample.tsx')
      }, {
        path: 'typography',
        lazy: () => import('@/pages/typographyPage/TypographyPage.tsx')
      }, {
        path: 'courses',
        lazy: () => import('@/pages/courses/CoursesList.tsx')
      }, {
        path: 'courses/add',
        lazy: () => import('@/pages/courses/CourseAddNew.tsx')
      }, {
        path: 'courses/:id/edit',
        lazy: () => import('@/pages/courses/CourseEditPage')
      }, {
        path: 'courses/:id/chapters',
        lazy: () => import('@/pages/courses/CourseChaptersPage')
      }
    ]
  }, {
    element: <AuthLayout />,
    children: [
      {
        path: SCREENS_PATH.LOGIN,
        lazy: () => import('@/pages/login/Login.tsx')
      }
    ]
  }, {
    path: '*',
    lazy: () => import('src/pages/NotFound')
  }
]);

export default router;
