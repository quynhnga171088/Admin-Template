export const SCREENS_PATH = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  COURSE_LIST: '/courses',
  COURSE_ADD_NEW: '/courses/add',
  COURSE_REGISTRATION: '/course-registration',
  TYPOGRAPHY: '/typography',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  VERIFY_OTP: '/verify-otp'
};

export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const QUERY_CONFIG = {
  STALE_TIME: 5,
  GC_TIME: 10,
  RETRY: 3
};

export const TIMEOUT_REQUEST = 30000;

export const ROLES: string[] = ['ADMIN', 'TEACHER'];

export const STATE: Record<string, string> = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

export const DEFAULT_AVATAR = 'https://codedthemes.com/demos/admin-templates/datta-able/react/default/assets/avatar-1-aH-LGLvV.png';

export const COMMON_MESSAGES = {
  PLEASE_WAIT: 'Please wait...'
};

import logoWhite from '@/assets/logo/logo-white.svg';
import favicon from '@/assets/logo/favicon.svg';

export const LOGO_WHITE = logoWhite;
export const FAVICON = favicon;

export const API_URL = {
  LOGIN: '/auth/login',
  GET_COURSES_LIST: '/courses',
  ADMIN_REPORT_OVERVIEW: '/admin/reports/overview',
  ADMIN_REPORT_COURSES: '/admin/reports/courses/',
  ADMIN_REPORT_STUDENT: '/admin/reports/students/'
};

