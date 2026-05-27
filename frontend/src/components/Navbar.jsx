import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              className="h-5 w-5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight">TaskFlow</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {isAuthenticated && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `hidden rounded-lg px-3 py-2 text-sm font-medium sm:inline-block ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              Dashboard
            </NavLink>
          )}
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-600 dark:text-slate-400 sm:inline">
                {user?.name}
              </span>
              <button type="button" onClick={logout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/signup" className="btn-primary">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
