import React, { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address';
  return '';
};

const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return '';
};

const LoginForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit?.(formData);
    } catch {
      setErrors((prev) => ({ ...prev, email: 'Login failed. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({ email: '', password: '' });
    setErrors({ email: '', password: '' });
    setShowPassword(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Login
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors
                focus:ring-2 focus:ring-blue-500
                ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={`w-full rounded-lg border px-4 py-2.5 pr-12 text-sm outline-none transition-colors
                  focus:ring-2 focus:ring-blue-500
                  ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" role="alert" className="mt-1 text-sm text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors
                hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={isLoading}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700
                transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
