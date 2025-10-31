import { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const storedTheme = localStorage.getItem('theme');
  const [isDarkMode, setIsDarkMode] = useState((storedTheme && storedTheme === 'dark') || false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading && (storedTheme && storedTheme === 'dark')) {
      setIsDarkMode(true);
    }
    setIsLoading(false);
  }, [isDarkMode, isLoading, storedTheme]);

  useEffect(() => {
    const toggleVal = isDarkMode ? 'dark' : 'light';

    if (!storedTheme || (storedTheme && storedTheme !== toggleVal)) {
      localStorage.setItem('theme', toggleVal);
    }

    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode, storedTheme]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  }

  return (
    <label
      htmlFor="DarkModeToggle"
      id="lblDarkModeToggle"
      className="relative inline-flex h-9 w-16 cursor-pointer items-center rounded-full bg-gray-300 p-1 shadow-lg transition-all duration-300 [-webkit-tap-highlight-color:_transparent] hover:shadow-xl dark:bg-slate-700"
    >
      <input
        type="checkbox"
        id="DarkModeToggle"
        className="peer sr-only"
        checked={isDarkMode}
        onChange={toggleTheme}
      />

      {/* Toggle circle with icon */}
      <span
        className={`absolute flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 dark:bg-slate-900 dark:shadow-inner ${
          isDarkMode ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {/* Sun icon - visible in light mode */}
        {!isDarkMode && (
          <svg
            className="h-4 w-4 text-gray-600 transition-all duration-300"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        )}

        {/* Moon icon - visible in dark mode */}
        {isDarkMode && (
          <svg
            className="h-4 w-4 text-slate-300 transition-all duration-300"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </span>
    </label>
  )
}

export default DarkModeToggle;