import '@/components/ui/course/Modal.scss';
import type { ILessonForm, ILessonModalState, ILessonStatus, ILessonType, IVideoSourceType } from '@/types/types.ts';

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
  handleSaveLesson: () => Promise<void>;
}) => (
  <div className="ccp-modal-overlay" onClick={() => setLessonModal({ open: false })}>
    <div className="ccp-modal ccp-modal--wide" onClick={e => e.stopPropagation()}>
      <div className="ccp-modal-header">
        <h3 className="ccp-modal-title">
          <i className="fa-regular fa-books" />
          {lessonModal.mode === 'create' ? ' New Lesson' : ' Edit Lesson'}
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

        {/* Type + Status row */}
        <div className="ccp-form-row">
          <div className="can-field">
            <label className="form-label can-label">Type <span className="can-required">*</span></label>
            <select
              id="lesson-type-select"
              className="form-select"
              value={lessonForm.type}
              onChange={e => setLessonForm({ ...lessonForm, type: e.target.value as ILessonType })}
            >
              <option value="VIDEO">🎬 Video</option>
              <option value="TEXT">📄 Text</option>
            </select>
          </div>
          <div className="can-field">
            <label className="form-label can-label">Status</label>
            <select
              id="lesson-status-select"
              className="form-select"
              value={lessonForm.status}
              onChange={e => setLessonForm({ ...lessonForm, status: e.target.value as ILessonStatus })}
            >
              <option value="PUBLISHED">✅ Published</option>
              <option value="DRAFT">📝 Draft</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="can-field">
          <label className="form-label can-label">Description</label>
          <textarea
            id="lesson-description-textarea"
            className="form-control can-textarea"
            placeholder="Brief description of this lesson..."
            rows={5}
            value={lessonForm.description}
            onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })}
          />
        </div>

        {/* VIDEO fields */}
        {lessonForm.type === 'VIDEO' && (
          <>
            <div className="can-field">
              <label className="form-label can-label">Video Source</label>
              <select
                id="lesson-video-source-select"
                className="form-select"
                value={lessonForm.videoSourceType}
                onChange={e => setLessonForm({ ...lessonForm, videoSourceType: e.target.value as IVideoSourceType })}
              >
                <option value="YOUTUBE">▶ YouTube</option>
                <option value="VIMEO">🎞 Vimeo</option>
                <option value="DRIVE">📁 Google Drive</option>
                <option value="UPLOAD">⬆ Upload</option>
              </select>
            </div>
            {lessonForm.videoSourceType !== 'UPLOAD' && (
              <div className="can-field">
                <label className="form-label can-label">Video URL <span className="can-required">*</span></label>
                <input
                  id="lesson-video-url-input"
                  type="url"
                  className="form-control"
                  placeholder="https://..."
                  value={lessonForm.videoUrl}
                  onChange={e => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                />
              </div>
            )}
            {lessonForm.videoSourceType === 'UPLOAD' && (
              <div className="can-field ccp-upload-hint">
                <i className="fa-regular fa-circle-info" /> Use the <strong>Upload</strong> API to get a <code>fileKey</code>, then edit the lesson to attach it.
              </div>
            )}
          </>
        )}

        {/* TEXT fields */}
        {lessonForm.type === 'TEXT' && (
          <div className="can-field">
            <label className="form-label can-label">Content</label>
            <textarea
              id="lesson-text-content-textarea"
              className="form-control can-textarea can-textarea--tall"
              placeholder="Write lesson content here..."
              rows={6}
              value={lessonForm.textContent}
              onChange={e => setLessonForm({ ...lessonForm, textContent: e.target.value })}
            />
          </div>
        )}
      </div>
      <div className="ccp-modal-footer">
        <button className="btn btn-light" onClick={() => setLessonModal({ open: false })}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSaveLesson} disabled={!lessonForm.title.trim() || submitting}>
          {submitting ? <><i className="fa-regular fa-spinner-third fa-spin" /> Saving...</> : <><i className="fa-regular fa-floppy-disk" /> Save</>}
        </button>
      </div>
    </div>
  </div>);

export default LessonModal;
