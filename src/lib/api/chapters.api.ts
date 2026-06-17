import axiosInstance from 'src/config/axios.config';
import { API_URL } from '@/config/constant';
import type {
  IChapter,
  ILesson,
  ISection,
  IReorderChaptersRequest,
  ICreateLessonRequest,
  IUpdateLessonRequest,
  ICreateChapterRequest,
  IUpdateChapterRequest,
  IReorderLessonsRequest,
  ICreateSectionRequest,
  IUpdateSectionRequest,
  IReorderSectionsRequest
} from '@/types/types';

/* Chapter API */

export const chaptersApi = {
  /** GET /courses/{cId}/chapters — returns chapters with nested lessons & sections */
  list: (courseId: number | string) => axiosInstance.get<IChapter[]>(API_URL.CHAPTERS(courseId)),

  /** POST /courses/{cId}/chapters */
  create: (courseId: number | string, data: ICreateChapterRequest) => axiosInstance.post<IChapter>(API_URL.CHAPTERS(courseId), data),

  /** PATCH /courses/{cId}/chapters/{chId} */
  update: (courseId: number | string, chapterId: number | string, data: IUpdateChapterRequest) => axiosInstance.patch<IChapter>(API_URL.CHAPTER(courseId, chapterId), data),

  /** DELETE /courses/{cId}/chapters/{chId} */
  delete: (courseId: number | string, chapterId: number | string) => axiosInstance.delete(API_URL.CHAPTER(courseId, chapterId)),

  /** PATCH /courses/{cId}/chapters/reorder */
  reorder: (courseId: number | string, data: IReorderChaptersRequest) => axiosInstance.patch<IChapter[]>(API_URL.REORDER_CHAPTERS(courseId), data)
};

/* Lesson API */

export const lessonsApi = {
  /** POST /courses/{cId}/chapters/{chId}/lessons */
  create: (courseId: number | string, chapterId: number | string, data: ICreateLessonRequest) => axiosInstance.post<ILesson>(API_URL.LESSONS(courseId, chapterId), data),

  /** PATCH /courses/{cId}/chapters/{chId}/lessons/{lid} */
  update: (
    courseId: number | string,
    chapterId: number | string,
    lessonId: number | string,
    data: IUpdateLessonRequest
  ) => axiosInstance.patch<ILesson>(API_URL.LESSON(courseId, chapterId, lessonId), data),

  /** DELETE /courses/{cId}/chapters/{chId}/lessons/{lid} */
  delete: (courseId: number | string, chapterId: number | string, lessonId: number | string) => axiosInstance.delete(API_URL.LESSON(courseId, chapterId, lessonId)),

  /** PATCH /courses/{cId}/chapters/{chId}/lessons/reorder */
  reorder: (
    courseId: number | string,
    chapterId: number | string,
    data: IReorderLessonsRequest
  ) => axiosInstance.patch<ILesson[]>(API_URL.REORDER_LESSONS(courseId, chapterId), data)
};

/* Section API */

export const sectionsApi = {
  /** POST /courses/{cId}/chapters/{chId}/lessons/{lId}/sections */
  create: (
    courseId: number | string,
    chapterId: number | string,
    lessonId: number | string,
    data: ICreateSectionRequest
  ) => axiosInstance.post<ISection>(API_URL.SECTIONS(courseId, chapterId, lessonId), data),

  /** PATCH /courses/{cId}/chapters/{chId}/lessons/{lId}/sections/{sId} */
  update: (
    courseId: number | string,
    chapterId: number | string,
    lessonId: number | string,
    sectionId: number | string,
    data: IUpdateSectionRequest
  ) => axiosInstance.patch<ISection>(API_URL.SECTION(courseId, chapterId, lessonId, sectionId), data),

  /** DELETE /courses/{cId}/chapters/{chId}/lessons/{lId}/sections/{sId} */
  delete: (
    courseId: number | string,
    chapterId: number | string,
    lessonId: number | string,
    sectionId: number | string
  ) => axiosInstance.delete(API_URL.SECTION(courseId, chapterId, lessonId, sectionId)),

  /** PATCH /courses/{cId}/chapters/{chId}/lessons/{lId}/sections/reorder */
  reorder: (
    courseId: number | string,
    chapterId: number | string,
    lessonId: number | string,
    data: IReorderSectionsRequest
  ) => axiosInstance.patch<ISection[]>(API_URL.REORDER_SECTIONS(courseId, chapterId, lessonId), data)
};
