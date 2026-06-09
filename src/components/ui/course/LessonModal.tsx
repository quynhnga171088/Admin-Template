import { useRef, useState } from 'react';
import '@/components/ui/course/Modal.scss';
import type { ILessonForm, ILessonModalState } from '@/types/types.ts';
import { resourceApi } from '@/lib/api/resource.api.ts';

const LessonModal = ({
  lessonModal,
  setLessonModal,
  lessonForm,
  setLessonForm,
  submitting,
  handleSaveLesson
}: {
  submitting: boolean;
  lessonForm: ILessonForm;
  setLessonForm: (lessonForm: ILessonForm) => void;
  lessonModal: ILessonModalState;
  setLessonModal: (lessonModal: ILessonModalState) => void;
  handleSaveLesson: (avatarUrl: string) => Promise<void>;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const existingAvatar = lessonModal.open && lessonModal.mode === 'edit' ? lessonModal.lesson.avatarUrl ?? '' : '';
  const [previewUrl, setPreviewUrl] = useState<string>(existingAvatar);
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
    if (!lessonForm.title.trim() || !lessonModal.open) return;

    let avatarUrl = existingAvatar;

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

    await handleSaveLesson(avatarUrl);
  };

  const isLoading = submitting || uploading;

  return (
    <div className="ccp-modal-overlay" onClick={() => setLessonModal({ open: false })}>
      <div className="ccp-modal ccp-modal--wide" onClick={e => e.stopPropagation()}>
        <div className="ccp-modal-header">
          <h3 className="ccp-modal-title">
            <i className="fa-regular fa-books" />
            {lessonModal.open && lessonModal.mode === 'create' ? ' New Lesson' : ' Edit Lesson'}
          </h3>
          <button className="ccp-modal-close" onClick={() => setLessonModal({ open: false })}>
            <i className="fa-regular fa-xmark" />
          </button>
        </div>
        <div className="ccp-modal-body">
          {/* Title */}
          <div className="can-field">
            <label className="form-label can-label">Lesson Title <span className="can-required">*</span></label>
            <input
              id="lesson-title-input"
              type="text"
              className="form-control"
              placeholder="e.g. Getting Started"
              value={lessonForm.title}
              onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
              maxLength={255}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="can-field">
            <label className="form-label can-label">Description</label>
            <textarea
              id="lesson-description-textarea"
              className="form-control can-textarea"
              placeholder="Brief description of this lesson (optional)..."
              rows={5}
              value={lessonForm.description}
              onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })}
            />
          </div>

          {/* Avatar Upload (optional) */}
          <div className="can-field">
            <label className="form-label can-label">
              Cover Image <span className="can-optional">(optional)</span>
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
              id="lesson-avatar-file-input"
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
          <button className="btn btn-light" onClick={() => setLessonModal({ open: false })}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!lessonForm.title.trim() || isLoading}>
            {isLoading
              ? <><i className="fa-regular fa-spinner-third fa-spin" /> {uploading ? 'Uploading...' : 'Saving...'}</>
              : <><i className="fa-regular fa-floppy-disk" /> Save</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonModal;
