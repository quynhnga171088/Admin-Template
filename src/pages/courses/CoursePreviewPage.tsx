import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chaptersApi } from '@/lib/api/chapters.api';
import { getCourseDetail } from '@/pages/courses/courses.services';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { SCREENS_PATH } from '@/config/constant';
import type { IChapter, ISection, ICourseItem } from '@/types/types';
import '@/pages/courses/CoursePreviewPage.scss';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EXTERNAL_VIDEO_HOSTS = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com'];

const isExternalVideo = (url: string): boolean => {
  try {
    const hostname = new URL(url).hostname;
    return EXTERNAL_VIDEO_HOSTS.some(h => hostname.includes(h));
  } catch {
    return false;
  }
};

const buildEmbedUrl = (url: string): string => {
  try {
    const u = new URL(url);
    // YouTube watch URL → embed
    if (u.hostname.includes('youtube.com') && u.pathname === '/watch') {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    // youtu.be short URL → embed
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.replace('/', '');
      return `https://player.vimeo.com/video/${id}`;
    }
  } catch { /* ignore */ }
  return url;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface VideoContentProps { url: string }

const VideoContent = ({ url }: VideoContentProps) => {
  if (!url) return null;

  return (
    <div className="cpv-video-wrapper">
      {isExternalVideo(url) ? (
        <iframe
          src={buildEmbedUrl(url)}
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video controls src={url} />
      )}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const CoursePreviewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);

  const [loading, setLoading] = useState(true);
  const [courseDetail, setCourseDetail] = useState<ICourseItem | null>(null);
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [activeSection, setActiveSection] = useState<ISection | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(new Set());

  // ── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [detail, chaptersData] = await Promise.all([
          getCourseDetail(courseId),
          queryClient.fetchQuery({
            queryKey: queryKeys.chapters.byCourse(courseId),
            queryFn: () => chaptersApi.list(courseId).then(r => r.data)
          })
        ]);

        setCourseDetail(detail);
        setChapters(chaptersData);

        // Expand all chapters and their lessons by default
        setExpandedChapters(new Set(chaptersData.map((c: IChapter) => c.id)));
        const lessonIds = chaptersData.flatMap((c: IChapter) => c.lessons.map(l => l.id));
        setExpandedLessons(new Set(lessonIds));

        // Auto-select first section
        for (const chapter of chaptersData) {
          for (const lesson of chapter.lessons) {
            if (lesson.sections.length > 0) {
              setActiveSection(lesson.sections[0]);
              return;
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [courseId]);

  // ── Toggle helpers ─────────────────────────────────────────────────────────
  const toggleChapter = useCallback((chapterId: number) => {
    setExpandedChapters(prev => {
      const next = new Set(prev);
      next.has(chapterId) ? next.delete(chapterId) : next.add(chapterId);
      return next;
    });
  }, []);

  const toggleLesson = useCallback((lessonId: number) => {
    setExpandedLessons(prev => {
      const next = new Set(prev);
      next.has(lessonId) ? next.delete(lessonId) : next.add(lessonId);
      return next;
    });
  }, []);

  // ── Status badge ───────────────────────────────────────────────────────────
  const statusClass = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'PUBLISHED': return 'cpv-status-badge--published';
      case 'DRAFT':     return 'cpv-status-badge--draft';
      case 'ARCHIVED':  return 'cpv-status-badge--archived';
      default:          return 'cpv-status-badge--draft';
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="cpv-loading">
        <i className="fa-regular fa-spinner-third fa-spin fa-2x" />
        <p>Loading preview...</p>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="cpv-page">

      {/* ── Header ── */}
      <div className="card mb-0!">
        <div className="card-body">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-8">
              <div className="cpv-header-meta">
                <div className="cpv-course-title">{courseDetail?.title ?? '—'}</div>
                {courseDetail?.shortDescription && (
                  <div className="cpv-course-desc">{courseDetail.shortDescription}</div>
                )}
              </div>
            </div>
            <div className="col-span-4 flex items-center justify-end gap-2">
              <span className={`cpv-status-badge ${statusClass(courseDetail?.status)}`}>
                {courseDetail?.status}
              </span>
              <button
                className="btn btn-sm btn-light"
                onClick={() => navigate(SCREENS_PATH.COURSE_CHAPTERS(courseId))}
              >
                <i className="fa-regular fa-arrow-left" /> Back
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="cpv-layout">

        {/* ── Sidebar ── */}
        <div className="cpv-sidebar">
          <div className="cpv-sidebar-header">
            <i className="fa-regular fa-list-ul" /> Nội dung khoá học
          </div>

          {chapters.length === 0 && (
            <div className="cpv-no-lessons" style={{ padding: '1rem' }}>
              Chưa có nội dung nào.
            </div>
          )}

          {chapters.map((chapter, chIdx) => {
            const isChOpen = expandedChapters.has(chapter.id);
            return (
              <div key={chapter.id} className="cpv-chapter">
                {/* Chapter header */}
                <div className="cpv-chapter-header" onClick={() => toggleChapter(chapter.id)}>
                  <i className={`fa-regular fa-chevron-right cpv-chapter-chevron${isChOpen ? ' cpv-chapter-chevron--open' : ''}`} />
                  <span className="cpv-chapter-num">{chIdx + 1}</span>
                  <span className="cpv-chapter-title">{chapter.title}</span>
                  <span className="cpv-chapter-count">
                    {chapter.lessons.length} bài
                  </span>
                </div>

                {/* Lessons */}
                {isChOpen && (
                  <div className="cpv-lessons">
                    {chapter.lessons.length === 0 && (
                      <div className="cpv-no-lessons">Chưa có bài học.</div>
                    )}

                    {chapter.lessons.map((lesson, lIdx) => {
                      const isLessonOpen = expandedLessons.has(lesson.id);
                      return (
                        <div key={lesson.id} className="cpv-lesson">
                          {/* Lesson header */}
                          <div className="cpv-lesson-header" onClick={() => toggleLesson(lesson.id)}>
                            <i className={`fa-regular fa-chevron-right cpv-chapter-chevron${isLessonOpen ? ' cpv-chapter-chevron--open' : ''}`} />
                            <span className="cpv-lesson-num">{chIdx + 1}.{lIdx + 1}</span>
                            <span className="cpv-lesson-title">{lesson.title}</span>
                            <span className="cpv-lesson-count">
                              {lesson.sections.length} section
                            </span>
                          </div>

                          {/* Sections */}
                          {isLessonOpen && (
                            <div className="cpv-sections">
                              {lesson.sections.length === 0 && (
                                <div className="cpv-no-sections">Chưa có section.</div>
                              )}

                              {lesson.sections.map(section => {
                                const isActive = activeSection?.id === section.id;
                                const isVideo = section.type === 'VIDEO';
                                return (
                                  <div
                                    key={section.id}
                                    className={`cpv-section-item${isActive ? ' cpv-section-item--active' : ''}`}
                                    onClick={() => setActiveSection(section)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={e => e.key === 'Enter' && setActiveSection(section)}
                                  >
                                    <i className={
                                      `${isVideo ?
                                       'fa-regular fa-circle-play cpv-section-type-icon--video' :
                                        'fa-regular fa-book-open cpv-section-type-icon--text'} cpv-section-type-icon`
                                        } />
                                    <span className="cpv-section-name">{section.title}</span>
                                    {section.status === 'DRAFT' && (
                                      <span className="cpv-section-draft-badge">Draft</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Content area ── */}
        <div className="cpv-content">
          {!activeSection ? (
            <div className="cpv-empty-state">
              <i className="fa-regular fa-play-circle cpv-empty-icon" />
              <p className="cpv-empty-text">Chọn một section từ danh sách bên trái để xem nội dung</p>
            </div>
          ) : (
            <>
              {/* Video or Text */}
              {activeSection.type === 'VIDEO' && activeSection.videoUrl && (
                <VideoContent url={activeSection.videoUrl} />
              )}

              {activeSection.type === 'VIDEO' && !activeSection.videoUrl && (
                <div className="cpv-empty-state">
                  <i className="fa-regular fa-video-slash cpv-empty-icon" />
                  <p className="cpv-empty-text">Section này chưa có video.</p>
                </div>
              )}

              {activeSection.type === 'TEXT' && (
                <div
                  className="cpv-text-content"
                  dangerouslySetInnerHTML={{ __html: activeSection.textContent ?? '' }}
                />
              )}

              {/* Section meta info */}
              <div className="cpv-section-info">
                <div className="cpv-section-info-type">
                  <i className={activeSection.type === 'VIDEO' ? 'fa-regular fa-circle-play' : 'fa-regular fa-book-open'} />
                  {activeSection.type === 'VIDEO' ? 'Video' : 'Bài đọc'}
                </div>
                <div className="cpv-section-info-title">{activeSection.title}</div>
                {activeSection.description && (
                  <div className="cpv-section-info-desc">{activeSection.description}</div>
                )}
                <div className={`cpv-section-info-status cpv-section-info-status--${activeSection.status.toLowerCase()}`}>
                  {activeSection.status === 'PUBLISHED'
                    ? <><i className="fa-regular fa-circle-check" /> Published</>
                    : <><i className="fa-regular fa-pencil" /> Draft</>
                  }
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePreviewPage;
export { CoursePreviewPage as Component };
