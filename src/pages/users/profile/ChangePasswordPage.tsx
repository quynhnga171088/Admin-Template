import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { authStore } from '@/stores/auth.store.ts';
import { changePassword } from '@/pages/users/users.services.ts';
import { clearAllDataWhenLogout } from '@/layouts/header/header-content/userProfile.services.ts';
import { AVATAR_DEFAULT, SCREENS_PATH } from '@/config/constant.ts';
import type { IAuthState } from '@/types/types.ts';
import '@/pages/users/profile/ProfilePage.scss';

const getRoleBadgeClass = (role: string) => {
  if (role === 'ADMIN') return 'role-admin';
  if (role === 'TEACHER') return 'role-teacher';
  return '';
};

const ChangePasswordPage = () => {
  const { user } = authStore(
    useShallow((s: IAuthState) => ({ user: s.user }))
  );

  /* All hooks before any conditional return — Rules of Hooks */
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  /* Guard */
  if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
    return <Navigate to={SCREENS_PATH.HOME} replace />;
  }

  /* Client-side validation */
  const validate = (): string | null => {
    if (!currentPassword) return 'Please enter your current password.';
    if (!newPassword) return 'Please enter a new password.';
    if (newPassword.length < 8) return 'New password must be at least 8 characters.';
    if (!confirmPassword) return 'Please confirm your new password.';
    if (newPassword !== confirmPassword) return 'New password and confirm password do not match.';
    if (newPassword === currentPassword) return 'New password must be different from the current password.';
    return null;
  };

  const handleSave = async () => {
    if (saving) return;
    setSuccessMsg('');
    setErrorMsg('');

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setSaving(true);
    try {
      await changePassword({ currentPassword, newPassword, confirmPassword });
      setSuccessMsg('Password changed successfully! You will be logged out in 3 seconds...');
      /* Wait 3s so user sees the success message, then force logout */
      setTimeout(() => {
        clearAllDataWhenLogout();
      }, 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrorMsg(msg ?? 'Failed to change password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const clearMsgs = () => { setSuccessMsg(''); setErrorMsg(''); };

  const canSave = !saving && !!currentPassword && !!newPassword && !!confirmPassword;

  /* render */
  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* Banner */}
        <div className="profile-card-banner" />

        {/* Avatar — read-only, no click */}
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrapper" style={{ cursor: 'default' }}>
            <img
              src={user.avatarUrl || AVATAR_DEFAULT}
              alt={user.fullName}
              className="profile-avatar-img"
            />
          </div>
        </div>

        {/* Form body */}
        <div className="profile-form-body">

          {/* User meta */}
          <div className="profile-user-meta">
            <div className="profile-email">{user.email}</div>
            <div className={`profile-role-badge ${getRoleBadgeClass(user.role)}`}>
              <i className={user.role === 'ADMIN' ? 'fa-regular fa-shield-halved' : 'fa-regular fa-chalkboard-teacher'} />
              {user.role}
            </div>
          </div>

          {/* Feedback */}
          {successMsg && (
            <div className="profile-success-msg">
              <i className="fa-regular fa-circle-check" />
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="profile-error-msg">
              <i className="fa-regular fa-circle-exclamation" />
              {errorMsg}
            </div>
          )}

          {/* Current Password */}
          <div className="pf-field">
            <label htmlFor="cp-current">Current Password</label>
            <div className="atm-password-wrapper">
              <input
                id="cp-current"
                type={showCurrent ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your current password"
                value={currentPassword}
                autoComplete="current-password"
                onChange={e => { setCurrentPassword(e.target.value); clearMsgs(); }}
              />
              <button
                type="button"
                className="atm-password-toggle"
                onClick={() => setShowCurrent(v => !v)}
                tabIndex={-1}
              >
                <i className={`fa-regular ${showCurrent ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="pf-field">
            <label htmlFor="cp-new">New Password</label>
            <div className="atm-password-wrapper">
              <input
                id="cp-new"
                type={showNew ? 'text' : 'password'}
                className="form-control"
                placeholder="Minimum 8 characters"
                value={newPassword}
                autoComplete="new-password"
                onChange={e => { setNewPassword(e.target.value); clearMsgs(); }}
              />
              <button
                type="button"
                className="atm-password-toggle"
                onClick={() => setShowNew(v => !v)}
                tabIndex={-1}
              >
                <i className={`fa-regular ${showNew ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="pf-field">
            <label htmlFor="cp-confirm">Confirm New Password</label>
            <div className="atm-password-wrapper">
              <input
                id="cp-confirm"
                type={showConfirm ? 'text' : 'password'}
                className="form-control"
                placeholder="Re-enter new password"
                value={confirmPassword}
                autoComplete="new-password"
                onChange={e => { setConfirmPassword(e.target.value); clearMsgs(); }}
              />
              <button
                type="button"
                className="atm-password-toggle"
                onClick={() => setShowConfirm(v => !v)}
                tabIndex={-1}
              >
                <i className={`fa-regular ${showConfirm ? 'fa-eye-slash' : 'fa-eye'}`} />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="profile-card-footer">
            <button
              className="btn btn-light"
              onClick={() => window.history.back()}
              disabled={saving}
            >
              <i className="fa-regular fa-arrow-left" /> Back
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!canSave}
            >
              {saving
                ? <><i className="fa-regular fa-spinner-third fa-spin" /> Saving...</>
                : <><i className="fa-regular fa-lock-keyhole" /> Change Password</>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
export { ChangePasswordPage as Component };
