import React from 'react';
export const TabSelector = ({
  activeTab,
  onChange
}) => {
  return <div className="flex rounded-lg bg-gray-50 dark:bg-gray-700 p-1">
      <button className={`px-3 py-1 text-sm font-medium rounded-md transition-colors
          ${activeTab === 'active' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`} onClick={() => onChange('active')}>
        Active
      </button>
      <button className={`px-3 py-1 text-sm font-medium rounded-md transition-colors
          ${activeTab === 'departed' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`} onClick={() => onChange('departed')}>
        Departed
      </button>
    </div>;
};