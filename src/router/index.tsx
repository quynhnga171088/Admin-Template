import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/layouts/main/MainLayout';
import AuthLayout from '@/layouts/auth/AuthLayout';
import { SCREENS_PATH } from '@/config/constant';

const router = createBrowserRouter([
  {
    path: SCREENS_PATH.HOME,
    element: <MainLayout />,
    children: [
      {
        index: true,
        lazy: () => import('@/pages/home/Home')
      }, {
        path: 'all-controls',
        lazy: () => import('@/pages/allControlsSample/AllControlsSample')
      }, {
        path: 'typography',
        lazy: () => import('@/pages/typographyPage/TypographyPage')
      }, {
        path: 'courses',
        lazy: () => import('@/pages/courses/CoursesList')
      }, {
        path: 'courses/add',
        lazy: () => import('@/pages/courses/CourseAddNew')
      }, {
        path: 'courses/:id/edit',
        lazy: () => import('@/pages/courses/CourseEditPage')
      }, {
        path: 'courses/:id/preview',
        lazy: () => import('@/pages/courses/CoursePreviewPage')
      }, {
        path: 'courses/:id/chapters',
        lazy: () => import('@/pages/courses/chapter/ChaptersPage')
      }, {
        path: 'courses/:id/chapters/:chapterId/lessons/:lessonId/sections/add',
        lazy: () => import('@/pages/courses/chapter/lesson/SectionAddPage')
      }, {
        path: 'courses/:id/chapters/:chapterId/lessons/:lessonId/sections/:sectionId/edit',
        lazy: () => import('@/pages/courses/chapter/lesson/SectionEditPage')
      }, {
        path: 'enrollments',
        lazy: () => import('@/pages/enrollment/Enrollments.tsx')
      }
    ]
  }, {
    element: <AuthLayout />,
    children: [
      {
        path: SCREENS_PATH.LOGIN,
        lazy: () => import('@/pages/login/Login.tsx')
      }, {
        path: SCREENS_PATH.REGISTER,
        lazy: () => import('@/pages/register/Register.tsx')
      }
    ]
  }, {
    path: '*',
    lazy: () => import('@/pages/NotFound')
  }
]);

export default router;
