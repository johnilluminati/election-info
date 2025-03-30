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
      className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-gray-700"
    >
      <input
        type="checkbox"
        id="DarkModeToggle"
        className="peer sr-only"
        checked={isDarkMode}
        onChange={toggleTheme}
      />

      <span
        className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-white transition-all peer-checked:start-6"
      ></span>
    </label>

  )
}

export default DarkModeToggle;