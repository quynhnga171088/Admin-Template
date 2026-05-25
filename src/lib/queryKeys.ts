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
    detail: (id: string | number) =>
      [...queryKeys.users.all, 'detail', id] as const
  },
  overview: {
    all: ['overview'] as const,
    getOverview: () => [ ...queryKeys.overview.all, 'all' ] as const
  },
  courses: {
    all: ['courses'] as const,
    list: (pagination: IPagination) => [ ...queryKeys.courses.all, 'list', pagination] as const,
    detail: (id: number | string) => [ ...queryKeys.courses.all, 'detail', id] as const
  }
} as const;
