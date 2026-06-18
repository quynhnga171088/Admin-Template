import { useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { authStore } from '@/stores/auth.store';
import { resourceApi } from '@/lib/api/resource.api';
import { updateUserInfo } from '@/pages/users/users.services';
import { AVATAR_DEFAULT, SCREENS_PATH } from '@/config/constant';
import type { IAuthState, IUpdateUserInfoRequest } from '@/types/types';
import '@/pages/profile/ProfilePage.scss';

const getRoleBadgeClass = (role: string) => {
  if (role === 'ADMIN') return 'role-admin';
  if (role === 'TEACHER') return 'role-teacher';
  return '';
};

const ProfilePage = () => {
  /** useShallow prevents infinite loop: selector returns new object each time,
  useShallow does a shallow-equal check so Zustand won't re-render unless
  the actual values change.
  */
  const { user, setUser } = authStore(
    useShallow((s: IAuthState) => ({ user: s.user, setUser: s.setUser }))
  );

  /** ALL hooks must be declared before any conditional return (Rules of Hooks) */
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatarUrl || AVATAR_DEFAULT);
  const [pendingAvatarUrl, setPendingAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Guard: redirect after all hooks are declared */
  if (!user || (user.role !== 'ADMIN' && user.role !== 'TEACHER')) {
    return <Navigate to={SCREENS_PATH.HOME} replace />;
  }

  /* handlers */

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);
    setAvatarUploading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await resourceApi.uploadImg(file);
      const uploadedUrl = res.data.fileUrl;
      setPendingAvatarUrl(uploadedUrl);
      setAvatarPreview(uploadedUrl);
    } catch {
      setErrorMsg('Avatar upload failed. Please try again.');
      setAvatarPreview(user.avatarUrl || AVATAR_DEFAULT);
      setPendingAvatarUrl(null);
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (saving || avatarUploading) return;
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const payload: IUpdateUserInfoRequest = {};
    if (fullName.trim() && fullName.trim() !== user.fullName) payload.fullName = fullName.trim();
    if (phone.trim() !== (user.phone ?? '')) payload.phone = phone.trim();
    if (pendingAvatarUrl !== null) payload.avatarUrl = pendingAvatarUrl;

    if (Object.keys(payload).length === 0) {
      setSuccessMsg('No changes to save.');
      setSaving(false);
      return;
    }

    try {
      const updated = await updateUserInfo(user.id, payload);
      setUser({ ...user, ...updated });
      setPendingAvatarUrl(null);
      setSuccessMsg('Your profile has been updated successfully!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrorMsg(msg ?? 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const canSave = !saving && !avatarUploading;

  /* render */
  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* Banner */}
        <div className="profile-card-banner" />

        {/* Avatar */}
        <div className="profile-avatar-section">
          <div
            className="profile-avatar-wrapper"
            onClick={handleAvatarClick}
            title="Click to change avatar"
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleAvatarClick()}
          >
            <img
              src={avatarPreview}
              alt={user.fullName}
              className="profile-avatar-img"
              onError={() => setAvatarPreview(AVATAR_DEFAULT)}
            />
            {avatarUploading ? (
              <div className="profile-avatar-uploading">
                <i className="fa-regular fa-spinner-third fa-spin" style={{ color: 'var(--bs-primary, #4680ff)', fontSize: '1.5rem' }} />
              </div>
            ) : (
              <div className="profile-avatar-overlay">
                <i className="fa-regular fa-camera" />
                <span>Change</span>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        {/* Form body */}
        <div className="profile-form-body">

          <div className="profile-user-meta">
            <div className="profile-email">{user.email}</div>
            <div className={`profile-role-badge ${getRoleBadgeClass(user.role)}`}>
              <i className={user.role === 'ADMIN' ? 'fa-regular fa-shield-halved' : 'fa-regular fa-chalkboard-teacher'} />
              {user.role}
            </div>
          </div>

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

          <div className="pf-field">
            <label htmlFor="pf-fullname">Full Name</label>
            <input
              id="pf-fullname"
              type="text"
              className="form-control"
              placeholder="Your full name"
              value={fullName}
              maxLength={255}
              onChange={e => { setFullName(e.target.value); setSuccessMsg(''); setErrorMsg(''); }}
            />
          </div>

          <div className="pf-field">
            <label htmlFor="pf-phone">Phone Number</label>
            <input
              id="pf-phone"
              type="tel"
              className="form-control"
              placeholder="e.g. 0912 345 678"
              value={phone}
              maxLength={20}
              onChange={e => { setPhone(e.target.value); setSuccessMsg(''); setErrorMsg(''); }}
            />
          </div>

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
                : <><i className="fa-regular fa-floppy-disk" /> Save Changes</>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
export { ProfilePage as Component };
