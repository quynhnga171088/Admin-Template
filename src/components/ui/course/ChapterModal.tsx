import type { IChapterModalState } from '@/types/types.ts';
import '@/components/ui/course/Modal.scss';

const ChapterModal = ({
  mode,
  title,
  setTitle,
  avatarUrl,
  setAvatarUrl,
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
  avatarUrl: string;
  setAvatarUrl: (avatarUrl: string) => void;
  setChapterModal: (open: IChapterModalState) => void;
  submitting: boolean;
  handleSaveChapter: () => Promise<void>;
}) => (
  <div className="ccp-modal-overlay" onClick={() => setChapterModal({ open: false })}>
    <div className="ccp-modal ccp-modal--wide" onClick={e => e.stopPropagation()}>
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
            rows={10}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        {/* Avatar URL */}
        <div className="can-field">
          <label className="form-label can-label">Avatar / Cover Image URL</label>
          <input
            id="chapter-avatar-url-input"
            type="url"
            className="form-control"
            placeholder="https://example.com/image.jpg (optional)"
            value={avatarUrl}
            onChange={e => setAvatarUrl(e.target.value)}
          />
          {avatarUrl.trim() &&
            <div className="ccp-avatar-preview">
              <img src={avatarUrl} alt="Chapter avatar preview" onError={e => (e.currentTarget.style.display = 'none')} />
            </div>}
        </div>
      </div>
      <div className="ccp-modal-footer">
        <button className="btn btn-light" onClick={() => setChapterModal({ open: false })}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSaveChapter} disabled={!title.trim() || submitting}>
          {submitting ? <><i className="fa-regular fa-spinner-third fa-spin" /> Saving...</> : <><i className="fa-regular fa-floppy-disk" /> Save</>}
        </button>
      </div>
    </div>
  </div>);

export default ChapterModal;
