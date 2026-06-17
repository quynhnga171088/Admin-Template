import type { IPageResponse, IPagination, IRegistrationContent } from '@/types/types';
import { enrollmentApi } from '@/lib/api/enrollment.api';
import { queryClient } from '@/lib/queryClient.ts';
import { queryKeys } from '@/lib/queryKeys.ts';

/** Pure queryFn — use queryFn for useQuery in component */
export const enrollmentsFetcher: (pagination: IPagination) => Promise<IPageResponse<IRegistrationContent>> =
  (pagination: IPagination) => enrollmentApi.getEnrollments(pagination).then(res => res.data);

/** Approve action — returns updated enrollment, component handles optimistic update */
export const approveEnrollment = async (enrollmentId: number): Promise<IRegistrationContent> => {
  const response = await enrollmentApi.approve(enrollmentId);
  return response.data;
};

/** Invalidate only the enrollment list queries (not detail, not all) */
export const invalidateEnrollmentList = () =>
  queryClient.invalidateQueries({ queryKey: [...queryKeys.enrollments.all, 'list'] });
