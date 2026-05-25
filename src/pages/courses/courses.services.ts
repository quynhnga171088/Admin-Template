import { queryClient } from '@/lib/queryClient.ts';
import { coursesApi } from '@/lib/api/coursesApi.ts';
import { queryKeys } from '@/lib/queryKeys.ts';
import { modalStore } from '@/stores/modal.store.ts';
import { coursesStore } from '@/stores/courses.store.ts';
import type { ICourseCreateRequest, IPagination } from '@/types/types.ts';

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
  const response = await coursesApi.uploadImg(file);
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
