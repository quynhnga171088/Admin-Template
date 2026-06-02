import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { register } from '@/pages/register/register.services';
import '@/pages/register/Register.scss';
import {
  type RegisterFormData,
  initialRegisterFormValues,
  registerSchema
} from '@/pages/register/register.schema.ts';
import { registerStore } from '@/stores/register.store.ts';
import { SCREENS_PATH } from '@/config/constant.ts';

const Register = () => {
  const navigate = useNavigate();

  const errorMessage = registerStore(state => state.errorMessage);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const submit = (value: RegisterFormData) => {
    return register(value, navigate);
  };

  const mutation = useMutation({
    mutationFn: submit,
    onSuccess: async () => {
      form.reset();
    }
  });

  const form = useForm({
    defaultValues: initialRegisterFormValues as RegisterFormData,
    onSubmit: async function ({ value }) {
      await mutation.mutateAsync(value);
    }
  });

  return (
    <div className="register-card">
      <div className="grid grid-cols-12 gap-0">
        {/* Left panel */}
        <div className="col-span-5 register-slogan">
          <i className="register-icon fa-light fa-user-plus" />
          <p className="register-slogan-text">
            Join us today and unlock a world of knowledge with our Education Management System.
          </p>
        </div>

        {/* Right panel */}
        <div className="col-span-7">
          <div className="register-content">
            {/* Header */}
            <div className="register-header">
              <div className="register-logo flex">
                <i className="fa-regular fa-graduation-cap" aria-hidden="true" />
              </div>
              <h1 className="register-title">Create Account</h1>
              <p className="register-subtitle">
                <span>Education Management System</span>
              </p>
              {errorMessage ? <p className="register-error">{errorMessage}</p> : ''}
            </div>

            {/* Form */}
            <form
              className="register-form"
              onSubmit={event => {
                event.preventDefault();
                event.stopPropagation();
                form.handleSubmit().catch(() => {});
              }}
            >
              {/* Full Name */}
              <form.Field
                name="fullName"
                validators={{
                  onChange: ({ value }) => {
                    const result = registerSchema.shape.fullName.safeParse(value);
                    if (!result.success) {
                      return result.error.issues.map(issue => issue.message).join(', ');
                    }
                    return undefined;
                  }
                }}
                children={field => (
                  <div className="form-group">
                    <label className="form-label" htmlFor={field.name}>Full Name</label>
                    <div className="input-icon-wrapper">
                      <i className="fa-thin fa-user input-icon" aria-hidden="true" />
                      <input
                        id={field.name}
                        name={field.name}
                        type="text"
                        className={`form-control ${field.state.meta.errors.length ? 'is-invalid border-red-500' : ''}`}
                        placeholder="Your full name"
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </div>
                    {field.state.meta.errors.length ? (
                      <em className="text-red-500 text-sm mt-1 block px-1">
                        {field.state.meta.errors.join(', ')}
                      </em>
                    ) : null}
                  </div>
                )}
              />

              {/* Phone */}
              <form.Field
                name="phone"
                validators={{
                  onChange: ({ value }) => {
                    const result = registerSchema.shape.phone.safeParse(value);
                    if (!result.success) {
                      return result.error.issues.map(issue => issue.message).join(', ');
                    }
                    return undefined;
                  }
                }}
                children={field => (
                  <div className="form-group">
                    <label className="form-label" htmlFor={field.name}>Phone Number</label>
                    <div className="input-icon-wrapper">
                      <i className="fa-thin fa-phone input-icon" aria-hidden="true" />
                      <input
                        id={field.name}
                        name={field.name}
                        type="tel"
                        className={`form-control ${field.state.meta.errors.length ? 'is-invalid border-red-500' : ''}`}
                        placeholder="Vietnamese phone number"
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </div>
                    {field.state.meta.errors.length ? (
                      <em className="text-red-500 text-sm mt-1 block px-1">
                        {field.state.meta.errors.join(', ')}
                      </em>
                    ) : null}
                  </div>
                )}
              />

              {/* Email */}
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const result = registerSchema.shape.email.safeParse(value);
                    if (!result.success) {
                      return result.error.issues.map(issue => issue.message).join(', ');
                    }
                    return undefined;
                  }
                }}
                children={field => (
                  <div className="form-group">
                    <label className="form-label" htmlFor={field.name}>Email Address</label>
                    <div className="input-icon-wrapper">
                      <i className="fa-thin fa-envelope input-icon" aria-hidden="true" />
                      <input
                        id={field.name}
                        name={field.name}
                        type="text"
                        className={`form-control ${field.state.meta.errors.length ? 'is-invalid border-red-500' : ''}`}
                        placeholder="your@email.com"
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </div>
                    {field.state.meta.errors.length ? (
                      <em className="text-red-500 text-sm mt-1 block px-3">
                        {field.state.meta.errors.join(', ')}
                      </em>
                    ) : null}
                  </div>
                )}
              />

              {/* Password */}
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    const result = registerSchema.shape.password.safeParse(value);
                    if (!result.success) {
                      return result.error.issues.map(issue => issue.message).join(', ');
                    }
                    return undefined;
                  }
                }}
                children={field => (
                  <div className="form-group">
                    <label className="form-label" htmlFor={field.name}>Password</label>
                    <div className="input-icon-wrapper">
                      <i className="fa-thin fa-lock input-icon" aria-hidden="true" />
                      <input
                        id={field.name}
                        name={field.name}
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${field.state.meta.errors.length ? 'is-invalid border-red-500' : ''}`}
                        placeholder="Min 8 chars"
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        <i className={`fa-thin ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
                      </button>
                    </div>
                    {field.state.meta.errors.length ? (
                      <em className="text-red-500 text-sm mt-1 block px-1">
                        {field.state.meta.errors.join(', ')}
                      </em>
                    ) : null}
                  </div>
                )}
              />

              {/* Confirm Password */}
              <form.Field
                name="confirmPassword"
                validators={{
                  onChangeListenTo: ['password'],
                  onChange: ({ value, fieldApi }) => {
                    const password = fieldApi.form.getFieldValue('password');
                    if (!value) return 'Please confirm your password!';
                    if (value !== password) return 'Passwords do not match!';
                    return undefined;
                  }
                }}
                children={field => (
                  <div className="form-group">
                    <label className="form-label" htmlFor={field.name}>Confirm Password</label>
                    <div className="input-icon-wrapper">
                      <i className="fa-thin fa-lock-keyhole input-icon" aria-hidden="true" />
                      <input
                        id={field.name}
                        name={field.name}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-control ${field.state.meta.errors.length ? 'is-invalid border-red-500' : ''}`}
                        placeholder="Re-enter password"
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        <i className={`fa-thin ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
                      </button>
                    </div>
                    {field.state.meta.errors.length ? (
                      <em className="text-red-500 text-sm mt-1 block px-1">
                        {field.state.meta.errors.join(', ')}
                      </em>
                    ) : null}
                  </div>
                )}
              />

              {/* Submit Button */}
              <form.Subscribe
                selector={state => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <button
                    type="submit"
                    id="register-submit-btn"
                    className="btn btn-info btn-register"
                    disabled={!canSubmit || isSubmitting}
                  >
                    <i className="fa-thin fa-user-plus" />
                    {isSubmitting ? ' Creating account...' : ' Create Account'}
                  </button>
                )}
              />

              {/* Login redirect */}
              <div className="login-redirect">
                Already have an account?{' '}
                <span
                  className="login-link"
                  onClick={() => navigate(SCREENS_PATH.LOGIN)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate(SCREENS_PATH.LOGIN)}
                >
                  Sign in here
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Register as Component };
