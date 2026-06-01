export const SCREENS_PATH = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  COURSE_LIST: '/courses',
  COURSE_ADD_NEW: '/courses/add',
  COURSE_EDIT: (id: number | string) => `/courses/${id}/edit`,
  COURSE_PREVIEW: (id: number | string) => `/courses/${id}/preview`,
  COURSE_CHAPTERS: (id: number | string) => `/courses/${id}/chapters`,
  SECTION_ADD: (courseId: number | string, chapterId: number | string, lessonId: number | string) =>
    `/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/sections/add`,
  SECTION_EDIT: (courseId: number | string, chapterId: number | string, lessonId: number | string, sectionId: number | string) =>
    `/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/sections/${sectionId}/edit`,
  COURSE_REGISTRATION: '/course-registration',
  TYPOGRAPHY: '/typography',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  VERIFY_OTP: '/verify-otp',

};

export const SCREENS_PATH_FOR_SIDEBAR = {
  HOME: '/',
  TYPOGRAPHY: '/typography',
  COURSE_LIST: '/courses',
  COURSE_ADD_NEW: '/courses/add',
  COURSE_CHAPTERS: '/chapters',
  COURSE_REGISTRATION: '/course-registration',
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
  GET_COURSE_DETAIL: '/courses',
  CREATE_COURSE: '/courses',
  UPDATE_COURSE: '/courses',
  ADMIN_REPORT_OVERVIEW: '/admin/reports/overview',
  ADMIN_REPORT_COURSES: '/admin/reports/courses/',
  ADMIN_REPORT_STUDENT: '/admin/reports/students/',
  UPLOAD_IMAGE: '/upload/image',
  UPLOAD_VIDEO: '/upload/video',

  /* chapters */
  CHAPTERS: (courseId: number | string) =>
    `/courses/${courseId}/chapters`,
  CHAPTER: (courseId: number | string, chapterId: number | string) =>
    `/courses/${courseId}/chapters/${chapterId}`,
  REORDER_CHAPTERS: (courseId: number | string) =>
    `/courses/${courseId}/chapters/reorder`,

  /* Lessons */
  LESSONS: (courseId: number | string, chapterId: number | string) => `/courses/${courseId}/chapters/${chapterId}/lessons`,
  LESSON: (courseId: number | string, chapterId: number | string, lessonId: number | string) => `/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`,
  REORDER_LESSONS: (courseId: number | string, chapterId: number | string) => `/courses/${courseId}/chapters/${chapterId}/lessons/reorder`,

  /* Sections */
  SECTIONS: (courseId: number | string, chapterId: number | string, lessonId: number | string) =>
    `/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/sections`,
  SECTION: (courseId: number | string, chapterId: number | string, lessonId: number | string, sectionId: number | string) =>
    `/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/sections/${sectionId}`,
  REORDER_SECTIONS: (courseId: number | string, chapterId: number | string, lessonId: number | string) =>
    `/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/sections/reorder`,

  /* Attachments */
  ATTACHMENTS: (courseId: number | string, chapterId: number | string, lessonId: number | string) => `/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/attachments`,
  ATTACHMENT: (courseId: number | string, chapterId: number | string, lessonId: number | string, attachmentId: number | string) =>
    `/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/attachments/${attachmentId}`
};

export const VIDEO_HOST = {
  VIMEO: 'vimeo.com',
  YOUBUTE: 'youtube.com',
  YOUBUTE_SHORT: 'youtu.be',
  DAILY_MOTION: 'dailymotion.com'
};

