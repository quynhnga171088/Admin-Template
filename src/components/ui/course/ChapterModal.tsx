import { useRef, useState } from 'react';
import type { IChapterModalState } from '@/types/types.ts';
import { resourceApi } from '@/lib/api/resource.api.ts';
import '@/components/ui/course/Modal.scss';

const ChapterModal = ({
  mode,
  title,
  setTitle,
  existingAvatarUrl,
  description,
  setDescription,
  submitting,
  setChapterModal,
  handleSaveChapter
}: {
  mode: string;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  existingAvatarUrl?: string;
  setChapterModal: (open: IChapterModalState) => void;
  submitting: boolean;
  handleSaveChapter: (avatarUrl: string) => Promise<void>;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(existingAvatarUrl ?? '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setUploadError('');
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    let avatarUrl = existingAvatarUrl ?? '';

    // If user picked a new file — upload first
    if (selectedFile) {
      setUploading(true);
      try {
        const res = await resourceApi.uploadImg(selectedFile);
        avatarUrl = res.data.fileUrl;
      } catch {
        setUploadError('Upload ảnh thất bại. Vui lòng thử lại.');
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    // Create mode requires an image
    if (mode === 'create' && !avatarUrl) {
      setUploadError('Vui lòng chọn ảnh bìa cho chương.');
      return;
    }

    await handleSaveChapter(avatarUrl);
  };

  const isLoading = submitting || uploading;
  const canSave = !!title.trim() && (mode === 'edit' || !!previewUrl) && !isLoading;

  return (
    <div className="ccp-modal-overlay">
      <div className="ccp-modal ccp-modal--wide">
        <div className="ccp-modal-header">
          <h3 className="ccp-modal-title">
            <i className="fa-regular fa-layer-group" />
            {mode === 'create' ? ' New Chapter' : ' Edit Chapter'}
          </h3>
          <button className="ccp-modal-close" onClick={() => setChapterModal({ open: false })}>
            <i className="fa-regular fa-xmark" />
          </button>
        </div>
        <div className="ccp-modal-body">
          {/* Title */}
          <div className="can-field">
            <label className="form-label can-label">Chapter Title <span className="can-required">*</span></label>
            <input
              id="chapter-title-input"
              type="text"
              className="form-control"
              placeholder="e.g. Introduction to the Course"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={255}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="can-field">
            <label className="form-label can-label">Description</label>
            <textarea
              id="chapter-description-textarea"
              className="form-control can-textarea"
              placeholder="Brief description of this chapter (optional)..."
              rows={5}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Avatar Upload */}
          <div className="can-field">
            <label className="form-label can-label">
              Cover Image {mode === 'create' && <span className="can-required">*</span>}
              {mode === 'edit' && <span className="can-optional"> (optional — giữ nguyên nếu không đổi)</span>}
            </label>

            <div className="ccp-upload-zone" onClick={() => fileInputRef.current?.click()}>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="ccp-upload-preview-img" />
              ) : (
                <div className="ccp-upload-placeholder">
                  <i className="fa-regular fa-image fa-2x" />
                  <span>Nhấn để chọn ảnh</span>
                  <small>JPG, PNG, WEBP — tối đa 5MB</small>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              id="chapter-avatar-file-input"
              type="file"
              accept="image/*"
              className="ccp-file-input-hidden"
              onChange={handleFileChange}
            />

            {previewUrl && (
              <button
                type="button"
                className="btn btn-sm btn-light mt-1!"
                onClick={() => { setPreviewUrl(''); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
              >
                <i className="fa-regular fa-trash" /> Xóa ảnh
              </button>
            )}

            {uploadError && <div className="ccp-upload-error">{uploadError}</div>}
          </div>
        </div>

        <div className="ccp-modal-footer">
          <button className="btn btn-light" onClick={() => setChapterModal({ open: false })}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!canSave}>
            {isLoading
              ? <><i className="fa-regular fa-spinner-third fa-spin" /> {uploading ? 'Uploading...' : 'Saving...'}</>
              : <><i className="fa-regular fa-floppy-disk" /> Save</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterModal;
