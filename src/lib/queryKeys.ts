import type { IPagination } from '@/types/types.ts';

/**
 * Query key factory — quản lý tất cả query keys tập trung.
 * Pattern: [scope, ...params]
 *
 *   useQuery({ queryKey: queryKeys.users.list(), ... })
 *   useQuery({ queryKey: queryKeys.users.detail(id), ... })
 *   queryClient.invalidateQueries({ queryKey: queryKeys.users.all })
 */
export const queryKeys = {
  users: {
    all: ['users'] as const,
    list: (pagination?: IPagination) => [...queryKeys.users.all, 'list', pagination] as const,
    detail: (id: string | number) => [...queryKeys.users.all, 'detail', id] as const
  },
  overview: {
    all: ['overview'] as const,
    getOverview: () => [ ...queryKeys.overview.all, 'all' ] as const
  },
  courses: {
    all: ['courses'] as const,
    list: (pagination: IPagination) => [ ...queryKeys.courses.all, 'list', pagination] as const,
    detail: (id: number | string) => [ ...queryKeys.courses.all, 'detail', id] as const
  },
  enrollments: {
    all: ['enrollments'] as const,
    list: (pagination: IPagination) => [ ...queryKeys.enrollments.all, 'list', pagination] as const,
    detail: (id: number | string) => [ ...queryKeys.enrollments.all, 'detail', id] as const
  },
  chapters: {
    all: ['chapters'] as const,
    /** All chapters of a course (with nested lessons) */
    byCourse: (courseId: number | string) => [...queryKeys.chapters.all, 'course', courseId] as const,
    detail: (courseId: number | string, chapterId: number | string) => [...queryKeys.chapters.all, 'course', courseId, 'chapter', chapterId] as const
  },
  lessons: {
    all: ['lessons'] as const,
    detail: (courseId: number | string, chapterId: number | string, lessonId: number | string) =>
      [...queryKeys.lessons.all, 'course', courseId, 'chapter', chapterId, 'lesson', lessonId] as const
  },
  sections: {
    all: ['sections'] as const,
    byLesson: (courseId: number | string, chapterId: number | string, lessonId: number | string) =>
      [...queryKeys.sections.all, 'course', courseId, 'chapter', chapterId, 'lesson', lessonId] as const
  },
  settings: {
    all: ['settings'] as const,
    list: () => [...queryKeys.settings.all, 'list'] as const
  },
  bankInfo: {
    all: ['bankInfo'] as const,
    detail: () => [...queryKeys.bankInfo.all, 'detail'] as const
  },
  categories: {
    all: ['categories'] as const,
    list: () => [...queryKeys.categories.all, 'list'] as const
  },
  levels: {
    all: ['levels'] as const,
    byCategory: (categoryId: number) => [...queryKeys.levels.all, 'byCategory', categoryId] as const
  }
} as const;
