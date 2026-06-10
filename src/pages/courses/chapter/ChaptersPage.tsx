import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { chaptersApi, lessonsApi, sectionsApi } from '@/lib/api/chapters.api';
import { coursesApi } from '@/lib/api/courses.api';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { modalStore } from '@/stores/modal.store';
import {
  type ILesson,
  type IChapter,
  type ISection,
  type ILessonModalState,
  type IChapterModalState,
  lessonFormInit
} from '@/types/types';
import { SCREENS_PATH } from '@/config/constant';
import '@/pages/courses/chapter/ChaptersPage.scss';
import ChapterModal from '@/components/ui/course/ChapterModal';
import LessonModal from '@/components/ui/course/LessonModal';

const ChaptersPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);

  /* UI state */
  /* Track collapsed IDs — empty set = all chapters open by default */
  const [collapsedChapters, setCollapsedChapters] = useState<Set<number>>(new Set());
  /* Track expanded lesson IDs — empty set = all lessons closed by default */
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(new Set());

  /* Modal states */
  const [chapterModal, setChapterModal] = useState<IChapterModalState>({ open: false });
  const [lessonModal, setLessonModal] = useState<ILessonModalState>({ open: false });

  /* Form states */
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDescription, setChapterDescription] = useState('');
  const [chapterAvatarUrl, setChapterAvatarUrl] = useState('');
  const [lessonForm, setLessonForm] = useState(lessonFormInit);
  const [submitting, setSubmitting] = useState(false);

  /* Fix 8: Combined modalStore selectors — 1 subscription instead of 6 */
  const { setMessage, setTitle, setCallback, setOpen, setEnableCancelButton, setEnableOkButton } = modalStore(
    useShallow(state => ({
      setMessage: state.setMessage,
      setTitle: state.setTitle,
      setCallback: state.setCallback,
      setOpen: state.setOpen,
      setEnableCancelButton: state.setEnableCancelButton,
      setEnableOkButton: state.setEnableOkButton
    }))
  );

  /* Fix 5: Server data via useQuery — replaces useState + useEffect + loadData */
  const { data: courseDetailData, isLoading: loadingDetail } = useQuery({
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
  const courseTitle = courseDetailData?.title ?? '';
  const courseDescription = courseDetailData?.description ?? '';

  /* Helpers */

  const invalidateChapters = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.chapters.byCourse(courseId) });

  /* Fix 4: Replace window.confirm() with modalStore for consistent UX */
  const openDeleteConfirm = (message: string, onConfirm: () => Promise<void>) => {
    setMessage(message);
    setEnableCancelButton(true);
    setEnableOkButton(true);
    setTitle('Confirm Delete');
    setCallback(() => () => onConfirm().catch(() => {}));
    setOpen(true);
  };

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

  const handleSaveChapter = async (avatarUrl: string) => {
    if (!chapterTitle.trim()) return;
    setSubmitting(true);
    try {
      if (chapterModal.open && chapterModal.mode === 'create') {
        await chaptersApi.create(courseId, {
          title: chapterTitle.trim(),
          description: chapterDescription.trim() || undefined,
          avatarUrl: avatarUrl || undefined
        });
      } else if (chapterModal.open && chapterModal.mode === 'edit') {
        await chaptersApi.update(courseId, chapterModal.chapter.id, {
          title: chapterTitle.trim(),
          description: chapterDescription.trim() || undefined,
          avatarUrl: avatarUrl || undefined
        });
      }
      /* Fix 3: Only invalidateQueries — useQuery refetches automatically, no loadData() needed */
      await invalidateChapters();
      setChapterModal({ open: false });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteChapter = (chapterId: number) => {
    openDeleteConfirm(
      'Delete this chapter and all its lessons and sections inside?',
      async () => {
        await chaptersApi.delete(courseId, chapterId);
        await invalidateChapters();
      }
    );
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
    await invalidateChapters();
  };

  /* Lesson actions */

  const openCreateLesson = (chapterId: number) => {
    setLessonForm(lessonFormInit);
    setLessonModal({ open: true, mode: 'create', chapterId });
  };

  const openEditLesson = (chapterId: number, lesson: ILesson) => {
    setLessonForm({
      title: lesson.title,
      description: lesson.description ?? '',
      avatarUrl: lesson.avatarUrl ?? ''
    });
    setLessonModal({ open: true, mode: 'edit', chapterId, lesson });
  };

  const handleSaveLesson = async (avatarUrl: string) => {
    if (!lessonForm.title.trim() || !lessonModal.open) return;
    setSubmitting(true);
    try {
      const payload = {
        title: lessonForm.title.trim(),
        description: lessonForm.description.trim() || undefined,
        avatarUrl: avatarUrl || undefined
      };
      if (lessonModal.mode === 'create') {
        await lessonsApi.create(courseId, lessonModal.chapterId, payload);
      } else {
        await lessonsApi.update(courseId, lessonModal.chapterId, lessonModal.lesson.id, payload);
      }
      await invalidateChapters();
      setLessonModal({ open: false });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLesson = (chapterId: number, lessonId: number) => {
    openDeleteConfirm(
      'Delete this lesson and all its sections inside?',
      async () => {
        await lessonsApi.delete(courseId, chapterId, lessonId);
        await invalidateChapters();
      }
    );
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
    await invalidateChapters();
  };

  /* Section actions */

  const handleDeleteSection = (chapterId: number, lessonId: number, sectionId: number) => {
    openDeleteConfirm(
      'Delete this section?',
      async () => {
        await sectionsApi.delete(courseId, chapterId, lessonId, sectionId);
        await invalidateChapters();
      }
    );
  };

  const handleReorderSection = async (
    chapterId: number,
    lessonId: number,
    sectionId: number,
    direction: 'up' | 'down'
  ) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;
    const lesson = chapter.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    const sections = lesson.sections;
    const idx = sections.findIndex(s => s.id === sectionId);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sections.length - 1) return;

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const items = sections.map((s, i) => {
      if (i === idx) return { sectionId: s.id, orderIndex: sections[swapIdx].orderIndex };
      if (i === swapIdx) return { sectionId: s.id, orderIndex: sections[idx].orderIndex };
      return { sectionId: s.id, orderIndex: s.orderIndex };
    });
    await sectionsApi.reorder(courseId, chapterId, lessonId, { items });
    await invalidateChapters();
  };

  /* Toggle helpers */
  const toggleChapter = useCallback((chapterId: number) => {
    setCollapsedChapters(prev => {
      const next = new Set(prev);
      if (next.has(chapterId)) { next.delete(chapterId); } else { next.add(chapterId); }
      return next;
    });
  }, []);

  const toggleLesson = useCallback((lessonId: number) => {
    setExpandedLessons(prev => {
      const next = new Set(prev);
      if (next.has(lessonId)) { next.delete(lessonId); } else { next.add(lessonId); }
      return next;
    });
  }, []);

  const sectionTypeIcon = (type: ISection['type']) =>
    type === 'VIDEO' ? 'fa-regular fa-circle-play' : 'fa-regular fa-book-open';

  /* Render */

  if (isLoading) {
    return (
      <div className="ccp-loading">
        <i className="fa-regular fa-spinner-third fa-spin fa-2x" />
        <p>Loading chapters...</p>
      </div>
    );
  }

  return (
    <div className="ccp-page">
      {/* Page Header */}
      <div className="card mb-0!">
        <div className="card-header">
          <div className="card-header-title">
            <i className="fa-regular fa-layer-group" />
            <span className="ml-2!">Chapters &amp; Lessons</span>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-7 md:col-span-7 lg:col-span-7 xl:col-span-8 2xl:col-span-9">
              <div className="ccp-course-title">{courseTitle}</div>
              <div className="ccp-course-desc">{courseDescription}</div>
            </div>
            <div className="col-span-5 md:col-span-5 lg:col-span-5 xl:col-span-4 2xl:col-span-3 flex items-center justify-end">
              <button className="btn btn-sm btn-light ccp-back-btn" onClick={() => navigate(SCREENS_PATH.COURSE_LIST)}>
                <i className="fa-regular fa-arrow-left" /> Courses
              </button>
              <button className="btn btn-sm btn-primary ml-1!" onClick={openCreateChapter}>
                <i className="fa-regular fa-plus" /> Add Chapter
              </button>
            </div>
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
          /* Fix 5: inverted logic — not in collapsedChapters = open */
          const isChapterExpanded = !collapsedChapters.has(chapter.id);
          return (
            <div key={chapter.id} className="card ccp-chapter-card mb-0!">
              {/* Chapter Header */}
              <div className="ccp-chapter-header" onClick={() => toggleChapter(chapter.id)}>
                <div className="ccp-chapter-left">
                  <i className={`fa-regular ${isChapterExpanded ? 'fa-chevron-down' : 'fa-chevron-right'} ccp-chevron`} />
                  <span className="ccp-chapter-index">{chIdx + 1}</span>
                  {chapter.avatarUrl && (
                    <div className="ccp-chapter-avatar" style={{ backgroundImage: `url(${chapter.avatarUrl})` }} />
                  )}
                  <div className="ccp-chapter-info">
                    <div className="ccp-chapter-title">{chapter.title}</div>
                    {chapter.description && <div className="ccp-chapter-desc">{chapter.description}</div>}
                  </div>
                  <span className="ccp-lesson-count">
                    {chapter.lessons.length} Lesson{chapter.lessons.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="ccp-chapter-actions" onClick={e => e.stopPropagation()}>
                  <button className="btn btn-light-primary btn-icon btn-sm" title="Move up"
                    onClick={() => handleReorderChapter(chapter.id, 'up')} disabled={chIdx === 0}>
                    <i className="fa-regular fa-chevron-up" />
                  </button>
                  <button className="btn btn-light-primary btn-icon btn-sm" title="Move down"
                    onClick={() => handleReorderChapter(chapter.id, 'down')} disabled={chIdx === chapters.length - 1}>
                    <i className="fa-regular fa-chevron-down" />
                  </button>
                  <button className="btn btn-light-warning btn-icon btn-sm" title="Edit chapter"
                    onClick={() => openEditChapter(chapter)}>
                    <i className="fa-thin fa-pen text-sm" />
                  </button>
                  <button className="btn btn-light-danger btn-icon btn-sm" title="Delete chapter"
                    onClick={() => handleDeleteChapter(chapter.id)}>
                    <i className="fa-thin fa-trash text-sm" />
                  </button>
                </div>
              </div>

              {/* Lesson List (Level 2) */}
              {isChapterExpanded && (
                <div className="ccp-lessons">
                  {chapter.lessons.length === 0 && (
                    <div className="ccp-lessons-empty">No lessons yet</div>
                  )}

                  {chapter.lessons.map((lesson, lIdx) => {
                    const isLessonExpanded = expandedLessons.has(lesson.id);
                    return (
                      <div key={lesson.id} className="ccp-lesson-block">
                        {/* Lesson Row */}
                        <div className="ccp-lesson-row" onClick={() => toggleLesson(lesson.id)}>
                          <div className="ccp-lesson-left">
                            <i className={`fa-regular ${isLessonExpanded ? 'fa-chevron-down' : 'fa-chevron-right'} ccp-chevron ccp-chevron--sm`} />
                            <span className="ccp-lesson-index">{lIdx + 1}</span>
                            {lesson.avatarUrl && <div className="ccp-lesson-avatar" style={{ backgroundImage: `url(${lesson.avatarUrl})` }} />}
                            <div className="ccp-lesson-info">
                              <div className="ccp-lesson-title">{lesson.title}</div>
                              {lesson.description && <div className="ccp-lesson-desc">{lesson.description}</div>}
                            </div>
                            <span className="ccp-section-count">
                              {lesson.sections.length} Section{lesson.sections.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="ccp-lesson-actions" onClick={e => e.stopPropagation()}>
                            <button className="btn btn-light-primary btn-icon btn-sm" title="Move up"
                              onClick={() => handleReorderLesson(chapter.id, lesson.id, 'up')} disabled={lIdx === 0}>
                              <i className="fa-regular fa-chevron-up" />
                            </button>
                            <button className="btn btn-light-primary btn-icon btn-sm" title="Move down"
                              onClick={() => handleReorderLesson(chapter.id, lesson.id, 'down')} disabled={lIdx === chapter.lessons.length - 1}>
                              <i className="fa-regular fa-angle-down" />
                            </button>
                            <button className="btn btn-light-warning btn-icon btn-sm" title="Edit lesson"
                              onClick={() => openEditLesson(chapter.id, lesson)}>
                              <i className="fa-thin fa-pen text-sm" />
                            </button>
                            <button className="btn btn-light-danger btn-icon btn-sm" title="Delete lesson"
                              onClick={() => handleDeleteLesson(chapter.id, lesson.id)}>
                              <i className="fa-thin fa-trash text-sm" />
                            </button>
                          </div>
                        </div>

                        {/* Section List (Level 3) */}
                        {isLessonExpanded && (
                          <div className="ccp-sections">
                            {lesson.sections.length === 0 && <div className="ccp-sections-empty">No sections yet.</div>}
                            {lesson.sections.map((section, sIdx) => (
                              <div key={section.id} className="ccp-section-row">
                                <div className="ccp-section-left">
                                  <i className={`${sectionTypeIcon(section.type)} ccp-section-type-icon`} />
                                  <span className="ccp-section-index">{sIdx + 1}</span>
                                  <div className="ccp-section-info">
                                    <div className="ccp-section-title">{section.title}</div>
                                    {section.description && <div className="ccp-section-desc">{section.description}</div>}
                                  </div>
                                  <span className={`ccp-section-status ${section.status.toLowerCase()}`}>{section.status}</span>
                                </div>
                                <div className="ccp-section-actions">
                                  <button className="btn btn-light-primary btn-icon btn-sm" title="Move up"
                                    onClick={() => handleReorderSection(chapter.id, lesson.id, section.id, 'up')} disabled={sIdx === 0}>
                                    <i className="fa-regular fa-chevron-up" />
                                  </button>
                                  <button className="btn btn-light-primary btn-icon btn-sm" title="Move down"
                                    onClick={() => handleReorderSection(chapter.id, lesson.id, section.id, 'down')} disabled={sIdx === lesson.sections.length - 1}>
                                    <i className="fa-regular fa-angle-down" />
                                  </button>
                                  <button className="btn btn-light-warning btn-icon btn-sm" title="Edit section"
                                    onClick={() => navigate(SCREENS_PATH.SECTION_EDIT(courseId, chapter.id, lesson.id, section.id))}>
                                    <i className="fa-thin fa-pen text-sm" />
                                  </button>
                                  <button className="btn btn-light-danger btn-icon btn-sm" title="Delete section"
                                    onClick={() => handleDeleteSection(chapter.id, lesson.id, section.id)}>
                                    <i className="fa-thin fa-trash text-sm" />
                                  </button>
                                </div>
                              </div>
                            ))}

                            {/* Add Section Button */}
                            <div className="ccp-add-section-row text-right">
                              <button className="btn btn-sm btn-light-primary ccp-add-section-btn"
                                onClick={() => navigate(SCREENS_PATH.SECTION_ADD(courseId, chapter.id, lesson.id))}>
                                <i className="fa-regular fa-plus" /> Add Section
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add Lesson Button */}
                  <div className="ccp-add-lesson-row text-right">
                    <button className="btn btn-sm btn-light-primary ccp-add-lesson-btn"
                      onClick={() => openCreateLesson(chapter.id)}>
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
        <ChapterModal
          mode={chapterModal.mode}
          title={chapterTitle}
          setTitle={setChapterTitle}
          description={chapterDescription}
          setDescription={setChapterDescription}
          existingAvatarUrl={chapterAvatarUrl}
          setChapterModal={setChapterModal}
          submitting={submitting}
          handleSaveChapter={handleSaveChapter}
        />
      )}

      {/* Lesson Modal */}
      {lessonModal.open && (
        <LessonModal
          submitting={submitting}
          lessonForm={lessonForm}
          setLessonForm={setLessonForm}
          lessonModal={lessonModal}
          setLessonModal={setLessonModal}
          handleSaveLesson={handleSaveLesson}
        />
      )}
    </div>
  );
};

export default ChaptersPage;
export { ChaptersPage as Component };
