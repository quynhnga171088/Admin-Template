import { type CalloutVariant } from '@/components/ui/course/CalloutExtension';

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
  VERIFY_OTP: '/verify-otp'

};

export const SCREENS_PATH_FOR_SIDEBAR = {
  HOME: '/',
  TYPOGRAPHY: '/typography',
  COURSE_LIST: '/courses',
  COURSE_ADD_NEW: '/courses/add',
  COURSE_CHAPTERS: '/chapters',
  COURSE_REGISTRATION: '/course-registration',
  COURSE_PREVIEW: '/preview'
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
  TEACH_REGISTER: '/auth/teach/register',
  STUDENT_REGISTER: '/auth/register',
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

export const AVATAR_DEFAULT = 'https://codedthemes.com/demos/admin-templates/datta-able/react/default/assets/avatar-1-aH-LGLvV.png';

export const VIDEO_HOST = {
  VIMEO: 'vimeo.com',
  YOUBUTE: 'youtube.com',
  YOUBUTE_SHORT: 'youtu.be',
  DAILY_MOTION: 'dailymotion.com'
};

/* All Params for RichTextEditor Start */
/* Table size for extension table */
export const TABLE_SIZE = {
  rows: 3,
  columns: 3
};

/* Preset colors for the color palette */
export const COLOR_PRESETS = [
  '#212529', '#495057', '#868e96', '#adb5bd', // grays
  '#4680ff', '#2d5fe0', '#0ca678', '#f4c22b', // brand
  '#f44236', '#e91e63', '#9c27b0', '#673ab7', // vivid
  '#2196f3', '#00bcd4', '#4caf50', '#ff9800' // material
];

/* Callout variant config */
export const CALLOUT_VARIANTS: { variant: CalloutVariant; color: string; title: string }[] = [
  { variant: 'info', color: 'var(--color-primary, #4680ff)', title: 'Info' },
  { variant: 'warning', color: 'var(--color-warning, #f4c22b)', title: 'Warning' },
  { variant: 'danger', color: 'var(--color-danger, #f44236)', title: 'Danger' },
  { variant: 'success', color: 'var(--color-success, #1de9b6)', title: 'Success' }
];

/* Font size presets (rem) */
export const FONT_SIZES = [
  { label: '10', value: '0.625' },
  { label: '11', value: '0.6875' },
  { label: '12', value: '0.75' },
  { label: '13', value: '0.8125' },
  { label: '14', value: '0.875' },
  { label: '15', value: '0.9375' },
  { label: '16', value: '1' },
  { label: '18', value: '1.125' },
  { label: '20', value: '1.25' },
  { label: '22', value: '1.375' },
  { label: '24', value: '1.5' },
  { label: '28', value: '1.75' },
  { label: '32', value: '2' },
  { label: '36', value: '2.25' },
  { label: '48', value: '3' }
];

/* All Params for RichTextEditor Start End */
