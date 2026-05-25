import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chaptersApi, lessonsApi } from '@/lib/api/chaptersApi.ts';
import { getCourseDetail } from '@/pages/courses/courses.services.ts';
import { queryClient } from '@/lib/queryClient.ts';
import { queryKeys } from '@/lib/queryKeys.ts';
import type {
  IChapter,
  ILesson,
  ILessonType,
  ILessonStatus,
  IVideoSourceType,
  ILessonModalState,
  IChapterModalState
} from '@/types/types.ts';
import { SCREENS_PATH } from '@/config/constant.ts';
import './CourseChaptersPage.scss';

// ─── Component ────────────────────────────────────────────────────────────────

const CourseChaptersPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);

  const [courseTitle, setCourseTitle] = useState('');
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());

  /* Modal states */
  const [chapterModal, setChapterModal] = useState<IChapterModalState>({ open: false });
  const [lessonModal, setLessonModal] = useState<ILessonModalState>({ open: false });

  /* Form states */
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDescription, setChapterDescription] = useState('');
  const [chapterAvatarUrl, setChapterAvatarUrl] = useState('');
  const [lessonForm, setLessonForm] = useState({
    title: '',
    type: 'VIDEO' as ILessonType,
    status: 'PUBLISHED' as ILessonStatus,
    description: '',
    videoSourceType: 'YOUTUBE' as IVideoSourceType,
    videoUrl: '',
    textContent: ''
  });
  const [submitting, setSubmitting] = useState(false);

  /* Load data */

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [courseDetail, chaptersData] = await Promise.all([
        getCourseDetail(courseId),
        queryClient.fetchQuery({
          queryKey: queryKeys.chapters.byCourse(courseId),
          queryFn: () => chaptersApi.list(courseId).then(r => r.data)
        })
      ]);
      setCourseTitle(courseDetail.title);
      setChapters(chaptersData);
      // Expand all chapters by default
      setExpandedChapters(new Set(chaptersData.map((c: IChapter) => c.id)));
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  /* Chapter actions */

  const openCreateChapter = () => {
    setChapterTitle('');
    setChapterDescription('');
    setChapterAvatarUrl('');
    setChapterModal({ open: true, mode: 'create' });
  };

  const openEditChapter = (chapter: IChapter) => {
    setChapterTitle(chapter.title);
    setChapterDescription(chapter.description ?? '');
    setChapterAvatarUrl(chapter.avatarUrl ?? '');
    setChapterModal({ open: true, mode: 'edit', chapter });
  };

  const handleSaveChapter = async () => {
    if (!chapterTitle.trim()) return;
    setSubmitting(true);
    try {
      if (chapterModal.open && chapterModal.mode === 'create') {
        await chaptersApi.create(courseId, {
          title: chapterTitle.trim(),
          description: chapterDescription.trim() || undefined,
          avatarUrl: chapterAvatarUrl.trim() || undefined
        });
      } else if (chapterModal.open && chapterModal.mode === 'edit') {
        await chaptersApi.update(courseId, chapterModal.chapter.id, {
          title: chapterTitle.trim(),
          description: chapterDescription.trim() || undefined,
          avatarUrl: chapterAvatarUrl.trim() || undefined
        });
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.chapters.byCourse(courseId) });
      setChapterModal({ open: false });
      loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteChapter = async (chapterId: number) => {
    if (!confirm('Delete this chapter and all its lessons?')) return;
    await chaptersApi.delete(courseId, chapterId);
    await queryClient.invalidateQueries({ queryKey: queryKeys.chapters.byCourse(courseId) });
    loadData();
  };

  const handleReorderChapter = async (chapterId: number, direction: 'up' | 'down') => {
    const idx = chapters.findIndex(c => c.id === chapterId);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === chapters.length - 1) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const items = chapters.map((c, i) => {
      if (i === idx) return { chapterId: c.id, orderIndex: chapters[swapIdx].orderIndex };
      if (i === swapIdx) return { chapterId: c.id, orderIndex: chapters[idx].orderIndex };
      return { chapterId: c.id, orderIndex: c.orderIndex };
    });
    await chaptersApi.reorder(courseId, { items });
    await queryClient.invalidateQueries({ queryKey: queryKeys.chapters.byCourse(courseId) });
    loadData();
  };

  /* Lesson actions */

  const openCreateLesson = (chapterId: number) => {
    setLessonForm({ title: '', type: 'VIDEO', status: 'PUBLISHED', description: '', videoSourceType: 'YOUTUBE', videoUrl: '', textContent: '' });
    setLessonModal({ open: true, mode: 'create', chapterId });
  };

  const openEditLesson = (chapterId: number, lesson: ILesson) => {
    setLessonForm({
      title: lesson.title,
      type: lesson.type,
      status: lesson.status,
      description: lesson.description ?? '',
      videoSourceType: lesson.videoSourceType ?? 'YOUTUBE',
      videoUrl: lesson.videoUrl ?? '',
      textContent: lesson.textContent ?? ''
    });
    setLessonModal({ open: true, mode: 'edit', chapterId, lesson });
  };

  const handleSaveLesson = async () => {
    if (!lessonForm.title.trim() || !lessonModal.open) return;
    setSubmitting(true);
    try {
      const payload = {
        title: lessonForm.title.trim(),
        type: lessonForm.type,
        status: lessonForm.status,
        description: lessonForm.description || undefined,
        ...(lessonForm.type === 'VIDEO'
          ? { videoSourceType: lessonForm.videoSourceType, videoUrl: lessonForm.videoUrl || undefined }
          : { textContent: lessonForm.textContent || undefined })
      };

      if (lessonModal.mode === 'create') {
        await lessonsApi.create(courseId, lessonModal.chapterId, payload);
      } else {
        await lessonsApi.update(courseId, lessonModal.chapterId, lessonModal.lesson.id, payload);
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.chapters.byCourse(courseId) });
      setLessonModal({ open: false });
      loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLesson = async (chapterId: number, lessonId: number) => {
    if (!confirm('Delete this lesson?')) return;
    await lessonsApi.delete(courseId, chapterId, lessonId);
    await queryClient.invalidateQueries({ queryKey: queryKeys.chapters.byCourse(courseId) });
    void loadData();
  };

  const handleReorderLesson = async (chapterId: number, lessonId: number, direction: 'up' | 'down') => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;
    const lessons = chapter.lessons;
    const idx = lessons.findIndex(l => l.id === lessonId);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === lessons.length - 1) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const items = lessons.map((l, i) => {
      if (i === idx) return { lessonId: l.id, orderIndex: lessons[swapIdx].orderIndex };
      if (i === swapIdx) return { lessonId: l.id, orderIndex: lessons[idx].orderIndex };
      return { lessonId: l.id, orderIndex: l.orderIndex };
    });
    await lessonsApi.reorder(courseId, chapterId, { items });
    await queryClient.invalidateQueries({ queryKey: queryKeys.chapters.byCourse(courseId) });
    loadData().then(() => {});
  };

  /* Helpers */

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      next.has(chapterId) ? next.delete(chapterId) : next.add(chapterId);
      return next;
    });
  };

  const lessonTypeIcon = (type: ILessonType) =>
    type === 'VIDEO' ? 'fa-regular fa-circle-play' : 'fa-regular fa-file-lines';

  /* Render */

  if (loading) {
    return (
      <div className="ccp-loading">
        <i className="fa-regular fa-spinner-third fa-spin fa-2x" />
        <p>Loading chapters...</p>
      </div>
    );
  }

  return (
    <div className="ccp-page">
      {/* ── Page Header ── */}
      <div className="card ccp-header-card">
        <div className="card-body ccp-header-body">
          <div className="ccp-breadcrumb">
            <button className="btn btn-sm btn-light ccp-back-btn" onClick={() => navigate(SCREENS_PATH.COURSE_LIST)}>
              <i className="fa-regular fa-arrow-left" /> Courses
            </button>
            <i className="fa-regular fa-chevron-right ccp-breadcrumb-sep" />
            <span className="ccp-breadcrumb-title">{courseTitle}</span>
          </div>
          <div className="ccp-header-actions">
            <h1 className="ccp-page-title">
              <i className="fa-regular fa-layer-group" /> Chapters & Lessons
            </h1>
            <button className="btn btn-sm btn-primary" onClick={openCreateChapter}>
              <i className="fa-regular fa-plus" /> Add Chapter
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {chapters.length === 0 && (
        <div className="card ccp-empty">
          <div className="card-body ccp-empty-body">
            <i className="fa-regular fa-folder-open ccp-empty-icon" />
            <p className="ccp-empty-text">No chapters yet. Start by adding one!</p>
            <button className="btn btn-primary" onClick={openCreateChapter}>
              <i className="fa-regular fa-plus" /> Add First Chapter
            </button>
          </div>
        </div>
      )}

      {/* Chapter List */}
      <div className="ccp-chapters">
        {chapters.map((chapter, chIdx) => {
          const isExpanded = expandedChapters.has(chapter.id);
          return (
            <div key={chapter.id} className="card ccp-chapter-card">
              {/* Chapter Header */}
              <div className="ccp-chapter-header" onClick={() => toggleChapter(chapter.id)}>
                <div className="ccp-chapter-left">
                  <i className={`fa-regular ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-right'} ccp-chevron`} />
                  <span className="ccp-chapter-index">{chIdx + 1}</span>
                  {chapter.avatarUrl && (
                    <img src={chapter.avatarUrl} alt="" className="ccp-chapter-avatar" />
                  )}
                  <span className="ccp-chapter-title">{chapter.title}</span>
                  {chapter.description && (
                    <span className="ccp-chapter-desc">{chapter.description}</span>
                  )}
                  <span className="ccp-lesson-count">
                    {chapter.lessons.length} lesson{chapter.lessons.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="ccp-chapter-actions" onClick={e => e.stopPropagation()}>
                  <button className="btn btn-xs btn-light ccp-order-btn" title="Move up" onClick={() => handleReorderChapter(chapter.id, 'up')} disabled={chIdx === 0}>
                    <i className="fa-regular fa-chevron-up" />
                  </button>
                  <button className="btn btn-xs btn-light ccp-order-btn"
                    title="Move down"
                    onClick={() => handleReorderChapter(chapter.id, 'down')}
                    disabled={chIdx === chapters.length - 1}
                  >
                    <i className="fa-regular fa-chevron-down" />
                  </button>
                  <button className="btn btn-xs btn-light-warning btn-icon" title="Edit chapter" onClick={() => openEditChapter(chapter)}>
                    <i className="fa-thin fa-pen" />
                  </button>
                  <button className="btn btn-xs btn-light-danger btn-icon" title="Delete chapter" onClick={() => handleDeleteChapter(chapter.id)}>
                    <i className="fa-thin fa-trash" />
                  </button>
                </div>
              </div>

              {/* Lesson List */}
              {isExpanded && (
                <div className="ccp-lessons">
                  {chapter.lessons.length === 0 && (
                    <div className="ccp-lessons-empty">
                      <i className="fa-regular fa-file-slash" /> No lessons yet
                    </div>
                  )}
                  {chapter.lessons.map((lesson, lIdx) => (
                    <div key={lesson.id} className="ccp-lesson-row">
                      <div className="ccp-lesson-left">
                        <i className={`${lessonTypeIcon(lesson.type)} ccp-lesson-type-icon`} />
                        <span className="ccp-lesson-index">{lIdx + 1}.</span>
                        <span className="ccp-lesson-title">{lesson.title}</span>
                        <span className={`ccp-lesson-status ccp-lesson-status--${lesson.status.toLowerCase()}`}>
                          {lesson.status}
                        </span>
                        <span className="ccp-lesson-type-badge">{lesson.type}</span>
                      </div>
                      <div className="ccp-lesson-actions">
                        <button className="btn btn-xs btn-light ccp-order-btn"
                          title="Move up"
                          onClick={() => handleReorderLesson(chapter.id, lesson.id, 'up')}
                          disabled={lIdx === 0}
                        >
                          <i className="fa-regular fa-chevron-up" />
                        </button>
                        <button className="btn btn-xs btn-light ccp-order-btn"
                          title="Move down"
                          onClick={() => handleReorderLesson(chapter.id, lesson.id, 'down')}
                          disabled={lIdx === chapter.lessons.length - 1}
                        >
                          <i className="fa-regular fa-chevron-down" />
                        </button>
                        <button className="btn btn-xs btn-light-warning btn-icon" title="Edit lesson" onClick={() => openEditLesson(chapter.id, lesson)}>
                          <i className="fa-thin fa-pen" />
                        </button>
                        <button className="btn btn-xs btn-light-danger btn-icon" title="Delete lesson" onClick={() => handleDeleteLesson(chapter.id, lesson.id)}>
                          <i className="fa-thin fa-trash" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Lesson Button */}
                  <div className="ccp-add-lesson-row">
                    <button className="btn btn-sm btn-light-primary ccp-add-lesson-btn" onClick={() => openCreateLesson(chapter.id)}>
                      <i className="fa-regular fa-plus" /> Add Lesson
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chapter Modal */}
      {chapterModal.open && (
        <div className="ccp-modal-overlay" onClick={() => setChapterModal({ open: false })}>
          <div className="ccp-modal ccp-modal--wide" onClick={e => e.stopPropagation()}>
            <div className="ccp-modal-header">
              <h3 className="ccp-modal-title">
                <i className="fa-regular fa-layer-group" />
                {chapterModal.mode === 'create' ? ' New Chapter' : ' Edit Chapter'}
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
                  value={chapterTitle}
                  onChange={e => setChapterTitle(e.target.value)}
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
                  rows={3}
                  value={chapterDescription}
                  onChange={e => setChapterDescription(e.target.value)}
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
                  value={chapterAvatarUrl}
                  onChange={e => setChapterAvatarUrl(e.target.value)}
                />
                {chapterAvatarUrl.trim() && (
                  <div className="ccp-avatar-preview">
                    <img src={chapterAvatarUrl} alt="Chapter avatar preview" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
            </div>
            <div className="ccp-modal-footer">
              <button className="btn btn-light" onClick={() => setChapterModal({ open: false })}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveChapter} disabled={!chapterTitle.trim() || submitting}>
                {submitting ? <><i className="fa-regular fa-spinner-third fa-spin" /> Saving...</> : <><i className="fa-regular fa-floppy-disk" /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {lessonModal.open && (
        <div className="ccp-modal-overlay" onClick={() => setLessonModal({ open: false })}>
          <div className="ccp-modal ccp-modal--wide" onClick={e => e.stopPropagation()}>
            <div className="ccp-modal-header">
              <h3 className="ccp-modal-title">
                <i className="fa-regular fa-file-video" />
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
                  onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))}
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
                    onChange={e => setLessonForm(f => ({ ...f, type: e.target.value as ILessonType }))}
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
                    onChange={e => setLessonForm(f => ({ ...f, status: e.target.value as ILessonStatus }))}
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
                  rows={2}
                  value={lessonForm.description}
                  onChange={e => setLessonForm(f => ({ ...f, description: e.target.value }))}
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
                      onChange={e => setLessonForm(f => ({ ...f, videoSourceType: e.target.value as IVideoSourceType }))}
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
                        onChange={e => setLessonForm(f => ({ ...f, videoUrl: e.target.value }))}
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
                    onChange={e => setLessonForm(f => ({ ...f, textContent: e.target.value }))}
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
        </div>
      )}
    </div>
  );
};

export default CourseChaptersPage;
export { CourseChaptersPage as Component };
