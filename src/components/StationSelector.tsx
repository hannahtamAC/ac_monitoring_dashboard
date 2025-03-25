import React from 'react';
import { MapPinIcon } from 'lucide-react';
const STATIONS = [{
  code: 'YYZ',
  name: 'Toronto Pearson'
}, {
  code: 'YVR',
  name: 'Vancouver'
}, {
  code: 'YUL',
  name: 'Montreal'
}, {
  code: 'YYC',
  name: 'Calgary'
}, {
  code: 'YEG',
  name: 'Edmonton'
}, {
  code: 'YHZ',
  name: 'Halifax'
}, {
  code: 'YOW',
  name: 'Ottawa'
}, {
  code: 'YWG',
  name: 'Winnipeg'
}] as const;
export const StationSelector = ({
  value,
  onChange
}) => {
  return <div className="flex items-center">
      <MapPinIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
      <select value={value} onChange={e => onChange(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C60C30] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <option value="all">All Stations</option>
        {STATIONS.map(station => <option key={station.code} value={station.code}>
            {station.name} ({station.code})
          </option>)}
      </select>
    </div>;
};