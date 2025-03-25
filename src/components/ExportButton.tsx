import React from 'react';
import { DownloadIcon } from 'lucide-react';
import { generateExportData, downloadExportFile } from '../utils/exportUtils';
export const ExportButton = ({
  flights,
  station
}) => {
  const handleExport = () => {
    const data = generateExportData(flights, station);
    downloadExportFile(data);
  };
  return <button onClick={handleExport} className="flex items-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md transition-colors">
      <DownloadIcon className="h-4 w-4 mr-2" />
      Export Data
    </button>;
};