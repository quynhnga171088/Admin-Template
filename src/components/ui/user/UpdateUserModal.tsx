import { useState } from 'react';
import '@/components/ui/course/Modal.scss';
import '@/components/ui/user/AddTeacherModal.scss';
import {
  USER_STATUS_DATA_FOR_DROPDOWN,
  ROLE_DATA_FOR_DROPDOWN
} from '@/config/constant';
import type { IUser, IRole, IUserStatus } from '@/types/types';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';

type IUpdateUserForm = {
  fullName: string;
  role: IRole;
  status: IUserStatus;
};

const UpdateUserModal = ({
  user,
  submitting,
  onClose,
  onSave
}: {
  user: IUser;
  submitting: boolean;
  onClose: () => void;
  onSave: (data: IUpdateUserForm) => Promise<void>;
}) => {
  const [form, setForm] = useState<IUpdateUserForm>({
    fullName: user.fullName,
    role: user.role,
    status: user.status
  });
  const [error, setError] = useState('');

  const canSave = !!form.fullName.trim() && !submitting;

  const handleSubmit = async () => {
    if (!canSave) return;
    setError('');
    try {
      await onSave({
        fullName: form.fullName.trim(),
        role: form.role,
        status: form.status
      });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Update failed. Please try again.');
    }
  };

  return (
    <div className="ccp-modal-overlay">
      <div className="ccp-modal ccp-modal--wide">
        <div className="ccp-modal-header">
          <h3 className="ccp-modal-title">
            <i className="fa-regular fa-user-pen" /> Edit User
          </h3>
          <button className="ccp-modal-close" onClick={onClose}>
            <i className="fa-regular fa-xmark" />
          </button>
        </div>

        <div className="ccp-modal-body">
          <div className="can-field">
            <label className="form-label can-label">Email</label>
            <input type="text" className="form-control" value={user.email} disabled />
          </div>

          <div className="can-field">
            <label className="form-label can-label">Phone</label>
            <input type="text" className="form-control" value={user.phone || ''} disabled />
          </div>

          <div className="can-field">
            <label className="form-label can-label">
              Full Name <span className="can-required">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Input your fullname"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              maxLength={255}
              autoFocus
            />
          </div>
          <div className="can-field">
            <label className="form-label can-label">Role</label>
            <Dropdown
              id={form.role}
              name={form.role}
              dataSelected={form.role}
              itemData={ROLE_DATA_FOR_DROPDOWN}
              setDataSelected={val => setForm({ ...form, role: val as IRole })}
              hasError={false}
              portal
            />
          </div>

          <div className="can-field">
            <label className="form-label can-label">Status</label>
            <Dropdown
              id={form.status}
              name={form.status}
              dataSelected={form.status}
              itemData={USER_STATUS_DATA_FOR_DROPDOWN}
              setDataSelected={val => setForm({ ...form, status: val as IUserStatus })}
              hasError={false}
              portal
            />
          </div>
          {error && <div className="ccp-upload-error">{error}</div>}
        </div>

        <div className="ccp-modal-footer">
          <button className="btn btn-light" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!canSave}>
            {submitting ? (
              <>
                <i className="fa-regular fa-spinner-third fa-spin" /> Saving...
              </>
            ) : (
              <>
                <i className="fa-regular fa-floppy-disk" /> Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserModal;
