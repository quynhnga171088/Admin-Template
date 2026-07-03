import { useRef, useEffect, useCallback, useState, type ChangeEvent, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';

import { updateCourse, uploadImage } from './courses.services';
import { coursesApi } from '@/lib/api/courses.api';
import { categoriesApi } from '@/lib/api/categories.api.ts';
import { levelsApi } from '@/lib/api/levels.api.ts';
import { queryKeys } from '@/lib/queryKeys';
import {
  courseSchema,
  type CourseFormData,
  initialCourseFormValues
} from '@/pages/courses/course.schema';
import type { ICourseStatus } from '@/types/types';
import { SCREENS_PATH, STATE, STATUS_DATA_FOR_DROPDOWN } from '@/config/constant';
import { type IModalState, modalStore } from '@/stores/modal.store';
import { getFormatVNCurrency } from '@/util/util.tsx';
import '@/pages/courses/CourseAddNew.scss';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';

const CourseEditPage = () => {
  const navigate   = useNavigate();
  const { id }     = useParams<{ id: string }>();
  const courseId   = Number(id);

  const setProcessing = modalStore((s: IModalState) => s.setProcessing);
  const setOpen       = modalStore((s: IModalState) => s.setOpen);
  const setTitle      = modalStore((s: IModalState) => s.setTitle);
  const setMessage    = modalStore((s: IModalState) => s.setMessage);
  const setCallback   = modalStore((s: IModalState) => s.setCallback);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isIdInvalid  = !courseId || isNaN(courseId);

  /* Course detail */
  const { data: courseDetail, isLoading, isError } = useQuery({
    queryKey: queryKeys.courses.detail(courseId),
    queryFn:  () => coursesApi.detail(courseId).then(r => r.data),
    enabled:  !isIdInvalid
  });

  /* TanStack Form */
  const form = useForm({
    defaultValues: initialCourseFormValues as CourseFormData,
    onSubmit: async ({ value }) => {
      const file = fileInputRef.current?.files?.[0];
      let thumbnailUrl = value.thumbnailUrl;
      if (file) thumbnailUrl = await uploadImage(file);
      await updateCourse(courseId, { ...value, thumbnailUrl });
      navigate(SCREENS_PATH.COURSE_LIST);
    }
  });

  /* Track selected category for cascading level select */
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  /* All categories */
  const { data: categories = [] } = useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn:  () => categoriesApi.getAll().then(r => r.data)
  });

  /* Levels for selected category */
  const { data: levels = [], isFetching: levelsLoading } = useQuery({
    queryKey: queryKeys.levels.byCategory(selectedCategoryId as number),
    queryFn:  () => levelsApi.getByCategory(selectedCategoryId as number).then(r => r.data),
    enabled:  !!selectedCategoryId
  });

  /* Pre-fill form when courseDetail arrives */
  useEffect(() => {
    if (!courseDetail) return;
    form.reset({
      title:            courseDetail.title ?? '',
      shortDescription: courseDetail.shortDescription ?? '',
      description:      courseDetail.description ?? '',
      thumbnailUrl:     courseDetail.thumbnailUrl ?? '',
      price:            courseDetail.price ?? 0,
      status:           (courseDetail.status ?? STATE.DRAFT) as CourseFormData['status'],
      categoryId:       courseDetail.categoryId ?? null,
      levelId:          courseDetail.levelId ?? null
    });
    // Sync local state so level select loads automatically
    setSelectedCategoryId(courseDetail.categoryId ?? null);
  }, [courseDetail, form]);

  useEffect(() => { setProcessing(isLoading); }, [isLoading, setProcessing]);

  /* Error handling */
  const handleCancel = useCallback(() => navigate(SCREENS_PATH.COURSE_LIST), [navigate]);

  useEffect(() => {
    if (!isIdInvalid && !isError) return;
    setMessage('Loading data fail, please come back to List');
    setTitle('Loading error');
    setCallback(handleCancel);
    setOpen(true);
  }, [isIdInvalid, isError, handleCancel, setMessage, setTitle, setCallback, setOpen]);

  if (isIdInvalid || isError) return null;

  /* Field validator helper */
  const validateField = (fieldName: keyof CourseFormData) =>
    ({ value }: { value: any }) => {
      const result = courseSchema.shape[fieldName].safeParse(value);
      if (!result.success) return result.error.issues.map(i => i.message).join(', ');
      return undefined;
    };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>, onChange: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(URL.createObjectURL(file));
  };

  const handleRemoveThumbnail = (onChange: (url: string) => void) => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="course-add-new">
      <form id="course-edit-form" noValidate
        onSubmit={e => { e.preventDefault(); e.stopPropagation(); form.handleSubmit().catch(() => {}); }}
      >
        <div className="can-layout">
          {/* ── Main column ── */}
          <div className="can-col-main">
            <div className="card can-card">
              <div className="card-header">
                <div className="card-header-title">
                  <i className="fa-regular fa-book-open mr-2!" /> Basic Information
                </div>
              </div>
              <div className="card-body can-card-body">

                {/* Title */}
                <form.Field name="title" validators={{ onChange: validateField('title') }}
                  children={field => (
                    <div className="can-field">
                      <label htmlFor={field.name} className="form-label can-label">
                        Course Title <span className="can-required">*</span>
                      </label>
                      <input id={field.name} name={field.name} type="text"
                        className={`form-control ${field.state.meta.errors.length ? 'error' : ''}`}
                        placeholder="Enter course title..."
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur} maxLength={200} />
                      {field.state.meta.errors.length > 0 && <span className="error-message can-error-msg">{field.state.meta.errors.join(', ')}</span>}
                      <span className="can-char-count">{field.state.value.length}/200</span>
                    </div>
                  )} />

                {/* Short Description */}
                <form.Field name="shortDescription" validators={{ onChange: validateField('shortDescription') }}
                  children={field => (
                    <div className="can-field">
                      <label htmlFor={field.name} className="form-label can-label">
                        Short Description <span className="can-required">*</span>
                      </label>
                      <textarea id={field.name} name={field.name} rows={3}
                        className={`form-control can-textarea ${field.state.meta.errors.length ? 'error' : ''}`}
                        placeholder="Enter a brief overview (max 500 characters)..."
                        value={field.state.value ?? ''}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur} maxLength={500} />
                      {field.state.meta.errors.length > 0 && <span className="error-message can-error-msg">{field.state.meta.errors.join(', ')}</span>}
                      <span className="can-char-count">{(field.state.value ?? '').length}/500</span>
                    </div>
                  )} />

                {/* Full Description */}
                <form.Field name="description" validators={{ onChange: validateField('description') }}
                  children={field => (
                    <div className="can-field">
                      <label htmlFor={field.name} className="form-label can-label">
                        Full Description <span className="can-required">*</span>
                      </label>
                      <textarea id={field.name} name={field.name} rows={8}
                        className={`form-control can-textarea can-textarea--tall ${field.state.meta.errors.length ? 'error' : ''}`}
                        placeholder="Enter detailed description (max 5000 characters)..."
                        value={field.state.value ?? ''}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur} maxLength={5000} />
                      {field.state.meta.errors.length > 0 && <span className="error-message can-error-msg">{field.state.meta.errors.join(', ')}</span>}
                      <span className="can-char-count">{(field.state.value ?? '').length}/5000</span>
                    </div>
                  )} />
              </div>
            </div>

            {/* Thumbnail */}
            <div className="card can-card">
              <div className="card-header">
                <div className="card-header-title">
                  <i className="fa-regular fa-image mr-2!" /> Course Thumbnail
                </div>
              </div>
              <div className="card-body can-card-body">
                <form.Field name="thumbnailUrl"
                  children={field => (
                    <Fragment>
                      {field.state.value ? (
                        <div className="can-thumbnail-preview-wrapper">
                          <img src={field.state.value} alt="Thumbnail preview" className="can-thumbnail-preview" />
                          <button type="button" className="can-thumbnail-remove"
                            onClick={() => handleRemoveThumbnail(field.handleChange)} title="Remove image">
                            <i className="fa-regular fa-xmark" />
                          </button>
                        </div>
                      ) : (
                        <label htmlFor="edit-course-thumbnail" className="can-dropzone">
                          <div className="can-dropzone-content">
                            <div className="can-dropzone-icon"><i className="fa-regular fa-cloud-arrow-up" /></div>
                            <div className="can-dropzone-text">
                              <span className="can-dropzone-primary">Click to upload image</span>
                              <span className="can-dropzone-secondary">PNG, JPG, WEBP · Max 5MB</span>
                            </div>
                          </div>
                        </label>
                      )}
                      <input ref={fileInputRef} id="edit-course-thumbnail" name="thumbnail-file"
                        type="file" accept="image/png,image/jpeg,image/webp"
                        onChange={e => handleThumbnailChange(e, field.handleChange)}
                        style={{ display: 'none' }} />
                      {field.state.value && (
                        <button type="button" className="can-change-thumbnail-btn"
                          onClick={() => fileInputRef.current?.click()}>
                          <i className="fa-regular fa-arrows-rotate" /> Change Image
                        </button>
                      )}
                    </Fragment>
                  )} />
              </div>
            </div>
          </div>

          {/* ── Side column ── */}
          <div className="can-col-side">
            <div className="card can-card">
              <div className="card-header">
                <div className="card-header-title can-card-title">
                  <i className="fa-regular fa-gear mr-2!" /> Course Settings
                </div>
              </div>
              <div className="card-body can-card-body">

                {/* Status */}
                <form.Field name="status" validators={{ onChange: validateField('status') }}
                  children={field => (
                    <div className="can-field">
                      <label htmlFor={field.name} className="form-label can-label">
                        Status <span className="can-required">*</span>
                      </label>
                      <Dropdown id={field.name} name={field.name}
                        dataSelected={field.state.value}
                        itemData={STATUS_DATA_FOR_DROPDOWN}
                        setDataSelected={val => field.handleChange(val as ICourseStatus)}
                        onBlur={field.handleBlur}
                        hasError={field.state.meta.errors.length > 0} />
                    </div>
                  )} />

                {/* Category */}
                <form.Field name="categoryId" validators={{ onChange: validateField('categoryId') }}
                  children={field => (
                    <div className="can-field">
                      <label htmlFor={field.name} className="form-label can-label">
                        Category <span className="can-required">*</span>
                      </label>
                      <select id={field.name} name={field.name}
                        className={`form-control form-select ${field.state.meta.errors.length ? 'error' : ''}`}
                        value={field.state.value ?? ''}
                        onChange={e => {
                          const val = e.target.value ? Number(e.target.value) : null;
                          field.handleChange(val);
                          setSelectedCategoryId(val);
                          // Reset level when category changes
                          form.setFieldValue('levelId', null);
                        }}
                        onBlur={field.handleBlur}
                      >
                        <option value="">-- Select category --</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                        ))}
                      </select>
                      {field.state.meta.errors.length > 0 && <span className="error-message can-error-msg">{field.state.meta.errors.join(', ')}</span>}
                    </div>
                  )} />

                {/* Level — disabled until category is chosen, auto-loads on category change */}
                <form.Field name="levelId" validators={{ onChange: validateField('levelId') }}
                  children={field => (
                    <div className="can-field">
                      <label htmlFor={field.name} className="form-label can-label">
                        Level <span className="can-required">*</span>
                      </label>
                      <select id={field.name} name={field.name}
                        className={`form-control form-select ${field.state.meta.errors.length ? 'error' : ''}`}
                        value={field.state.value ?? ''}
                        onChange={e => field.handleChange(e.target.value ? Number(e.target.value) : null)}
                        onBlur={field.handleBlur}
                        disabled={!selectedCategoryId || levelsLoading}
                      >
                        <option value="">
                          {!selectedCategoryId
                            ? '-- Select a category first --'
                            : levelsLoading
                              ? 'Loading...'
                              : '-- Select level --'}
                        </option>
                        {levels.map(lvl => (
                          <option key={lvl.id} value={lvl.id}>{lvl.levelName}</option>
                        ))}
                      </select>
                      {field.state.meta.errors.length > 0 && <span className="error-message can-error-msg">{field.state.meta.errors.join(', ')}</span>}
                    </div>
                  )} />

                {/* Price */}
                <form.Field name="price" validators={{ onChange: validateField('price') }}
                  children={field => (
                    <div className="can-field">
                      <label htmlFor={field.name} className="form-label can-label">Price (VND)</label>
                      <div className="input-group">
                        <span className="input-group-text can-input-prefix">
                          <i className="fa-regular fa-dong-sign" />
                        </span>
                        <input id={field.name} name={field.name} type="number"
                          className={`form-control ${field.state.meta.errors.length ? 'error' : ''}`}
                          placeholder="0"
                          value={field.state.value === 0 ? '' : field.state.value}
                          onChange={e => field.handleChange(e.target.value === '' ? 0 : Number(e.target.value))}
                          onBlur={field.handleBlur} min={0} step={1000} />
                      </div>
                      {field.state.meta.errors.length > 0 && <span className="error-message can-error-msg">{field.state.meta.errors.join(', ')}</span>}
                      {field.state.value > 0 && (
                        <span className="can-price-display">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(field.state.value)}
                        </span>
                      )}
                      {field.state.value === 0 && <span className="can-price-free">Free course</span>}
                    </div>
                  )} />
              </div>
            </div>

            {/* Summary */}
            <form.Subscribe
              selector={s => ({
                title: s.values.title, status: s.values.status,
                price: s.values.price, thumbnailUrl: s.values.thumbnailUrl,
                categoryId: s.values.categoryId, levelId: s.values.levelId
              })}
              children={({ title, status, price, thumbnailUrl, categoryId, levelId }) => (
                <div className="card can-card can-summary-card">
                  <div className="card-header">
                    <div className="card-header-title can-card-title">
                      <i className="fa-regular fa-clipboard-list mr-2!" /> Summary
                    </div>
                  </div>
                  <div className="card-body can-card-body">
                    <ul className="can-summary-list">
                      <li className="can-summary-item">
                        <span className="can-summary-label">Title</span>
                        <span className="can-summary-value">{title.trim() || <em className="can-summary-empty">Not entered</em>}</span>
                      </li>
                      <li className="can-summary-item">
                        <span className="can-summary-label">Status</span>
                        <span className={`can-status-badge can-status-badge--${(status as ICourseStatus).toLowerCase()}`}>
                          {status === STATE.DRAFT && 'Draft'}
                          {status === STATE.PUBLISHED && 'Published'}
                          {status === STATE.ARCHIVED && 'Archived'}
                        </span>
                      </li>
                      <li className="can-summary-item">
                        <span className="can-summary-label">Category</span>
                        <span className="can-summary-value">
                          {categoryId
                            ? (categories.find(c => c.id === categoryId)?.categoryName ?? '—')
                            : <em className="can-summary-empty">Not selected</em>}
                        </span>
                      </li>
                      <li className="can-summary-item">
                        <span className="can-summary-label">Level</span>
                        <span className="can-summary-value">
                          {levelId
                            ? (levels.find(l => l.id === levelId)?.levelName ?? '—')
                            : <em className="can-summary-empty">Not selected</em>}
                        </span>
                      </li>
                      <li className="can-summary-item">
                        <span className="can-summary-label">Price</span>
                        <span className="can-summary-value">{price > 0 ? getFormatVNCurrency(price) : 'Free'}</span>
                      </li>
                      <li className="can-summary-item">
                        <span className="can-summary-label">Thumbnail</span>
                        <span className="can-summary-value">{thumbnailUrl ? '✔ Selected' : <em className="can-summary-empty">Not selected</em>}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )} />
          </div>
        </div>

        {/* Action bar */}
        <div className="can-layout mt-[1.25rem]!">
          <div className="can-col-main">
            <div className="card can-card">
              <div className="card-body can-card-body">
                <form.Subscribe
                  selector={s => ({ canSubmit: s.canSubmit, isSubmitting: s.isSubmitting })}
                  children={({ canSubmit, isSubmitting }) => (
                    <div className="can-layout-action">
                      <button type="button" className="btn btn-light can-btn-cancel"
                        onClick={handleCancel} disabled={isSubmitting}>
                        <i className="fa-regular fa-xmark" /> Cancel
                      </button>
                      <button type="submit" form="course-edit-form" className="btn btn-primary can-btn-submit"
                        disabled={!canSubmit || isSubmitting}>
                        {isSubmitting
                          ? <span><i className="fa-regular fa-spinner-third fa-spin" /> Saving...</span>
                          : <span><i className="fa-regular fa-floppy-disk" /> Save Changes</span>}
                      </button>
                    </div>
                  )} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseEditPage;
export { CourseEditPage as Component };
