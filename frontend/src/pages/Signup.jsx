import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { validateSignup } from '../utils/validators';
import { extractError } from '../services/api';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateSignup(form);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setSubmitting(true);
    try {
      await signup({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      toast.success('Account created!');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(extractError(err, 'Signup failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-[80vh] place-items-center">
      <div className="card w-full max-w-md p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Start organizing your work in seconds
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="label">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              className="input"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="input"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="input"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="label">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              className="input"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
