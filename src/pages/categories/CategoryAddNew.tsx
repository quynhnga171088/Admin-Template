import { useNavigate } from 'react-router-dom';
import { useForm } from '@tanstack/react-form';
import { SCREENS_PATH } from '@/config/constant';
import { categorySchema, initialCategoryFormValues, type CategoryFormData } from './category.schema';
import { createCategory } from './categories.services';

const CategoryAddNew = () => {
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: initialCategoryFormValues,
    onSubmit: async ({ value }) => {
      await createCategory({
        categoryName: value.categoryName,
        description: value.description || undefined,
        avatar: value.avatar || undefined
      });
      navigate(SCREENS_PATH.CATEGORY_LIST);
    }
  });

  const validateField = (fieldName: keyof CategoryFormData) =>
    ({ value }: { value: unknown }) => {
      const result = categorySchema.shape[fieldName].safeParse(value);
      if (!result.success) return result.error.issues.map(i => i.message).join(', ');
      return undefined;
    };

  const handleCancel = () => navigate(SCREENS_PATH.CATEGORY_LIST);

  return (
    <div className="category-form-page">
      <form
        id="category-add-form"
        noValidate
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit().catch(() => {});
        }}
      >
        <div className="card">
          <div className="card-header">
            <div className="card-header-title">
              <i className="fa-regular fa-tag mr-2!" /> Add New Category
            </div>
          </div>
          <div className="card-body">

            {/* Category Name */}
            <form.Field name="categoryName" validators={{ onChange: validateField('categoryName') }}>
              {field => (
                <div className="mb-3">
                  <label htmlFor={field.name} className="form-label">
                    Category Name <span className="text-danger">*</span>
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    className={`form-control ${field.state.meta.errors.length ? 'is-invalid' : ''}`}
                    placeholder="Enter category name..."
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    maxLength={255}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="invalid-feedback">{field.state.meta.errors.join(', ')}</div>
                  )}
                </div>
              )}
            </form.Field>

            {/* Avatar */}
            <form.Field name="avatar" validators={{ onChange: validateField('avatar') }}>
              {field => (
                <div className="mb-3">
                  <label htmlFor={field.name} className="form-label">Avatar</label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    className={`form-control ${field.state.meta.errors.length ? 'is-invalid' : ''}`}
                    placeholder="e.g. fa-code, 🎓 or icon class name (max 50 chars)"
                    value={field.state.value ?? ''}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    maxLength={50}
                  />
                  <div className="form-text">
                    {(field.state.value ?? '').length}/50 characters
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <div className="invalid-feedback">{field.state.meta.errors.join(', ')}</div>
                  )}
                </div>
              )}
            </form.Field>

            {/* Description */}
            <form.Field name="description" validators={{ onChange: validateField('description') }}>
              {field => (
                <div className="mb-3">
                  <label htmlFor={field.name} className="form-label">Description</label>
                  <textarea
                    id={field.name}
                    name={field.name}
                    rows={4}
                    className={`form-control ${field.state.meta.errors.length ? 'is-invalid' : ''}`}
                    placeholder="Enter category description..."
                    value={field.state.value ?? ''}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <div className="invalid-feedback">{field.state.meta.errors.join(', ')}</div>
                  )}
                </div>
              )}
            </form.Field>

          </div>
          <div className="card-footer d-flex gap-2 justify-content-end">
            <button type="button" className="btn btn-light" onClick={handleCancel}>
              <i className="fa-regular fa-xmark" /> Cancel
            </button>
            <form.Subscribe selector={s => ({ canSubmit: s.canSubmit, isSubmitting: s.isSubmitting })}>
              {({ canSubmit, isSubmitting }) => (
                <button
                  type="submit"
                  form="category-add-form"
                  className="btn btn-primary"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting
                    ? <span><i className="fa-regular fa-spinner-third fa-spin" /> Saving...</span>
                    : <span><i className="fa-regular fa-floppy-disk" /> Save Category</span>}
                </button>
              )}
            </form.Subscribe>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryAddNew;
export { CategoryAddNew as Component };
