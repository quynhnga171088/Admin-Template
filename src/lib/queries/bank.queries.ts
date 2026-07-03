import { useMutation, useQuery } from '@tanstack/react-query';

import { bankApi } from '@/lib/api/bank.api';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import type { IBankInfo, IUpdateBankInfoRequest, IVietQRBank } from '@/types/types';
import { QUERY_CONFIG } from '@/config/constant.ts';

export const useBankInfoQuery = () =>
  useQuery<IBankInfo>({
    queryKey: queryKeys.bankInfo.detail(),
    queryFn: () => bankApi.get().then(res => res.data),
    staleTime: QUERY_CONFIG.STALE_TIME * 2 * 60 * 1000, // 10 minutes
    retry: false
  });

export const useUpdateBankInfoMutation = () =>
  useMutation({
    mutationFn: (data: IUpdateBankInfoRequest) => bankApi.update(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.bankInfo.all })
  });

export const useVietQRBanksQuery = () =>
  useQuery<IVietQRBank[]>({
    queryKey: ['vietqr-banks'],
    queryFn: () => bankApi.getVietQRBanks(),
    staleTime: QUERY_CONFIG.STALE_TIME * 2 * 60 * 1000 // 10 minutes
  });
