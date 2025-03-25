import { LayoutGridIcon, LayoutListIcon } from "lucide-react";
export const ViewModeToggle = ({ isCompact, onChange }) => {
  return (
    <div className="flex rounded-md bg-gray-50 dark:bg-gray-700 p-1">
      <button
        onClick={() => onChange(false)}
        className={`p-1.5 rounded transition-colors ${
          !isCompact
            ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
      >
        <LayoutListIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => onChange(true)}
        className={`p-1.5 rounded transition-colors ${
          isCompact
            ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
      >
        <LayoutGridIcon className="h-4 w-4" />
      </button>
    </div>
  );
};
