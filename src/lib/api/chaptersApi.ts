import axiosInstance from 'src/config/axios.config.ts';
import { API_URL } from '@/config/constant.ts';
import type {
  IChapter,
  ILessonDetail,
  ILesson,
  ICreateChapterRequest,
  IUpdateChapterRequest,
  IReorderChaptersRequest,
  ICreateLessonRequest,
  IUpdateLessonRequest,
  IReorderLessonsRequest,
  IAttachment,
} from '@/types/types.ts';

// ─── Chapter API ──────────────────────────────────────────────────────────────

export const chaptersApi = {
  /** GET /courses/{cid}/chapters — returns chapters with nested lessons */
  list: (courseId: number | string) =>
    axiosInstance.get<IChapter[]>(API_URL.CHAPTERS(courseId)),

  /** POST /courses/{cid}/chapters */
  create: (courseId: number | string, data: ICreateChapterRequest) =>
    axiosInstance.post<IChapter>(API_URL.CHAPTERS(courseId), data),

  /** PATCH /courses/{cid}/chapters/{chid} */
  update: (courseId: number | string, chapterId: number | string, data: IUpdateChapterRequest) =>
    axiosInstance.patch<IChapter>(API_URL.CHAPTER(courseId, chapterId), data),

  /** DELETE /courses/{cid}/chapters/{chid} */
  delete: (courseId: number | string, chapterId: number | string) =>
    axiosInstance.delete(API_URL.CHAPTER(courseId, chapterId)),

  /** PATCH /courses/{cid}/chapters/reorder */
  reorder: (courseId: number | string, data: IReorderChaptersRequest) =>
    axiosInstance.patch<IChapter[]>(API_URL.REORDER_CHAPTERS(courseId), data),
};

// ─── Lesson API ───────────────────────────────────────────────────────────────

export const lessonsApi = {
  /** GET /courses/{cid}/chapters/{chid}/lessons/{lid} */
  detail: (courseId: number | string, chapterId: number | string, lessonId: number | string) =>
    axiosInstance.get<ILessonDetail>(API_URL.LESSON(courseId, chapterId, lessonId)),

  /** POST /courses/{cid}/chapters/{chid}/lessons */
  create: (courseId: number | string, chapterId: number | string, data: ICreateLessonRequest) =>
    axiosInstance.post<ILessonDetail>(API_URL.LESSONS(courseId, chapterId), data),

  /** PATCH /courses/{cid}/chapters/{chid}/lessons/{lid} */
  update: (
    courseId: number | string,
    chapterId: number | string,
    lessonId: number | string,
    data: IUpdateLessonRequest,
  ) => axiosInstance.patch<ILesson>(API_URL.LESSON(courseId, chapterId, lessonId), data),

  /** DELETE /courses/{cid}/chapters/{chid}/lessons/{lid} */
  delete: (courseId: number | string, chapterId: number | string, lessonId: number | string) =>
    axiosInstance.delete(API_URL.LESSON(courseId, chapterId, lessonId)),

  /** PATCH /courses/{cid}/chapters/{chid}/lessons/reorder */
  reorder: (
    courseId: number | string,
    chapterId: number | string,
    data: IReorderLessonsRequest,
  ) => axiosInstance.patch<ILesson[]>(API_URL.REORDER_LESSONS(courseId, chapterId), data),
};

// ─── Attachment API ───────────────────────────────────────────────────────────

export const attachmentsApi = {
  /** GET /courses/{cid}/chapters/{chid}/lessons/{lid}/attachments */
  list: (courseId: number | string, chapterId: number | string, lessonId: number | string) =>
    axiosInstance.get<IAttachment[]>(API_URL.ATTACHMENTS(courseId, chapterId, lessonId)),

  /** POST /courses/{cid}/chapters/{chid}/lessons/{lid}/attachments (multipart) */
  upload: (
    courseId: number | string,
    chapterId: number | string,
    lessonId: number | string,
    file: File,
  ) => {
    const form = new FormData();
    form.append('file', file);
    return axiosInstance.post<IAttachment>(
      API_URL.ATTACHMENTS(courseId, chapterId, lessonId),
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
  },

  /** DELETE /courses/{cid}/chapters/{chid}/lessons/{lid}/attachments/{aid} */
  delete: (
    courseId: number | string,
    chapterId: number | string,
    lessonId: number | string,
    attachmentId: number | string,
  ) => axiosInstance.delete(API_URL.ATTACHMENT(courseId, chapterId, lessonId, attachmentId)),
};
