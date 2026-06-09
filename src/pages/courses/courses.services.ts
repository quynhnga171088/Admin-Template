import { queryClient } from '@/lib/queryClient';
import { coursesApi } from '@/lib/api/courses.api';
import { resourceApi } from '@/lib/api/resource.api';
import { queryKeys } from '@/lib/queryKeys';
import { modalStore } from '@/stores/modal.store';
import type { ICourseCreateRequest, ICourseItem, ICourseUpdateRequest, IPageResponse, IPagination } from '@/types/types.ts';

/** Pure queryFn — use queryFn for useQuery in component */
export const coursesFetcher: (pagination: IPagination) => Promise<IPageResponse<ICourseItem>> =
  (pagination: IPagination) => coursesApi.getCourses(pagination).then(res => res.data);

export const uploadImage = async (file: File) => {
  const response = await resourceApi.uploadImg(file);
  return response.data.fileUrl || '';
};

export const deleteCourse = async (courseId: number) => {
  const { setProcessing, setEnableCancelButton, setEnableOkButton, setCallback, setMessage, setTitle, setOpen } = modalStore.getState();

  setProcessing(true);
  try {
    await coursesApi.delete(courseId);
    await queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    setMessage('Course deleted successfully.');
    setEnableCancelButton(false);
    setEnableOkButton(true);
    setTitle('Success');
    setCallback(null);
    setOpen(true);
  } catch (error: any) {
    const errorData = error.response?.data;
    setMessage(errorData?.message ?? 'An unexpected error occurred. Please try again.');
    setEnableCancelButton(false);
    setEnableOkButton(true);
    setTitle(errorData?.error ?? 'Error');
    setCallback(null);
    setOpen(true);
    throw error;
  } finally {
    setProcessing(false);
  }
};

export const createCourse = async (payload: ICourseCreateRequest) => {
  const { setProcessing } = modalStore.getState();
  setProcessing(true);
  try {
    const response = await coursesApi.createCourse(payload);
    await queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    return response.data;
  } finally {
    setProcessing(false);
  }
};

export const getCourseDetail = async (id: number) => {
  const queryKey = queryKeys.courses.detail(id);
  return queryClient.fetchQuery({
    queryKey,
    queryFn: () => coursesApi.detail(id).then(res => res.data)
  });
};

export const updateCourse = async (id: number, payload: ICourseUpdateRequest) => {
  const { setProcessing } = modalStore.getState();
  setProcessing(true);
  try {
    const response = await coursesApi.updateCourse(id, payload);
    await queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    await queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(id) });
    return response.data;
  } finally {
    setProcessing(false);
  }
};
