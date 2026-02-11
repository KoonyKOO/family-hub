import React, { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validators = {
  name: (value) => {
    if (!value) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    return '';
  },
  email: (value) => {
    if (!value) return 'Email is required';
    if (!EMAIL_REGEX.test(value)) return 'Please enter a valid email address';
    return '';
  },
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return '';
  },
  confirmPassword: (value, formData) => {
    if (!value) return 'Please confirm your password';
    if (value !== formData.password) return 'Passwords do not match';
    return '';
  },
};

const initialFormData = { name: '', email: '', password: '', confirmPassword: '' };
const initialErrors = { name: '', email: '', password: '', confirmPassword: '' };

const SignupForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState(initialErrors);
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

    const newErrors = {};
    let hasError = false;
    for (const field of Object.keys(validators)) {
      const error = validators[field](formData[field], formData);
      newErrors[field] = error;
      if (error) hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      await onSubmit?.(submitData);
    } catch {
      setErrors((prev) => ({ ...prev, email: 'Signup failed. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData(initialFormData);
    setErrors(initialErrors);
    setShowPassword(false);
  };

  const inputClassName = (field) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors
    focus:ring-2 focus:ring-blue-500
    ${errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={inputClassName('name')}
            />
            {errors.name && (
              <p id="name-error" role="alert" className="mt-1 text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

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
              className={inputClassName('email')}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
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
                placeholder="At least 8 characters"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={`${inputClassName('password')} pr-12`}
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

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              className={inputClassName('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p id="confirmPassword-error" role="alert" className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
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
              {isLoading ? 'Signing up...' : 'Sign Up'}
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

export default SignupForm;
