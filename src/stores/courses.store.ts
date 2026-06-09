import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  type ICourseItem,
  type ICoursesState
} from '@/types/types.ts';

export const coursesStore = create<ICoursesState>()(
  persist(
    set => ({
      courseDraft: null,
      clearAll: () => set({ courseDraft: null }),
      setCourseDraft: (courseDraft: ICourseItem) => set({ courseDraft }),
      setCourseDraftByFieldName: (fieldName: keyof ICourseItem, fieldValue: any) => set(prev => ({
        courseDraft: {
          ...(prev.courseDraft || {}),
          [fieldName]: fieldValue
        } as ICourseItem
      }))
    }), {
      name: 'courses',
      partialize: (state: ICoursesState) => ({
        courseDraft: state.courseDraft
      })
    }
  )
);
