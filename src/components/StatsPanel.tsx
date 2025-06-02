import { useEffect, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  GlobeIcon,
  PlaneTakeoffIcon,
} from "lucide-react";
import { MultiSelect } from "./shared/MultiSelect";
import { useQuery } from "../hooks/useQuery";
import { AirlineCode, FlightStatus } from "../types/shared";
import { isPastDepartureTime } from "../utils/timeUtils";

const calculateStats = (
  flights: FlightStatus[],
  filters: {
    flightType: string;
    operators: AirlineCode[];
  },
  currentTime: number
) => {
  const filteredFlights = flights.filter((flight) => {
    const matchesOperator =
      filters.operators.length === 0 ||
      filters.operators.includes(flight.carrierCode);
    return matchesOperator;
  });
  const departedFlights = filteredFlights.filter((f) =>
    isPastDepartureTime(f, currentTime)
  );
  const onTimeFlights = departedFlights.filter((f) => {
    return f.statusCode === "ONT";
  });
  const earlyFlights = departedFlights.filter((f) => {
    return f.statusCode === "EAR";
  });
  return {
    total: filteredFlights.length,
    departed: departedFlights.length,
    remaining: filteredFlights.length - departedFlights.length,
    onTime: onTimeFlights.length,
    early: earlyFlights.length,
    late: departedFlights.length - onTimeFlights.length - earlyFlights.length,
    otp:
      departedFlights.length > 0
        ? Math.round((onTimeFlights.length / departedFlights.length) * 100)
        : 100,
  };
};

type StatsPanelProps = {
  currentTime: number;
};
export const StatsPanel = ({ currentTime }: StatsPanelProps) => {
  const {
    response: getFlightStatusesResponse,
    makeRequest: getFlightStatuses,
  } = useQuery<unknown, FlightStatus[]>(`/flightstatuses`, "GET");

  const [statsFilters, setStatsFilters] = useState<{
    flightType: string;
    operators: AirlineCode[];
  }>({
    flightType: "",
    operators: [],
  });

  useEffect(() => {
    getFlightStatuses({
      airlineCodes: statsFilters.operators,
    });
  }, [getFlightStatuses, statsFilters]);

  const [isExpanded, setIsExpanded] = useState(true);
  const stats = calculateStats(
    getFlightStatusesResponse || [],
    statsFilters,
    currentTime
  );
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Performance Statistics
        </span>
        {isExpanded ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="px-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-4">
            <div className="space-y-2 w-fit col-span-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                  <GlobeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <select
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-gray-700 dark:text-gray-200"
                    value={statsFilters.flightType}
                    onChange={(e) =>
                      setStatsFilters((prev) => ({
                        ...prev,
                        flightType: e.target.value,
                      }))
                    }
                  >
                    <option value="all">All Routes</option>
                    <option value="domestic">Domestic</option>
                    <option value="transborder">Transborder</option>
                    <option value="international">International</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center bg-gray-50 gap-2  dark:bg-gray-700 px-3 py-2 rounded-md">
                  <PlaneTakeoffIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <MultiSelect
                    options={[
                      {
                        value: "mainline",
                        label: "Air Canada",
                        code: "AC",
                      },
                      {
                        value: "rouge",
                        label: "Rouge",
                        code: "RV",
                      },
                      {
                        value: "jazz",
                        label: "Air Canada Express - Jazz",
                        code: "QK",
                      },
                    ]}
                    selected={statsFilters.operators}
                    onChange={(values) =>
                      setStatsFilters((prev) => ({
                        ...prev,
                        operators: values,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4  col-span-6">
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
        </div>
      )}
    </div>
  );
};
