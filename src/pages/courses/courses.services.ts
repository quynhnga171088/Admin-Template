import { queryClient } from '@/lib/queryClient';
import { coursesApi } from '@/lib/api/courses.api';
import { resourceApi } from '@/lib/api/resource.api';
import { queryKeys } from '@/lib/queryKeys';
import { modalStore } from '@/stores/modal.store';
import { coursesStore } from '@/stores/courses.store';
import type { ICourseCreateRequest, ICourseUpdateRequest, IPagination } from '@/types/types.ts';

export const getCourses = async (pagination: IPagination) => {
  const { setProcessing } = modalStore.getState();
  const { setCourses, setPagination } = coursesStore.getState();

  const queryKey = queryKeys.courses.list(pagination);
  const cachedState = queryClient.getQueryState(queryKey);
  const isStale = !cachedState?.data || (cachedState.dataUpdatedAt + (queryClient.getDefaultOptions().queries?.staleTime as number ?? 0)) < Date.now();

  if (isStale) setProcessing(true);

  try {
    const data = await queryClient.fetchQuery({
      queryKey,
      queryFn: () =>
        coursesApi
          .getCourses(pagination)
          .then(response => response.data)
    });

    setCourses(data.content);
    setPagination({
      ...pagination,
      last: data.last,
      totalElements: data.totalElements,
      totalPages: data.totalPages
    });
  } finally {
    if (isStale) setProcessing(false);
  }
};

export const uploadImage = async (file: File) => {
  const response = await resourceApi.uploadImg(file);
  return response.data.fileUrl || '';
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
