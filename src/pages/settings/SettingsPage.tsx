import { useCallback, useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useSettingsQuery, useUpdateSettingMutation } from '@/lib/queries/settings.queries';
import { useBankInfoQuery, useUpdateBankInfoMutation, useVietQRBanksQuery } from '@/lib/queries/bank.queries';
import { buildVietQRUrl } from '@/lib/api/bank.api';
import type { IDropdownOption, ISetting, IUpdateBankInfoRequest, IVietQRBank } from '@/types/types';
import '@/pages/settings/SettingsPage.scss';
import { modalStore } from '@/stores/modal.store';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';

/* Setting Item */
interface SettingItemProps {
  setting: ISetting;
  saving: boolean;
  onSave: (key: string, value: string) => void;
}

const SettingItem = ({ setting, saving, onSave }: SettingItemProps) => {
  const [localValue, setLocalValue] = useState(setting.value);
  const [prevSettingValue, setPrevSettingValue] = useState(setting.value);

  /* Derived state during render — sync localValue when the saved value changes externally */
  if (prevSettingValue !== setting.value) {
    setPrevSettingValue(setting.value);
    setLocalValue(setting.value);
  }

  return (
    <div className="settings-item">
      <span className="settings-key-badge">{setting.key}</span>
      <p className="settings-description">{setting.description}</p>
      <div className="input-group">
        <input type="text" className="form-control" value={localValue} onChange={e => setLocalValue(e.target.value)} />
        <button className="btn btn-primary" type="button" onClick={() => onSave(setting.key, localValue)} disabled={saving || localValue === setting.value}>
          {saving ? (
            <span>
              <i className="fa-regular fa-spinner-third fa-spin" /> Saving
            </span>
          ) : (
            <span>
              <i className="fa-regular fa-floppy-disk" /> Save
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

/** Stable empty reference — prevents false !== when React Query hasn't loaded yet */
const EMPTY_BANKS: IVietQRBank[] = [];

const BankInfoCard = () => {
  const { data: bankInfo, isLoading: loadingInfo } = useBankInfoQuery();
  const { data: vietQRBanks = EMPTY_BANKS, isLoading: loadingBanks } = useVietQRBanksQuery();
  const { mutate: updateBankInfo, isPending } = useUpdateBankInfoMutation();

  const { setMessage, setTitle, setOpen, setEnableCancelButton, setEnableOkButton } = modalStore(
    useShallow(state => ({
      setMessage: state.setMessage,
      setTitle: state.setTitle,
      setCallback: state.setCallback,
      setOpen: state.setOpen,
      setEnableCancelButton: state.setEnableCancelButton,
      setEnableOkButton: state.setEnableOkButton
    }))
  );

  const openInfoModal = useCallback((message: string, title: string) => {
    setMessage(message);
    setEnableCancelButton(true);
    setEnableOkButton(true);
    setTitle(title);
    setOpen(true);
  }, [setMessage, setEnableCancelButton, setEnableOkButton, setTitle, setOpen]);

  /* Base form synced from server — fully derived, no state or effect needed */
  const baseForm = useMemo<IUpdateBankInfoRequest>(() => ({
    bankName: bankInfo?.bankName ?? '',
    accountNumber: bankInfo?.accountNumber ?? '',
    accountName: bankInfo?.accountName ?? '',
    branch: bankInfo?.branch ?? '',
    transferTemplate: bankInfo?.transferTemplate ?? '',
    qrImageUrl: bankInfo?.qrImageUrl ?? ''
  }), [bankInfo]);

  /* Only the fields the user has explicitly edited are stored as state */
  const [overrides, setOverrides] = useState<Partial<IUpdateBankInfoRequest>>({});
  const [savedOk, setSavedOk] = useState(false);

  /* Merged view: server defaults + local edits */
  const form = useMemo(() => ({ ...baseForm, ...overrides }), [baseForm, overrides]);

  /* selectedBank fully derived from form.bankName — no state or effect needed */
  const selectedBank = useMemo(() => {
    if (!vietQRBanks.length || !form.bankName) return null;
    return vietQRBanks.find(
      b =>
        b.shortName.toLowerCase() === form.bankName.toLowerCase() ||
        b.code.toLowerCase() === form.bankName.toLowerCase()
    ) ?? null;
  }, [vietQRBanks, form.bankName]);

  /* Auto-clear savedOk banner */
  useEffect(() => {
    if (!savedOk) return;
    openInfoModal('Save Info Bank Success', 'Confirm Success');
    const timer = setTimeout(() => setSavedOk(false), 3000);
    return () => clearTimeout(timer);
  }, [openInfoModal, savedOk]);

  const set = (field: keyof IUpdateBankInfoRequest, value: string) =>
    setOverrides(prev => ({ ...prev, [field]: value }));

  const handleBankSelect = (bin: string) => {
    const bank = vietQRBanks.find(b => b.bin === bin) ?? null;
    set('bankName', bank?.shortName ?? '');
  };

  const handleSave = () => {
    updateBankInfo(form, {
      onSuccess: () => {
        setOverrides({}); // Clear local edits; baseForm will auto-update from React Query refetch
        setSavedOk(true);
      }
    });
  };

  /* Dirty check: compare merged form against server snapshot */
  const isDirty = bankInfo !== null && JSON.stringify(form) !== JSON.stringify(baseForm);

  /* QR preview URL */
  const qrUrl = selectedBank && form.accountNumber ? buildVietQRUrl(selectedBank.bin, form.accountNumber, form.accountName, 0, form.transferTemplate ?? '') : null;

  const isLoading = loadingInfo || loadingBanks;

  const convertDataForDropdown = (): IDropdownOption[] => {
    return vietQRBanks.map((vietQRBank: IVietQRBank) => ({
      label: `${vietQRBank.shortName} — ${vietQRBank.name}`,
      value: vietQRBank.bin,
      imgUrl: vietQRBank.logo,
      className: 'dropdown-item-status default'
    }));
  };

  return (
    <div className="card bank-info-card mb-0!">
      <div className="card-header">
        <div className="card-header-title">
          <i className="fa-regular fa-building-columns" /> Bank Transfer (VietQR)
        </div>
      </div>
      <div className="card-body">
        {isLoading ?
          <div className="bank-loading">
            <i className="fa-regular fa-spinner-third fa-spin" /> Loading...
          </div>
          :
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 text-center">
              <p className="bank-label">QR Preview</p>
            </div>
            {qrUrl &&
              <div className="col-span-12 flex justify-center">
                <img src={qrUrl} alt="VietQR" className="bank-qr-img" />
              </div>}
            <div className="col-span-12 flex justify-center">
              {qrUrl ? (
                <p className="bank-qr-note">
                  <i className="fa-regular fa-circle-info" /> Dynamic QR powered by VietQR.
                  <br />
                  Amount &amp; description will be filled per payment.
                </p>
              ) : (
                <div className="bank-qr-placeholder">
                  <i className="fa-regular fa-qrcode" />
                  <span>Select bank &amp; enter account number to preview QR</span>
                </div>
              )}
            </div>
            <div className="col-span-12">
              <label className="bank-label">
                Bank <span className="can-required">*</span>
              </label>
              <Dropdown dataSelected={selectedBank?.bin ?? ''} itemData={convertDataForDropdown()} setDataSelected={val => handleBankSelect(val)} hasError={false} portal />
            </div>
            <div className="col-span-12 xl:col-span-6">
              <label className="bank-label">
                Account Number <span className="can-required">*</span>
              </label>
              <input className="form-control" placeholder="e.g. 1234567890" value={form.accountNumber} onChange={e => set('accountNumber', e.target.value)} />
            </div>
            <div className="col-span-12 xl:col-span-6">
              <label className="bank-label">
                Account Name <span className="can-required">*</span>
              </label>
              <input className="form-control" placeholder="e.g. NGUYEN VAN A" value={form.accountName} onChange={e => set('accountName', e.target.value)} />
            </div>
            <div className="col-span-12">
              <label className="bank-label">Branch</label>
              <input className="form-control" placeholder="e.g. Ho Chi Minh City" value={form.branch} onChange={e => set('branch', e.target.value)} />
            </div>
            <div className="col-span-12">
              <label className="bank-label">Transfer Description Template</label>
              <input
                className="form-control"
                placeholder="e.g. LMS {courseName} - {studentName}"
                value={form.transferTemplate}
                onChange={e => set('transferTemplate', e.target.value)}
              />
              <p className="bank-hint text-right">
                Supports placeholders: <span className="settings-key-badge">{'{courseName}'}</span>, <span className="settings-key-badge">{'{studentName}'}</span>
              </p>
            </div>
            <div className="col-span-12 text-right">
              <button className="btn btn-primary" onClick={handleSave} disabled={isPending || !isDirty || !form.bankName || !form.accountNumber || !form.accountName}>
                <i className={`fa-regular ${isPending ? 'fa-spinner-third fa-spin' : 'fa-floppy-disk'}`} /> {`${isPending ? 'Saving' : 'Save Bank Info'}`}
              </button>
            </div>
          </div>}
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const { data: settings = [], isLoading } = useSettingsQuery();
  const { mutate: updateSetting } = useUpdateSettingMutation();
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const handleSave = (key: string, value: string) => {
    setSavingKey(key);
    updateSetting({ key, data: { value } }, { onSettled: () => setSavingKey(null) });
  };

  const setProcessing = modalStore(state => state.setProcessing);
  useEffect(() => {
    setProcessing(isLoading);
  }, [isLoading, setProcessing]);

  return (
    <div className="settings-page">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 xl:col-span-6">
          <BankInfoCard />
        </div>
        <div className="col-span-12 xl:col-span-6">
          <div className="card">
            <div className="card-header">
              <div className="card-header-title">
                <i className="fa-regular fa-gear" /> System Configuration
              </div>
            </div>
            <div className="card-body">
              {!isLoading && settings.length === 0 && <div className="settings-empty">No Configuration</div>}
              {settings.map((s: ISetting) => (
                <SettingItem key={s.key} setting={s} saving={savingKey === s.key} onSave={handleSave} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
export { SettingsPage as Component };
