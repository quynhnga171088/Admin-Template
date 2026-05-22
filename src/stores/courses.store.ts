import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  type IPagination,
  type ICourseItem,
  type ICoursesState,
  PaginationDefault
} from '@/types/types.ts';

export const coursesStore = create<ICoursesState>()(
  persist(
    set => ({
      courses: [],
      pagination: PaginationDefault as IPagination,
      courseDraft: {} as ICourseItem,
      clearAll: () => set({ courses: [], courseDraft: {} as ICourseItem, pagination: PaginationDefault }),
      setCourses: (courses: ICourseItem[]) => set({ courses }),
      setCourseDraft: (courseDraft: ICourseItem) => set({ courseDraft }),
      setPagination: (pagination: IPagination) => set({ pagination }),
      setPaginationByFieldName: (fieldName: keyof IPagination, fieldValue: any) => set(prev => ({
        pagination: {
          ...(prev.pagination || {}),
          [fieldName]: fieldValue
        }
      })),
      setCourseDraftByFieldName: (fieldName: keyof ICourseItem, fieldValue: any) => set(prev => ({
        courseDraft: {
          ...(prev.courseDraft || {}),
          [fieldName]: fieldValue
        } as ICourseItem
      }))
    }), {
      name: 'courses',
      partialize: (state: ICoursesState) => ({
        courses: state.courses,
        pagination: state.pagination,
        courseDraft: state.courseDraft
      })
    }
  )
);
