import axiosInstance from '@/config/axios.config';
import { API_URL } from '@/config/constant';
import type { IBankInfo, IUpdateBankInfoRequest, IVietQRBank } from '@/types/types';

export const bankApi = {
  /** GET bank info from our system */
  get: () => axiosInstance.get<IBankInfo>(API_URL.GET_BANK_INFO),

  /** PUT update bank info in our system */
  update: (data: IUpdateBankInfoRequest) => axiosInstance.put<IBankInfo>(API_URL.UPDATE_BANK_INFO, data),

  /** GET all Vietnamese banks from VietQR (no auth needed) */
  getVietQRBanks: (): Promise<IVietQRBank[]> =>
    fetch(API_URL.VIETQR_BANKS_URL)
      .then(r => r.json())
      .then(res => (res.data as IVietQRBank[]).filter(b => b.transferSupported === 1))
};

/**
 * Build a VietQR image URL.
 * @param bin       - Bank BIN code (e.g. "970436" for Vietcombank)
 * @param accountNo - Account number
 * @param accountName - Account holder name
 * @param amount    - Transfer amount in VND (optional, 0 = no fixed amount)
 * @param addInfo   - Transfer description/memo (optional)
 * @param template  - VietQR template: 'compact', 'compact2', 'qr_only', 'print' (default: 'compact2')
 */
export const buildVietQRUrl = (
  bin: string,
  accountNo: string,
  accountName: string,
  amount = 0,
  addInfo = '',
  template = 'compact2'
): string => {
  const params = new URLSearchParams();
  if (amount > 0) params.set('amount', String(amount));
  if (addInfo) params.set('addInfo', addInfo);
  if (accountName) params.set('accountName', accountName);
  const query = params.toString() ? `?${params.toString()}` : '';
  return `https://img.vietqr.io/image/${bin}-${accountNo}-${template}.png${query}`;
};
