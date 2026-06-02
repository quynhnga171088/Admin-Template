import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { login } from '@/pages/login/auth.services';
import '@/pages/login/Login.scss';
import { type AuthFormData, authSchema, initialAuthFormValues } from '@/pages/login/auth.schema.ts';
import type { IAuthForm } from '@/types/types.ts';
import { authStore } from '@/stores/auth.store.ts';
import { SCREENS_PATH } from '@/config/constant.ts';

const Login = () => {
  const navigate = useNavigate();

  const errorMessage = authStore(state => state.errorMessage);

  const [showPassword, setShowPassword] = useState(false);

  const submit = (value: IAuthForm) => {
    return login(value, navigate);
  };

  const mutation = useMutation({
    mutationFn: submit,
    onSuccess: async () => {
      form.reset();
    }
  });

  const form = useForm({
    defaultValues: initialAuthFormValues as AuthFormData,
    onSubmit: async function ({ value }) {
      await mutation.mutateAsync(value);
    }
  });

  return (
    <div className="login-card">
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-6 login-slogan">
          <div className="login-slogan flex flex-col items-center justify-center h-full">
            <i className="login-key fa-light fa-lock-keyhole" />
          </div>
        </div>
        <div className="col-span-6">
          <div className="login-content">
            <div className="login-header">
              <div className="login-logo flex">
                <i className="fa-regular fa-graduation-cap" aria-hidden="true" />
              </div>
              <h1 className="login-title">Login</h1>
              <p className="login-subtitle">
                <span className="">Education Management System</span>
              </p>
              {errorMessage ? <p className="login-error">{errorMessage}</p> : ''}
            </div>
            <form className="login-form" onSubmit={event => {
              event.preventDefault();
              event.stopPropagation();
              form.handleSubmit().catch(() => {});
            }}>
              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const result = authSchema.shape.email.safeParse(value);
                    if (!result.success) {
                      return result.error.issues.map(issue => issue.message).join(', ');
                    }
                    return undefined;
                  }
                }}
                children={field => {
                  return <div className="form-group">
                    <div className="input-icon-wrapper">
                      <i className="fa-thin fa-user input-icon" aria-hidden="true" />
                      <input
                        id={field.name}
                        name={field.name}
                        type="text"
                        className={`form-control ${field.state.meta.errors.length ? 'is-invalid border-red-500' : ''}`}
                        placeholder="Input your email"
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </div>
                    {field.state.meta.errors.length ? (
                      <em className="text-red-500 text-sm mt-1 block px-3">{field.state.meta.errors.join(', ')}</em>
                    ) : null}
                  </div>;
                }}
              />

              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    const result = authSchema.shape.password.safeParse(value);
                    if (!result.success) {
                      return result.error.issues.map(issue => issue.message).join(', ');
                    }
                    return undefined;
                  }
                }}
                children={field => (
                  <div className="form-group">
                    <div className="input-icon-wrapper">
                      <i className="fa-thin fa-lock input-icon" aria-hidden="true" />
                      <input
                        id={field.name}
                        name={field.name}
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${field.state.meta.errors.length ? 'is-invalid border-red-500' : ''}`}
                        placeholder="Input your password"
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        <i className={`fa-thin ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" />
                      </button>
                    </div>
                    {field.state.meta.errors.length ? (
                      <em className="text-red-500 text-sm mt-1 block px-3">{field.state.meta.errors.join(', ')}</em>
                    ) : null}
                  </div>
                )}
              />

              {/* Options */}
              <div className="login-options">
                <form.Field
                  name="remember"
                  children={field => (
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={field.name}
                        name={field.name}
                        checked={field.state.value}
                        onChange={e => field.handleChange(e.target.checked)}
                        onBlur={field.handleBlur}
                      />
                      <label className="form-check-label" htmlFor={field.name}>
                        Remember Me
                      </label>
                    </div>
                  )}
                />
                <div className="cursor-pointer forgot-password-link" onClick={e => e.preventDefault()}>
                  Forgot your password?
                </div>
              </div>
              <form.Subscribe
                selector={state => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <button type="submit" className="btn btn-info btn-login" disabled={!canSubmit || isSubmitting}>
                    <i className="fa-thin fa-arrow-right-to-arc"/> {isSubmitting ? 'Logging in...' : 'Login'}
                  </button>
                )}
              />
              <div className="login-redirect" style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                Don't have an account?{' '}
                <span
                  style={{ color: '#41c3df', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => navigate(SCREENS_PATH.REGISTER)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate(SCREENS_PATH.REGISTER)}
                >
                  Create one here
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Login as Component };
