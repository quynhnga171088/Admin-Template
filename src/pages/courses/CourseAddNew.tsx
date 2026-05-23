import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { createCourse } from './courses.services.ts';
import type { ICourseCreateRequest, ICourseStatus } from '@/types/types.ts';
import { SCREENS_PATH, STATE } from '@/config/constant';
import '@/pages/courses/CourseAddNew.scss';

interface IFormErrors {
  title?: string;
  price?: string;
  status?: string;
}

const INITIAL_FORM: ICourseCreateRequest = {
  title: '',
  shortDescription: '',
  thumbnailUrl: '',
  price: 0,
  status: 'DRAFT'
};

const CourseAddNew = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<ICourseCreateRequest>(INITIAL_FORM);
  const [errors, setErrors] = useState<IFormErrors>({});
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ─── Validation ─── */
  const validate = (): boolean => {
    const newErrors: IFormErrors = {};
    if (!form.title.trim()) newErrors.title = 'Tiêu đề khóa học không được để trống.';
    if (form.price < 0) newErrors.price = 'Giá không được âm.';
    if (!form.status) newErrors.status = 'Vui lòng chọn trạng thái.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ─── Handlers ─── */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setThumbnailPreview(objectUrl);
    // In real scenario you'd upload and get back a URL; here we store object URL as placeholder
    setForm(prev => ({ ...prev, thumbnailUrl: objectUrl }));
  };

  const handleRemoveThumbnail = () => {
    setThumbnailPreview('');
    setForm(prev => ({ ...prev, thumbnailUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await createCourse(form);
      setSuccessMessage('Khóa học đã được tạo thành công!');
      setTimeout(() => navigate(SCREENS_PATH.COURSE_LIST), 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate(SCREENS_PATH.COURSE_LIST);

  /* ─── Render ─── */
  return (
    <div className="course-add-new">
      {/* Page Header */}
      <div className="can-page-header">
        <div className="can-breadcrumb">
          <button type="button" className="can-breadcrumb-link" onClick={handleCancel}>
            <i className="fa-regular fa-list" />
            Danh sách khóa học
          </button>
          <i className="fa-regular fa-chevron-right can-breadcrumb-sep" />
          <span className="can-breadcrumb-current">Thêm khóa học mới</span>
        </div>
        <div className="can-page-title">
          <div className="can-page-title-icon">
            <i className="fa-regular fa-graduation-cap" />
          </div>
          <h1 className="can-page-title-text">Thêm khóa học mới</h1>
        </div>
      </div>

      {/* Alert Messages */}
      {successMessage && (
        <div className="can-alert can-alert-success">
          <i className="fa-regular fa-circle-check" />
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="can-alert can-alert-error">
          <i className="fa-regular fa-circle-exclamation" />
          {errorMessage}
        </div>
      )}

      <form id="course-add-form" onSubmit={handleSubmit} noValidate>
        <div className="can-layout">

          {/* ── Left column: Main info ── */}
          <div className="can-col-main">

            {/* Basic Info Card */}
            <div className="card can-card">
              <div className="card-header">
                <div className="card-header-title can-card-title">
                  <i className="fa-regular fa-book-open" />
                  Thông tin cơ bản
                </div>
              </div>
              <div className="card-body can-card-body">

                {/* Title */}
                <div className="can-field">
                  <label htmlFor="course-title" className="form-label can-label">
                    Tiêu đề khóa học <span className="can-required">*</span>
                  </label>
                  <input
                    id="course-title"
                    name="title"
                    type="text"
                    className={`form-control ${errors.title ? 'error' : ''}`}
                    placeholder="Nhập tiêu đề khóa học..."
                    value={form.title}
                    onChange={handleChange}
                    maxLength={200}
                    disabled={isSubmitting}
                  />
                  {errors.title && <span className="error-message can-error-msg">{errors.title}</span>}
                  <span className="can-char-count">{form.title.length}/200</span>
                </div>

                {/* Short Description */}
                <div className="can-field">
                  <label htmlFor="course-short-desc" className="form-label can-label">
                    Mô tả ngắn
                  </label>
                  <textarea
                    id="course-short-desc"
                    name="shortDescription"
                    className="form-control can-textarea"
                    placeholder="Nhập mô tả ngắn về khóa học (tối đa 500 ký tự)..."
                    value={form.shortDescription}
                    onChange={handleChange}
                    maxLength={500}
                    rows={4}
                    disabled={isSubmitting}
                  />
                  <span className="can-char-count">{(form.shortDescription ?? '').length}/500</span>
                </div>

              </div>
            </div>

            {/* Thumbnail Card */}
            <div className="card can-card">
              <div className="card-header">
                <div className="card-header-title can-card-title">
                  <i className="fa-regular fa-image" />
                  Ảnh bìa khóa học
                </div>
              </div>
              <div className="card-body can-card-body">
                {thumbnailPreview ? (
                  <div className="can-thumbnail-preview-wrapper">
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="can-thumbnail-preview" />
                    <button
                      type="button"
                      className="can-thumbnail-remove"
                      onClick={handleRemoveThumbnail}
                      title="Xóa ảnh"
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
                        <span className="can-dropzone-primary">Nhấn để tải ảnh lên</span>
                        <span className="can-dropzone-secondary">PNG, JPG, WEBP · Tối đa 5MB</span>
                      </div>
                    </div>
                  </label>
                )}
                <input
                  ref={fileInputRef}
                  id="course-thumbnail"
                  name="thumbnail"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleThumbnailChange}
                  style={{ display: 'none' }}
                  disabled={isSubmitting}
                />
                {thumbnailPreview && (
                  <button
                    type="button"
                    className="can-change-thumbnail-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                  >
                    <i className="fa-regular fa-arrows-rotate" /> Đổi ảnh
                  </button>
                )}
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
                  Cài đặt khóa học
                </div>
              </div>
              <div className="card-body can-card-body">

                {/* Status */}
                <div className="can-field">
                  <label htmlFor="course-status" className="form-label can-label">
                    Trạng thái <span className="can-required">*</span>
                  </label>
                  <select
                    id="course-status"
                    name="status"
                    className={`form-select ${errors.status ? 'error' : ''}`}
                    value={form.status}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value={STATE.DRAFT}>📝 Nháp (Draft)</option>
                    <option value={STATE.PUBLISHED}>✅ Công khai (Published)</option>
                    <option value={STATE.ARCHIVED}>📦 Lưu trữ (Archived)</option>
                  </select>
                  {errors.status && <span className="error-message can-error-msg">{errors.status}</span>}

                  {/* Status badge preview */}
                  <div className="can-status-preview">
                    <span className={`can-status-badge can-status-badge--${(form.status as ICourseStatus).toLowerCase()}`}>
                      {form.status === STATE.DRAFT && 'Nháp'}
                      {form.status === STATE.PUBLISHED && 'Công khai'}
                      {form.status === STATE.ARCHIVED && 'Lưu trữ'}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="can-field">
                  <label htmlFor="course-price" className="form-label can-label">
                    Giá khóa học (VND)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text can-input-prefix">
                      <i className="fa-regular fa-dong-sign" />
                    </span>
                    <input
                      id="course-price"
                      name="price"
                      type="number"
                      className={`form-control ${errors.price ? 'error' : ''}`}
                      placeholder="0"
                      value={form.price === 0 ? '' : form.price}
                      onChange={handleChange}
                      min={0}
                      step={1000}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.price && <span className="error-message can-error-msg">{errors.price}</span>}
                  {form.price > 0 && (
                    <span className="can-price-display">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(form.price)}
                    </span>
                  )}
                  {form.price === 0 && (
                    <span className="can-price-free">Khóa học miễn phí</span>
                  )}
                </div>

              </div>
            </div>

            {/* Summary Card */}
            <div className="card can-card can-summary-card">
              <div className="card-header">
                <div className="card-header-title can-card-title">
                  <i className="fa-regular fa-clipboard-list" />
                  Tóm tắt
                </div>
              </div>
              <div className="card-body can-card-body">
                <ul className="can-summary-list">
                  <li className="can-summary-item">
                    <span className="can-summary-label">Tiêu đề</span>
                    <span className="can-summary-value">{form.title.trim() || <em className="can-summary-empty">Chưa nhập</em>}</span>
                  </li>
                  <li className="can-summary-item">
                    <span className="can-summary-label">Trạng thái</span>
                    <span className={`can-status-badge can-status-badge--${(form.status as ICourseStatus).toLowerCase()}`}>
                      {form.status === STATE.DRAFT && 'Nháp'}
                      {form.status === STATE.PUBLISHED && 'Công khai'}
                      {form.status === STATE.ARCHIVED && 'Lưu trữ'}
                    </span>
                  </li>
                  <li className="can-summary-item">
                    <span className="can-summary-label">Giá</span>
                    <span className="can-summary-value">
                      {form.price > 0
                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(form.price)
                        : 'Miễn phí'}
                    </span>
                  </li>
                  <li className="can-summary-item">
                    <span className="can-summary-label">Ảnh bìa</span>
                    <span className="can-summary-value">{thumbnailPreview ? '✔ Đã chọn' : <em className="can-summary-empty">Chưa chọn</em>}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="can-actions">
              <button
                type="submit"
                form="course-add-form"
                className="btn btn-primary can-btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? <><i className="fa-regular fa-spinner-third fa-spin" /> Đang lưu...</>
                  : <><i className="fa-regular fa-floppy-disk" /> Lưu khóa học</>
                }
              </button>
              <button
                type="button"
                className="btn btn-light can-btn-cancel"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <i className="fa-regular fa-xmark" /> Hủy
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseAddNew;
export { CourseAddNew as Component };
