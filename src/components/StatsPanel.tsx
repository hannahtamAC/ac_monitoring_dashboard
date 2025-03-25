import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { MultiSelect } from './MultiSelect';
interface Stats {
  total: number;
  departed: number;
  remaining: number;
  onTime: number;
  early: number;
  late: number;
  otp: number;
}
const calculateStats = (flights, filters) => {
  const filteredFlights = flights.filter(flight => {
    const matchesType = filters.flightType === 'all' || flight.flightType === filters.flightType;
    const matchesOperator = filters.operators.length === 0 || filters.operators.includes(flight.operator);
    return matchesType && matchesOperator;
  });
  const departedFlights = filteredFlights.filter(f => f.status === 'departed');
  const onTimeFlights = departedFlights.filter(f => {
    const diff = f.actualDeparture.getTime() - f.scheduledDeparture.getTime();
    const minutesDiff = Math.round(diff / 60000);
    return minutesDiff <= 15; // Industry standard: flights up to 15 minutes late are considered on time
  });
  const earlyFlights = departedFlights.filter(f => {
    const diff = f.actualDeparture.getTime() - f.scheduledDeparture.getTime();
    return diff < 0;
  });
  return {
    total: filteredFlights.length,
    departed: departedFlights.length,
    remaining: filteredFlights.length - departedFlights.length,
    onTime: onTimeFlights.length,
    early: earlyFlights.length,
    late: departedFlights.length - onTimeFlights.length - earlyFlights.length,
    otp: departedFlights.length > 0 ? Math.round(onTimeFlights.length / departedFlights.length * 100) : 100
  };
};
export const StatsPanel = ({
  flights,
  filters,
  onFilterChange
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const stats = calculateStats(flights, filters);
  return <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full px-6 py-4 flex items-center justify-between text-left">
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Performance Statistics
        </span>
        {isExpanded ? <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : <ChevronDownIcon className="h-5 w-5 text-gray-500" />}
      </button>
      {isExpanded && <div className="px-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Flight Type
                </span>
                <select value={filters.flightType} onChange={e => onFilterChange({
              ...filters,
              flightType: e.target.value
            })} className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#C60C30]">
                  <option value="all">All Routes</option>
                  <option value="domestic">Domestic</option>
                  <option value="transborder">Transborder</option>
                  <option value="international">International</option>
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Operators
                </span>
                <MultiSelect options={[{
              value: 'mainline',
              label: 'Air Canada'
            }, {
              value: 'rouge',
              label: 'Rouge'
            }, {
              value: 'jazz',
              label: 'Jazz'
            }]} selected={filters.operators} onChange={values => onFilterChange({
              ...filters,
              operators: values
            })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C60C30]">
                  {stats.otp}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  On-Time Performance
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.departed}/{stats.total}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Flights Departed
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-t pt-4 dark:border-gray-700">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {stats.early}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Early
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {stats.onTime}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                On Time
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">
                {stats.late}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Late
              </div>
            </div>
          </div>
        </div>}
    </div>;
};