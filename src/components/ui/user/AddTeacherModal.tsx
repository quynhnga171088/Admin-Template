import { useState } from 'react';
import '@/components/ui/course/Modal.scss';
import '@/components/ui/user/AddTeacherModal.scss';
import type { INewTeacher } from '@/types/types';

const AddTeacherModal = ({
  submitting,
  onClose,
  onSave
}: {
  submitting: boolean;
  onClose: () => void;
  onSave: (data: INewTeacher) => Promise<void>;
}) => {
  const [form, setForm] = useState<INewTeacher>({ fullName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const canSave = !!form.fullName.trim() && !!form.email.trim() && !!form.password && !submitting;

  const handleSubmit = async () => {
    if (!canSave) return;
    setError('');
    try {
      await onSave({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password
      });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Tạo tài khoản thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="ccp-modal-overlay">
      <div className="ccp-modal ccp-modal--wide">
        <div className="ccp-modal-header">
          <h3 className="ccp-modal-title">
            <i className="fa-regular fa-user-plus" /> New Teacher
          </h3>
          <button className="ccp-modal-close" onClick={onClose}>
            <i className="fa-regular fa-xmark" />
          </button>
        </div>

        <div className="ccp-modal-body">
          <div className="can-field">
            <label className="form-label can-label">
              Full Name <span className="can-required">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Nguyen Van A"
              value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })}
              maxLength={255}
              autoFocus
            />
          </div>

          <div className="can-field">
            <label className="form-label can-label">
              Email <span className="can-required">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. teacher@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="can-field">
            <label className="form-label can-label">
              Password <span className="can-required">*</span>
            </label>
            <div className="atm-password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                className="atm-password-toggle"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

          {error && <div className="ccp-upload-error">{error}</div>}
        </div>

        <div className="ccp-modal-footer">
          <button className="btn btn-light" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!canSave}>
            {submitting
              ? <><i className="fa-regular fa-spinner-third fa-spin" /> Saving...</>
              : <><i className="fa-regular fa-floppy-disk" /> Save</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTeacherModal;
