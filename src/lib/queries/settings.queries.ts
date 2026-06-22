import { useMutation, useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api/settings.api';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import type { ISetting, ISettingUpdateRequest } from '@/types/types';

export const useSettingsQuery = () =>
  useQuery<ISetting[]>({
    queryKey: queryKeys.settings.list(),
    queryFn: () => settingsApi.getAll().then(res => res.data)
  });

export const useUpdateSettingMutation = () =>
  useMutation({
    mutationFn: ({ key, data }: { key: string; data: ISettingUpdateRequest }) =>
      settingsApi.update(key, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.settings.all })
  });
