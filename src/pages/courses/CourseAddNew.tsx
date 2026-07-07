import { useRef, useState, type ChangeEvent, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import { useQuery } from '@tanstack/react-query';

import { createCourse, uploadImage } from './courses.services';
import { courseSchema, initialCourseFormValues, type CourseFormData } from '@/pages/courses/course.schema';
import type { ICategory, ICourseStatus, IDropdownOption } from '@/types/types';
import {
  STATE,
  SCREENS_PATH,
  STATUS_DATA_FOR_DROPDOWN
} from '@/config/constant';
import { getFormatVNCurrency } from '@/util/util.tsx';
import '@/pages/courses/CourseAddNew.scss';
import { Dropdown } from '@/components/ui/dropdown/Dropdown';
import { categoriesApi } from '@/lib/api/categories.api.ts';
import { levelsApi } from '@/lib/api/levels.api.ts';
import { queryKeys } from '@/lib/queryKeys';

const CourseAddNew = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* TanStack Form + Zod */
  const form = useForm({
    defaultValues: initialCourseFormValues as CourseFormData,
    onSubmit: async ({ value }) => {
      const file = fileInputRef.current?.files?.[0];
      let thumbnailUrl: string = '';
      if (file) {
        thumbnailUrl = await uploadImage(file);
      }
      await createCourse({ ...value, thumbnailUrl });
      navigate(SCREENS_PATH.COURSE_LIST);
    }
  });

  /* Track selected category for cascading level select */
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  /* Fetch all categories */
  const { data: categories = [] } = useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: () => categoriesApi.getAll().then(r => r.data)
  });

  /* Fetch levels only when a category is selected */
  const { data: levels = [], isFetching: levelsLoading } = useQuery({
    queryKey: queryKeys.levels.byCategory(selectedCategoryId as number),
    queryFn: () => levelsApi.getByCategory(selectedCategoryId as number).then(r => r.data),
    enabled: !!selectedCategoryId
  });

  /* Helpers */
  const validateField = (fieldName: keyof CourseFormData) =>
    ({ value }: { value: unknown }) => {
      const result = courseSchema.shape[fieldName].safeParse(value);
      if (!result.success) {
        return result.error.issues.map(i => i.message).join(', ');
      }
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

  const handleCancel = () => navigate(SCREENS_PATH.COURSE_LIST);

  const convertCategoryDataForDropdown = (): IDropdownOption[] => {
    return categories.map((category: ICategory) => ({
      label: `${category.categoryName}`,
      value: category.id,
      icon: category.avatar,
      className: 'dropdown-item-status default'
    }));
  };

  return (
    <div className="course-add-new">
      <form
        id="course-add-form"
        noValidate
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit().catch(() => {});
        }}
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
                <form.Field name="title" validators={{ onChange: validateField('title') }}>
                  {field => (
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
                  )}
                </form.Field>

                {/* Short Description */}
                <form.Field name="shortDescription" validators={{ onChange: validateField('shortDescription') }}>
                  {field => (
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
                  )}
                </form.Field>

                {/* Full Description */}
                <form.Field name="description" validators={{ onChange: validateField('description') }}>
                  {field => (
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
                  )}
                </form.Field>
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
                <form.Field name="thumbnailUrl">
                  {field => (
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
                        <label htmlFor="course-thumbnail" className="can-dropzone">
                          <div className="can-dropzone-content">
                            <div className="can-dropzone-icon"><i className="fa-regular fa-cloud-arrow-up" /></div>
                            <div className="can-dropzone-text">
                              <span className="can-dropzone-primary">Click to upload image</span>
                              <span className="can-dropzone-secondary">PNG, JPG, WEBP · Max 5MB</span>
                            </div>
                          </div>
                        </label>
                      )}
                      <input ref={fileInputRef} id="course-thumbnail" name="thumbnail-file"
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
                  )}
                </form.Field>
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
                <form.Field name="status" validators={{ onChange: validateField('status') }}>
                  {field => (
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
                      {field.state.meta.errors.length > 0 && <span className="error-message can-error-msg">{field.state.meta.errors.join(', ')}</span>}
                    </div>
                  )}
                </form.Field>

                {/* Category */}
                <form.Field name="categoryId" validators={{ onChange: validateField('categoryId') }}>
                  {field => (
                    <div className="can-field">
                      <label htmlFor={field.name} className="form-label can-label">
                        Category <span className="can-required">*</span>
                      </label>
                      <Dropdown id={field.name} name={field.name}
                        dataSelected={field.state.value}
                        itemData={convertCategoryDataForDropdown()}
                        setDataSelected={val => {
                          field.handleChange(val as number);
                          setSelectedCategoryId(val as number);
                        }}
                        onBlur={field.handleBlur}
                        hasError={field.state.meta.errors.length > 0} />

                      {field.state.meta.errors.length > 0 && <span className="error-message can-error-msg">{field.state.meta.errors.join(', ')}</span>}
                    </div>
                  )}
                </form.Field>

                {/* Level — disabled until category is chosen */}
                <form.Field name="levelId" validators={{ onChange: validateField('levelId') }}>
                  {field => (
                    <div className="can-field">
                      <label htmlFor={field.name} className="form-label can-label">
                        Level <span className="can-required">*</span>
                      </label>
                      <select
                        id={field.name} name={field.name}
                        className={`form-control form-select ${field.state.meta.errors.length ? 'error' : ''}`}
                        value={field.state.value ?? ''}
                        onChange={e => field.handleChange((e.target.value ? Number(e.target.value) : null) as number)}
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
                  )}
                </form.Field>

                {/* Price */}
                <form.Field name="price" validators={{ onChange: validateField('price') }}>
                  {field => (
                    <div className="can-field">
                      <label htmlFor={field.name} className="form-label can-label">Price (VND)</label>
                      <div className="input-group">
                        <span className="input-group-text can-input-prefix">
                          <i className="fa-thin fa-dong-sign" />
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
                        <span className="can-price-display text-right">{getFormatVNCurrency(field.state.value)}</span>
                      )}
                      {field.state.value === 0 && <span className="can-price-free">Free course</span>}
                    </div>
                  )}
                </form.Field>
              </div>
            </div>

            {/* Summary */}
            <form.Subscribe
              selector={s => ({
                title: s.values.title,
                status: s.values.status,
                price: s.values.price,
                thumbnailUrl: s.values.thumbnailUrl,
                categoryId: s.values.categoryId,
                levelId: s.values.levelId
              })}
            >
              {({ title, status, price, thumbnailUrl, categoryId, levelId }) => (
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
                        <span className="can-summary-value">
                          {thumbnailUrl ? <span><i className="fa-regular fa-check" /> Selected</span> : <em className="can-summary-empty">Not selected</em>}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </form.Subscribe>
          </div>
        </div>

        {/* Action bar */}
        <div className="can-layout mt-[1.25rem]!">
          <div className="can-col-main">
            <div className="card can-card">
              <div className="card-body can-card-body">
                <form.Subscribe
                  selector={s => ({ canSubmit: s.canSubmit, isSubmitting: s.isSubmitting })}
                >
                  {({ canSubmit, isSubmitting }) => (
                    <div className="can-layout-action">
                      <button type="button" className="btn btn-light can-btn-cancel" onClick={handleCancel} disabled={isSubmitting}>
                        <i className="fa-regular fa-xmark" /> Cancel
                      </button>
                      <button type="button" className="btn btn-warning can-btn-draft" onClick={handleCancel} disabled={isSubmitting}>
                        <i className="fa-regular fa-floppy-disk" /> Draft
                      </button>
                      <button type="submit" form="course-add-form" className="btn btn-primary can-btn-submit" disabled={!canSubmit || isSubmitting}>
                        {isSubmitting
                          ? <span><i className="fa-regular fa-spinner-third fa-spin" /> Saving...</span>
                          : <span><i className="fa-regular fa-floppy-disk" /> Save Course</span>}
                      </button>
                    </div>
                  )}
                </form.Subscribe>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseAddNew;
export { CourseAddNew as Component };
