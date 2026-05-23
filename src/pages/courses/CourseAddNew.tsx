import { useRef, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';

import { createCourse } from './courses.services.ts';
import { courseSchema, initialCourseFormValues, type CourseFormData } from '@/pages/courses/course.schema.ts';
import type { ICourseStatus } from '@/types/types.ts';
import { SCREENS_PATH, STATE } from '@/config/constant';
import '@/pages/courses/CourseAddNew.scss';

const CourseAddNew = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ─── TanStack Form + Zod ─── */
  const form = useForm({
    defaultValues: initialCourseFormValues as CourseFormData,
    onSubmit: async ({ value }) => {
      await createCourse(value);
      navigate(SCREENS_PATH.COURSE_LIST);
    }
  });

  /* ─── Helpers ─── */
  const validateField = (fieldName: keyof CourseFormData) =>
    ({ value }: { value: any }) => {
      const result = courseSchema.shape[fieldName].safeParse(value);
      if (!result.success) {
        return result.error.issues.map(i => i.message).join(', ');
      }
      return undefined;
    };

  const handleThumbnailChange = (
    e: ChangeEvent<HTMLInputElement>,
    onChange: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    onChange(objectUrl);
  };

  const handleRemoveThumbnail = (onChange: (url: string) => void) => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCancel = () => navigate(SCREENS_PATH.COURSE_LIST);

  /* ─── Render ─── */
  return (
    <div className="course-add-new">

      {/* ── Page Header ── */}
      <div className="can-page-header">
        <div className="can-breadcrumb">
          <button type="button" className="can-breadcrumb-link" onClick={handleCancel}>
            <i className="fa-regular fa-list" />
            Course List
          </button>
          <i className="fa-regular fa-chevron-right can-breadcrumb-sep" />
          <span className="can-breadcrumb-current">Add New Course</span>
        </div>
        <div className="can-page-title">
          <div className="can-page-title-icon">
            <i className="fa-regular fa-graduation-cap" />
          </div>
          <h1 className="can-page-title-text">Add New Course</h1>
        </div>
      </div>

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

          {/* ── Left column: Main info ── */}
          <div className="can-col-main">

            {/* Basic Info Card */}
            <div className="card can-card">
              <div className="card-header">
                <div className="card-header-title can-card-title">
                  <i className="fa-regular fa-book-open" />
                  Basic Information
                </div>
              </div>
              <div className="card-body can-card-body">

                {/* Course Title */}
                <form.Field
                  name="title"
                  validators={{ onChange: validateField('title') }}
                  children={field => (
                    <div className="can-field">
                      <label htmlFor={field.name} className="form-label can-label">
                        Course Title <span className="can-required">*</span>
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        type="text"
                        className={`form-control ${field.state.meta.errors.length ? 'error' : ''}`}
                        placeholder="Enter course title..."
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        maxLength={200}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <span className="error-message can-error-msg">
                          {field.state.meta.errors.join(', ')}
                        </span>
                      )}
                      <span className="can-char-count">{field.state.value.length}/200</span>
                    </div>
                  )}
                />

                {/* Short Description */}
                <form.Field
                  name="shortDescription"
                  validators={{ onChange: validateField('shortDescription') }}
                  children={field => (
                    <div className="can-field">
                      <label htmlFor={field.name} className="form-label can-label">
                        Short Description
                      </label>
                      <textarea
                        id={field.name}
                        name={field.name}
                        className={`form-control can-textarea ${field.state.meta.errors.length ? 'error' : ''}`}
                        placeholder="Enter a brief overview of the course (max 500 characters)..."
                        value={field.state.value ?? ''}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        maxLength={500}
                        rows={3}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <span className="error-message can-error-msg">
                          {field.state.meta.errors.join(', ')}
                        </span>
                      )}
                      <span className="can-char-count">{(field.state.value ?? '').length}/500</span>
                    </div>
                  )}
                />

                {/* Full Description */}
                <form.Field
                  name="fullDescription"
                  validators={{ onChange: validateField('fullDescription') }}
                  children={field => (
                    <div className="can-field">
                      <label htmlFor={field.name} className="form-label can-label">
                        Full Description
                      </label>
                      <textarea
                        id={field.name}
                        name={field.name}
                        className={`form-control can-textarea can-textarea--tall ${field.state.meta.errors.length ? 'error' : ''}`}
                        placeholder="Enter a detailed description of the course content, objectives, and requirements (max 5000 characters)..."
                        value={field.state.value ?? ''}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        maxLength={5000}
                        rows={8}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <span className="error-message can-error-msg">
                          {field.state.meta.errors.join(', ')}
                        </span>
                      )}
                      <span className="can-char-count">{(field.state.value ?? '').length}/5000</span>
                    </div>
                  )}
                />

              </div>
            </div>

            {/* Thumbnail Card */}
            <div className="card can-card">
              <div className="card-header">
                <div className="card-header-title can-card-title">
                  <i className="fa-regular fa-image" />
                  Course Thumbnail
                </div>
              </div>
              <div className="card-body can-card-body">
                <form.Field
                  name="thumbnailUrl"
                  children={field => (
                    <>
                      {field.state.value ? (
                        <div className="can-thumbnail-preview-wrapper">
                          <img
                            src={field.state.value}
                            alt="Thumbnail preview"
                            className="can-thumbnail-preview"
                          />
                          <button
                            type="button"
                            className="can-thumbnail-remove"
                            onClick={() => handleRemoveThumbnail(field.handleChange)}
                            title="Remove image"
                          >
                            <i className="fa-regular fa-xmark" />
                          </button>
                        </div>
                      ) : (
                        <label htmlFor="course-thumbnail" className="can-dropzone">
                          <div className="can-dropzone-content">
                            <div className="can-dropzone-icon">
                              <i className="fa-regular fa-cloud-arrow-up" />
                            </div>
                            <div className="can-dropzone-text">
                              <span className="can-dropzone-primary">Click to upload image</span>
                              <span className="can-dropzone-secondary">PNG, JPG, WEBP · Max 5MB</span>
                            </div>
                          </div>
                        </label>
                      )}
                      <input
                        ref={fileInputRef}
                        id="course-thumbnail"
                        name="thumbnail-file"
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={e => handleThumbnailChange(e, field.handleChange)}
                        style={{ display: 'none' }}
                      />
                      {field.state.value && (
                        <button
                          type="button"
                          className="can-change-thumbnail-btn"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <i className="fa-regular fa-arrows-rotate" /> Change Image
                        </button>
                      )}
                    </>
                  )}
                />
              </div>
            </div>

          </div>

          {/* ── Right column: Settings ── */}
          <div className="can-col-side">

            {/* Status & Price Card */}
            <div className="card can-card">
              <div className="card-header">
                <div className="card-header-title can-card-title">
                  <i className="fa-regular fa-gear" />
                  Course Settings
                </div>
              </div>
              <div className="card-body can-card-body">

                {/* Status */}
                <form.Field
                  name="status"
                  validators={{ onChange: validateField('status') }}
                  children={field => (
                    <div className="can-field">
                      <label htmlFor={field.name} className="form-label can-label">
                        Status <span className="can-required">*</span>
                      </label>
                      <select
                        id={field.name}
                        name={field.name}
                        className={`form-select ${field.state.meta.errors.length ? 'error' : ''}`}
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      >
                        <option value={STATE.DRAFT}>📝 Draft</option>
                        <option value={STATE.PUBLISHED}>✅ Published</option>
                        <option value={STATE.ARCHIVED}>📦 Archived</option>
                      </select>
                      {field.state.meta.errors.length > 0 && (
                        <span className="error-message can-error-msg">
                          {field.state.meta.errors.join(', ')}
                        </span>
                      )}
                      <div className="can-status-preview">
                        <span className={`can-status-badge can-status-badge--${(field.state.value as ICourseStatus).toLowerCase()}`}>
                          {field.state.value === STATE.DRAFT && 'Draft'}
                          {field.state.value === STATE.PUBLISHED && 'Published'}
                          {field.state.value === STATE.ARCHIVED && 'Archived'}
                        </span>
                      </div>
                    </div>
                  )}
                />

                {/* Price */}
                <form.Field
                  name="price"
                  validators={{ onChange: validateField('price') }}
                  children={field => (
                    <div className="can-field">
                      <label htmlFor={field.name} className="form-label can-label">
                        Price (VND)
                      </label>
                      <div className="input-group">
                        <span className="input-group-text can-input-prefix">
                          <i className="fa-regular fa-dong-sign" />
                        </span>
                        <input
                          id={field.name}
                          name={field.name}
                          type="number"
                          className={`form-control ${field.state.meta.errors.length ? 'error' : ''}`}
                          placeholder="0"
                          value={field.state.value === 0 ? '' : field.state.value}
                          onChange={e => field.handleChange(e.target.value === '' ? 0 : Number(e.target.value))}
                          onBlur={field.handleBlur}
                          min={0}
                          step={1000}
                        />
                      </div>
                      {field.state.meta.errors.length > 0 && (
                        <span className="error-message can-error-msg">
                          {field.state.meta.errors.join(', ')}
                        </span>
                      )}
                      {field.state.value > 0 && (
                        <span className="can-price-display">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(field.state.value)}
                        </span>
                      )}
                      {field.state.value === 0 && (
                        <span className="can-price-free">Free course</span>
                      )}
                    </div>
                  )}
                />

              </div>
            </div>

            {/* Summary Card */}
            <form.Subscribe
              selector={state => ({
                title: state.values.title,
                status: state.values.status,
                price: state.values.price,
                thumbnailUrl: state.values.thumbnailUrl
              })}
              children={({ title, status, price, thumbnailUrl }) => (
                <div className="card can-card can-summary-card">
                  <div className="card-header">
                    <div className="card-header-title can-card-title">
                      <i className="fa-regular fa-clipboard-list" />
                      Summary
                    </div>
                  </div>
                  <div className="card-body can-card-body">
                    <ul className="can-summary-list">
                      <li className="can-summary-item">
                        <span className="can-summary-label">Title</span>
                        <span className="can-summary-value">
                          {title.trim() || <em className="can-summary-empty">Not entered</em>}
                        </span>
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
                        <span className="can-summary-label">Price</span>
                        <span className="can-summary-value">
                          {price > 0
                            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
                            : 'Free'}
                        </span>
                      </li>
                      <li className="can-summary-item">
                        <span className="can-summary-label">Thumbnail</span>
                        <span className="can-summary-value">
                          {thumbnailUrl ? '✔ Selected' : <em className="can-summary-empty">Not selected</em>}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            />

            {/* Action Buttons */}
            <form.Subscribe
              selector={state => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}
              children={({ canSubmit, isSubmitting }) => (
                <div className="can-actions">
                  <button
                    type="submit"
                    form="course-add-form"
                    className="btn btn-primary can-btn-submit"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting
                      ? <><i className="fa-regular fa-spinner-third fa-spin" /> Saving...</>
                      : <><i className="fa-regular fa-floppy-disk" /> Save Course</>
                    }
                  </button>
                  <button
                    type="button"
                    className="btn btn-light can-btn-cancel"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    <i className="fa-regular fa-xmark" /> Cancel
                  </button>
                </div>
              )}
            />

          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseAddNew;
export { CourseAddNew as Component };
