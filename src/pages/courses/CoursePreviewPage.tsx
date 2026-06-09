import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { chaptersApi } from '@/lib/api/chapters.api';
import { coursesApi } from '@/lib/api/courses.api';
import { buildEmbedUrl } from '@/pages/courses/courses.services';
import { queryKeys } from '@/lib/queryKeys';
import { SCREENS_PATH, VIDEO_HOST } from '@/config/constant';
import type { IChapter, ISection, ICourseDetail } from '@/types/types';
import '@/pages/courses/CoursePreviewPage.scss';

/* Helpers */
const EXTERNAL_VIDEO_HOSTS = [VIDEO_HOST.YOUBUTE, VIDEO_HOST.YOUBUTE_SHORT, VIDEO_HOST.VIMEO, VIDEO_HOST.DAILY_MOTION];

const isExternalVideo = (url: string): boolean => {
  try {
    const hostname = new URL(url).hostname;
    return EXTERNAL_VIDEO_HOSTS.some(h => hostname.includes(h));
  } catch {
    return false;
  }
};

/* Sub-components */
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

/* Main component */
const CoursePreviewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);

  /* UI state */
  // Track collapsed IDs thay vì expanded — mặc định tất cả đều expanded (set rỗng)
  const [activeSection, setActiveSection] = useState<ISection | null>(null);
  const [collapsedChapters, setCollapsedChapters] = useState<Set<number>>(new Set());
  const [collapsedLessons, setCollapsedLessons] = useState<Set<number>>(new Set());

  /* Server data — use useQuery */
  const { data: courseDetail, isLoading: loadingDetail } = useQuery<ICourseDetail>({
    queryKey: queryKeys.courses.detail(courseId),
    queryFn: () => coursesApi.detail(courseId).then(r => r.data),
    enabled: !!courseId
  });

  const { data: chapters = [], isLoading: loadingChapters } = useQuery<IChapter[]>({
    queryKey: queryKeys.chapters.byCourse(courseId),
    queryFn: () => chaptersApi.list(courseId).then(r => r.data),
    enabled: !!courseId
  });

  const isLoading = loadingDetail || loadingChapters;

  /* Tính section đầu tiên từ chapters — dùng khi user chưa chọn gì */
  const defaultSection = useMemo<ISection | null>(() => {
    for (const chapter of chapters) {
      for (const lesson of chapter.lessons) {
        if (lesson.sections.length > 0) return lesson.sections[0];
      }
    }
    return null;
  }, [chapters]);

  /* Section đang active: ưu tiên user chọn, fallback về section đầu tiên */
  const currentSection = activeSection ?? defaultSection;

  /* Toggle helpers */
  const toggleChapter = useCallback((chapterId: number) => {
    setCollapsedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) { next.delete(chapterId); } else { next.add(chapterId); }
      return next;
    });
  }, []);

  const toggleLesson = useCallback((lessonId: number) => {
    setCollapsedLessons(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) { next.delete(lessonId); } else { next.add(lessonId); }
      return next;
    });
  }, []);


  /* Status badge */
  const statusClass = (status?: string) => {
    switch (status?.toUpperCase()) {
      case 'PUBLISHED': return 'cpv-status-badge--published';
      case 'DRAFT': return 'cpv-status-badge--draft';
      case 'ARCHIVED': return 'cpv-status-badge--archived';
      default: return 'cpv-status-badge--draft';
    }
  };

  /* Loading state */
  if (isLoading) {
    return (
      <div className="cpv-loading">
        <i className="fa-regular fa-spinner-third fa-spin fa-2x" />
        <p>Loading preview...</p>
      </div>
    );
  }

  /* Render */
  return (
    <div className="cpv-page">

      {/* Header */}
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

      {/* Main layout */}
      <div className="cpv-layout">

        {/* Sidebar */}
        <div className="cpv-sidebar">
          <div className="cpv-sidebar-header">
            <i className="fa-regular fa-list-ul" /> Course Content
          </div>

          {chapters.length === 0 && (
            <div className="cpv-no-lessons" style={{ padding: '1rem' }}>
              No content yet.
            </div>
          )}

          {chapters.map((chapter, chIdx) => {
            const isChOpen = !collapsedChapters.has(chapter.id);
            return (
              <div key={chapter.id} className="cpv-chapter">
                {/* Chapter header */}
                <div className="cpv-chapter-header" onClick={() => toggleChapter(chapter.id)}>
                  <i className={`fa-regular fa-chevron-right cpv-chapter-chevron${isChOpen ? ' cpv-chapter-chevron--open' : ''}`} />
                  <span className="cpv-chapter-num">{chIdx + 1}</span>
                  <span className="cpv-chapter-title">{chapter.title}</span>
                  <span className="cpv-chapter-count">
                    {chapter.lessons.length} {chapter.lessons.length === 1 ? 'lesson' : 'lessons'}
                  </span>
                </div>

                {/* Lessons */}
                {isChOpen && (
                  <div className="cpv-lessons">
                    {chapter.lessons.length === 0 && (
                      <div className="cpv-no-lessons">No lessons yet.</div>
                    )}

                    {chapter.lessons.map((lesson, lIdx) => {
                      const isLessonOpen = !collapsedLessons.has(lesson.id);
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
                                <div className="cpv-no-sections">No sections yet.</div>
                              )}

                              {lesson.sections.map(section => {
                                const isActive = currentSection?.id === section.id;
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

        {/* Content area */}
        <div className="cpv-content">
          {!currentSection ? (
            <div className="cpv-empty-state">
              <i className="fa-regular fa-play-circle cpv-empty-icon" />
              <p className="cpv-empty-text">Select a section from the list on the left to view its content</p>
            </div>
          ) : (
            <>
              {/* Video or Text */}
              {currentSection.type === 'VIDEO' && currentSection.videoUrl && (
                <VideoContent url={currentSection.videoUrl} />
              )}

              {currentSection.type === 'VIDEO' && !currentSection.videoUrl && (
                <div className="cpv-empty-state">
                  <i className="fa-regular fa-video-slash cpv-empty-icon" />
                  <p className="cpv-empty-text">This section has no video yet.</p>
                </div>
              )}

              {currentSection.type === 'TEXT' && (
                <div
                  className="cpv-text-content"
                  dangerouslySetInnerHTML={{ __html: currentSection.textContent ?? '' }}
                />
              )}

              {/* Section meta info */}
              <div className="cpv-section-info">
                <div className="cpv-section-info-type">
                  <i className={currentSection.type === 'VIDEO' ? 'fa-regular fa-circle-play' : 'fa-regular fa-book-open'} />
                  {currentSection.type === 'VIDEO' ? 'Video' : 'Reading'}
                </div>
                <div className="cpv-section-info-title">{currentSection.title}</div>
                {currentSection.description && (
                  <div className="cpv-section-info-desc">{currentSection.description}</div>
                )}
                <div className={`cpv-section-info-status cpv-section-info-status--${currentSection.status.toLowerCase()}`}>
                  {currentSection.status === 'PUBLISHED'
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
