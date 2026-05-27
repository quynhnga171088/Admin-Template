import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sectionsApi, chaptersApi } from '@/lib/api/chapters.api';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { SCREENS_PATH } from '@/config/constant';
import type { ISection, ISectionType, ISectionStatus } from '@/types/types';
import '@/pages/courses/chapter/lesson/SectionPage.scss';

const SectionEditPage = () => {
  const navigate = useNavigate();
  const { id, chapterId, lessonId, sectionId } = useParams<{
    id: string; chapterId: string; lessonId: string; sectionId: string;
  }>();
  const courseId = Number(id);
  const chapterIdNum = Number(chapterId);
  const lessonIdNum = Number(lessonId);
  const sectionIdNum = Number(sectionId);

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ISectionType>('VIDEO');
  const [status, setStatus] = useState<ISectionStatus>('PUBLISHED');
  const [videoUrl, setVideoUrl] = useState('');
  const [textContent, setTextContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  /* Load existing section data from nested chapters response */
  useEffect(() => {
    const fetchSection = async () => {
      setLoading(true);
      try {
        const chaptersData = await queryClient.fetchQuery({
          queryKey: queryKeys.chapters.byCourse(courseId),
          queryFn: () => chaptersApi.list(courseId).then(r => r.data)
        });
        let found: ISection | undefined;
        for (const chapter of chaptersData) {
          if (chapter.id === chapterIdNum) {
            for (const lesson of chapter.lessons) {
              if (lesson.id === lessonIdNum) {
                found = lesson.sections.find(s => s.id === sectionIdNum);
                break;
              }
            }
          }
        }
        if (found) {
          setTitle(found.title);
          setDescription(found.description ?? '');
          setType(found.type);
          setStatus(found.status);
          setVideoUrl(found.videoUrl ?? '');
          setTextContent(found.textContent ?? '');
        } else {
          setError('Không tìm thấy section.');
        }
      } finally {
        setLoading(false);
      }
    };
    void fetchSection();
  }, [courseId, chapterIdNum, lessonIdNum, sectionIdNum]);

  const handleSave = async () => {
    if (!title.trim()) return;
    if (type === 'VIDEO' && !videoUrl.trim()) {
      setError('Video URL là bắt buộc cho loại VIDEO.');
      return;
    }
    if (type === 'TEXT' && !textContent.trim()) {
      setError('Nội dung là bắt buộc cho loại TEXT.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await sectionsApi.update(courseId, chapterIdNum, lessonIdNum, sectionIdNum, {
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        status,
        videoUrl: type === 'VIDEO' ? videoUrl.trim() : undefined,
        textContent: type === 'TEXT' ? textContent.trim() : undefined
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.chapters.byCourse(courseId) });
      navigate(SCREENS_PATH.COURSE_CHAPTERS(courseId));
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="sp-loading">
        <i className="fa-regular fa-spinner-third fa-spin fa-2x" />
        <p>Loading section...</p>
      </div>
    );
  }

  return (
    <div className="sp-page">
      {/* Header */}
      <div className="card mb-0!">
        <div className="card-header">
          <div className="card-header-title">
            <i className="fa-regular fa-pen-to-square" />
            <span className="ml-2!">Edit Section</span>
          </div>
        </div>
        <div className="card-body sp-breadcrumb">
          <button className="btn btn-sm btn-light" onClick={() => navigate(SCREENS_PATH.COURSE_CHAPTERS(courseId))}>
            <i className="fa-regular fa-arrow-left" /> Back to Chapters
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <div className="card-body sp-form">
          {/* Title */}
          <div className="sp-field">
            <label className="form-label sp-label">
              Section Title <span className="sp-required">*</span>
            </label>
            <input
              id="section-title-input"
              type="text"
              className="form-control"
              placeholder="e.g. Introduction Video"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={255}
              autoFocus
            />
          </div>

          {/* Type + Status row */}
          <div className="sp-row">
            <div className="sp-field">
              <label className="form-label sp-label">
                Type <span className="sp-required">*</span>
              </label>
              <select
                id="section-type-select"
                className="form-select"
                value={type}
                onChange={e => { setType(e.target.value as ISectionType); setError(''); }}
              >
                <option value="VIDEO">🎬 Video</option>
                <option value="TEXT">📄 Text / Article</option>
              </select>
            </div>
            <div className="sp-field">
              <label className="form-label sp-label">Status</label>
              <select
                id="section-status-select"
                className="form-select"
                value={status}
                onChange={e => setStatus(e.target.value as ISectionStatus)}
              >
                <option value="PUBLISHED">✅ Published</option>
                <option value="DRAFT">📝 Draft</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="sp-field">
            <label className="form-label sp-label">Description</label>
            <textarea
              id="section-description-textarea"
              className="form-control sp-textarea"
              placeholder="Brief description of this section (optional)..."
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* VIDEO content */}
          {type === 'VIDEO' && (
            <div className="sp-field">
              <label className="form-label sp-label">
                Video URL <span className="sp-required">*</span>
              </label>
              <input
                id="section-video-url-input"
                type="url"
                className="form-control"
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
              />
              <small className="sp-hint">YouTube, Vimeo, hoặc bất kỳ URL video nào.</small>
            </div>
          )}

          {/* TEXT content */}
          {type === 'TEXT' && (
            <div className="sp-field">
              <label className="form-label sp-label">
                Content <span className="sp-required">*</span>
              </label>
              <textarea
                id="section-text-content-textarea"
                className="form-control sp-textarea sp-textarea--tall"
                placeholder="Viết nội dung bài học tại đây..."
                rows={16}
                value={textContent}
                onChange={e => setTextContent(e.target.value)}
              />
              <small className="sp-hint">Hỗ trợ văn bản thuần. Rich text editor sẽ được tích hợp sau.</small>
            </div>
          )}

          {error && <div className="sp-error"><i className="fa-regular fa-circle-exclamation" /> {error}</div>}

          {/* Actions */}
          <div className="sp-actions">
            <button className="btn btn-light" onClick={() => navigate(SCREENS_PATH.COURSE_CHAPTERS(courseId))}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!title.trim() || submitting}
            >
              {submitting
                ? <><i className="fa-regular fa-spinner-third fa-spin" /> Saving...</>
                : <><i className="fa-regular fa-floppy-disk" /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionEditPage;
export { SectionEditPage as Component };
