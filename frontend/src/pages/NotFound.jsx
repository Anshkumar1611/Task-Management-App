import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="grid min-h-[70vh] place-items-center">
    <div className="card max-w-md p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
        404
      </p>
      <h1 className="mt-2 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/dashboard" className="btn-primary mt-6">
        Back to dashboard
      </Link>
    </div>
  </div>
);

export default NotFound;
