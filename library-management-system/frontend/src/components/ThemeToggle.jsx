import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle topbar-icon-link"
      type="button"
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={toggleTheme}
    >
      <span className="theme-toggle-sr">Toggle theme</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        width="1em"
        height="1em"
        fill="currentColor"
        strokeLinecap="round"
        className="theme-toggle__classic"
        viewBox="0 0 32 32"
      >
        <clipPath id="theme-toggle__classic__cutout">
          <path
            className="theme-toggle__classic__cutout"
            d={theme === 'dark' ? 'M0-5h30a1 1 0 0 0 9 13v24H0Z' : 'M0-5h30a1 1 0 0 0 9 13v24H0Z'}
          />
        </clipPath>
        <g clipPath="url(#theme-toggle__classic__cutout)">
          <circle cx="16" cy="16" r="9.34" />
          <g stroke="currentColor" strokeWidth="1.5">
            <path d="M16 5.5v-4" />
            <path d="M16 30.5v-4" />
            <path d="M1.5 16h4" />
            <path d="M26.5 16h4" />
            <path d="m23.4 8.6 2.8-2.8" />
            <path d="m5.7 26.3 2.9-2.9" />
            <path d="m5.8 5.8 2.8 2.8" />
            <path d="m23.4 23.4 2.9 2.9" />
          </g>
        </g>
      </svg>
    </button>
  );
}
