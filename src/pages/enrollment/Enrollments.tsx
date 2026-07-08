import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { userStore } from '@/stores/user.store';
import type { IUserState, IPagination, IRegistrationContent, IPageResponse } from '@/types/types';
import {
  getColorByStateEnrollment,
  getPagination
} from '@/util/util.tsx';
import { queryKeys } from '@/lib/queryKeys';
import { modalStore } from '@/stores/modal.store';
import {
  enrollmentsFetcher,
  approveEnrollment,
  invalidateEnrollmentList
} from '@/pages/enrollment/enrollments.service';
import {
  COURSE_DEFAULT_IMAGE,
  ENROLLMENT_STATE,
  DATE_TIME_FORMAT,
  AVATAR_DEFAULT,
  QUERY_CONFIG,
  SCREENS_PATH,
  DATE_FORMAT
} from '@/config/constant';
import '@/pages/enrollment/Enrollments.scss';
import dayjs from 'dayjs';
import Pagination from '@/components/ui/Pagination.tsx';

const Enrollments = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const search = userStore((state: IUserState) => state.search);

  const setAction = userStore((state: IUserState) => state.setAction);

  const action = userStore((state: IUserState) => state.action);

  const pagination: IPagination = getPagination(new URLSearchParams(location.search));

  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const showImage = (url: string) => setPreviewImageUrl(url);

  const currentQueryKey = queryKeys.enrollments.list(pagination);

  const { data, isLoading } = useQuery({
    queryKey: currentQueryKey,
    queryFn: () => enrollmentsFetcher(pagination),
    staleTime: QUERY_CONFIG.STALE_TIME * 60 * 1000 // 5 minutes
  });

  const enrollments = data?.content ?? [];

  const paginationData: IPagination = {
    ...pagination,
    last: data?.last ?? true,
    totalElements: data?.totalElements ?? 0,
    totalPages: data?.totalPages ?? 1
  };

  /* Sync loading state with modalStore (spinner global) */
  const setProcessing = modalStore(state => state.setProcessing);
  useEffect(() => {
    setProcessing(isLoading);
  }, [isLoading, setProcessing]);

  useEffect(() => {
    if (action) {
      navigate(`${location.pathname}?search=${search}`);
      setAction(false);
    }
  }, [action, navigate, location.pathname, search, setAction]);

  /* Approve mutation with Optimistic Update */
  const approveMutation = useMutation({
    mutationFn: (enrollmentId: number) => approveEnrollment(enrollmentId),

    /* 1. Snapshot cache & optimistically update to APPROVED immediately */
    onMutate: async (enrollmentId: number) => {
      /* Cancel any in-flight re-fetch so it doesn't overwrite our optimistic data */
      await queryClient.cancelQueries({ queryKey: currentQueryKey });

      /* Snapshot previous state for rollback if mutate error */
      const previousData = queryClient.getQueryData<IPageResponse<IRegistrationContent>>(currentQueryKey);

      /* Optimistically update the cache */
      queryClient.setQueryData<IPageResponse<IRegistrationContent>>(currentQueryKey, oldData => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          content: oldData.content.map(e =>
            e.id === enrollmentId ? { ...e, status: ENROLLMENT_STATE.APPROVED } : e
          )
        };
      });

      return { previousData };
    },

    /* 2. On error: rollback to snapshot */
    onError: (_err, _enrollmentId, context) => {
      /* If there's previous data, restore it — rollback! */
      if (context?.previousData) {
        queryClient.setQueryData(currentQueryKey, context.previousData);
      }
    },

    /* 3. On success or error: sync with server (only invalidate list, not all) */
    onSettled: () => {
      invalidateEnrollmentList();
    }
  });

  return (
    <>
      <div className="grid grid-cols-12 gap-4 enrollments-list">
        <div className="col-span-12">
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <div className="card-header-title">Enrollments</div>
              <button type="button" className="btn btn-sm btn-primary ml-auto" onClick={() => navigate(SCREENS_PATH.COURSE_ADD_NEW)}>
                <i className="fa-regular fa-plus" /> Add Course
              </button>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-24 gap-4 enrollment-item enrollment-item-label">
                <div className="col-span-8  md:col-span-7       lg:col-span-6 xl:col-span-5 2xl:col-span-4 flex items-center card-header-title">Student</div>
                <div className="col-span-12 md:col-span-13      lg:col-span-8 xl:col-span-7 2xl:col-span-6 items-center card-header-title">Course</div>
                <div className="col-span-4  md:col-span-4       lg:col-span-3 xl:col-span-2 2xl:col-span-2 items-center card-header-title">Status</div>
                <div className="hidden                 2xl:flex                             2xl:col-span-2 items-center card-header-title">Create Date</div>
                <div className="hidden                 2xl:flex                             2xl:col-span-3 items-center card-header-title">Phone Number</div>
                <div className="hidden         xl:flex 2xl:flex               xl:col-span-3 2xl:col-span-3 items-center card-header-title">Payment Proof</div>
                <div className="hidden lg:flex xl:flex 2xl:flex lg:col-span-7 xl:col-span-5 2xl:col-span-4 items-center card-header-title">Action</div>
              </div>
              {enrollments.length === 0 && !isLoading && (
                <div className="col-span-24 flex items-center justify-center text-center text-gray-500 py-4 mt-2! mb-2!">No enrollment found.</div>
              )}
              {enrollments.map((enrollment: IRegistrationContent) => {
                const isApproving = approveMutation.isPending && approveMutation.variables === enrollment.id;
                return (
                  <div key={enrollment.id} className="grid grid-cols-24 gap-4 enrollment-item cursor-pointer">
                    <div className="col-span-8  md:col-span-7       lg:col-span-6 xl:col-span-5 2xl:col-span-4 flex items-center">
                      <div className="enrollment-item-avatar" style={{ backgroundImage: `url(${enrollment.studentAvatar || AVATAR_DEFAULT})` }} />
                      <div className="enrollment-item-user-info">
                        <div className="enrollment-item-full-name truncate" title={enrollment.studentName}>
                          {enrollment.studentName}
                        </div>
                        <div className="enrollment-item-user-email truncate" title={enrollment.studentEmail}>
                          {enrollment.studentEmail}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-13      lg:col-span-8 xl:col-span-7 2xl:col-span-6 flex items-center">
                      <div className="enrollment-item-bg-img" style={{ backgroundImage: `url(${enrollment.courseThumbnailUrl || COURSE_DEFAULT_IMAGE})` }} />
                      <div className="enrollment-item-des-common">
                        <div className="enrollment-item-title mb-1! truncate">{enrollment.courseTitle}</div>
                        <div className="enrollment-item-description truncate text-gray-500">{enrollment.courseShortDescription}</div>
                      </div>
                    </div>
                    <div className="col-span-4  md:col-span-4       lg:col-span-3 xl:col-span-2 2xl:col-span-2 flex items-center cursor-pointer">
                      <div className={`enrollment-item-status ${getColorByStateEnrollment(enrollment.status)}`}>{enrollment.status}</div>
                    </div>
                    <div className="hidden                 2xl:flex                             2xl:col-span-2 items-center cursor-pointer">
                      {enrollment.createdAt ? dayjs(enrollment.createdAt).format(DATE_FORMAT) : 'N/A'}
                    </div>
                    <div className="hidden                 2xl:flex                             2xl:col-span-3 items-center cursor-pointer">
                      {enrollment.studentPhone ? enrollment.studentPhone : 'N/A'}
                    </div>
                    <div className="hidden         xl:flex 2xl:flex               xl:col-span-3 2xl:col-span-3 items-center cursor-pointer">
                      {enrollment.paymentProof && enrollment.paymentProof.imageUrl ? (
                        <div
                          className="enrollment-item-payment-proof"
                          title="Click to view Payment Proof"
                          style={{ backgroundImage: `url(${enrollment.paymentProof.imageUrl})` }}
                          onClick={() => showImage(enrollment.paymentProof?.imageUrl || '')}
                        />
                      ) : (
                        'N/A'
                      )}
                    </div>
                    <div className="hidden lg:flex xl:flex 2xl:flex lg:col-span-7 xl:col-span-5 2xl:col-span-4 items-center cursor-pointer">
                      {enrollment.status && enrollment.status === ENROLLMENT_STATE.PENDING &&
                        <div className="flex w-full">
                          <button
                            className="btn btn-success btn-sm"
                            disabled={isApproving}
                            onClick={() => approveMutation.mutate(enrollment.id)}
                          >
                            {isApproving
                              ? <><i className="fa-regular fa-spinner fa-spin" /> Approving...</>
                              : <><i className="fa-regular fa-check" /> Approve</>
                            }
                          </button>
                          <button className="btn btn-danger btn-sm m-1-l"><i className="fa-regular fa-x" /> Reject</button>
                        </div>}
                      {enrollment.status && enrollment.status === ENROLLMENT_STATE.APPROVED && enrollment.updatedAt && dayjs(enrollment.createdAt).format(DATE_TIME_FORMAT)}
                    </div>
                  </div>
                );
              })}
            </div>
            <Pagination pagination={paginationData} />
          </div>
        </div>
      </div>

      {/* Payment Proof Image Preview Modal */}
      {previewImageUrl && (
        <div
          className="payment-proof-overlay"
          onClick={() => setPreviewImageUrl(null)}
          onKeyDown={e => e.key === 'Escape' && setPreviewImageUrl(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Payment Proof Preview"
          tabIndex={-1}
        >
          <div className="payment-proof-modal" onClick={e => e.stopPropagation()}>
            <button
              className="payment-proof-close"
              onClick={() => setPreviewImageUrl(null)}
              aria-label="Close"
            >
              <i className="fa-regular fa-xmark" />
            </button>
            <img src={previewImageUrl} alt="Payment Proof" className="payment-proof-img" />
          </div>
        </div>
      )}
    </>
  );
};

export default Enrollments;
export { Enrollments as Component };
