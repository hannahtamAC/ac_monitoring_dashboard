import React from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';
export const DarkModeToggle = ({
  isDark,
  onChange
}) => {
  return <button onClick={() => onChange(!isDark)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>;
};