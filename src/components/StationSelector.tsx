import { MapPinIcon } from "lucide-react";
import { generateUniqueKey } from "../utils/utils";

type StationSelectorProps = {
  stations: string[];
  value: string;
  onChange: (s: string) => void;
  placeholder: string;
};
export const StationSelector = ({
  stations,
  value,
  onChange,
  placeholder,
}: StationSelectorProps) => {
  return (
    <div className="flex items-center">
      <MapPinIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C60C30] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        <option value="">{placeholder}</option>
        {stations.map((station) => (
          <option key={`${generateUniqueKey(station)}`} value={station}>
            {station}
          </option>
        ))}
      </select>
    </div>
  );
};
