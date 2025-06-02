import { useCallback, useEffect, useMemo, useState } from "react";
import { FlightCard } from "./FlightCard";
import { CompactFlightCard } from "./CompactFlightCard";
import { TabSelector } from "./TabSelector";
import { ViewModeToggle } from "./ViewModeToggle";
import { DarkModeToggle } from "./DarkModeToggle";
import { ExportButton } from "./ExportButton";
import { StatsPanel } from "./StatsPanel";
import { MultiSelect } from "./shared/MultiSelect";
import SearchInput from "./SearchInput";
import {
  PlaneTakeoffIcon,
  FilterIcon,
  RefreshCwIcon,
  GlobeIcon,
} from "lucide-react";
import { useAnimations } from "../contexts/AnimationContext";
import { AirlineCode, FlightStatus } from "../types/shared";
import { StationSelector } from "./StationSelector";
import { useQuery } from "../hooks/useQuery";

export const FlightTracker = () => {
  const {
    response: getFlightStatusesResponse,
    makeRequest: getFlightStatuses,
    error,
  } = useQuery<unknown, FlightStatus[]>(`/flightstatuses`, "GET");

  const { response: originAirportCodes, makeRequest: getOriginAirportCodes } =
    useQuery<unknown, string[]>("/airportcodes", "GET");
  const {
    response: destinationAirportCodes,
    makeRequest: getDestinationAirportCodes,
  } = useQuery<unknown, string[]>("/airportcodes?destination=1", "GET");
  const [refresh, setRefresh] = useState(false);

  const [originIATACode, setOriginIATACode] = useState("");
  const [destinationIATACode, setDestinationIATACode] = useState("");

  const { animationsEnabled, toggleAnimations } = useAnimations();
  const [activeTab, setActiveTab] = useState<"active" | "departed">("active");
  const [isCompactView, setIsCompactView] = useState(false);

  const [filters, setFilters] = useState<{
    status: string;
    flightType: string;
    airlineCodes: AirlineCode[];
    flightNumber: string;
  }>({
    status: "",
    flightType: "",
    airlineCodes: [],
    flightNumber: "",
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedStation, setSelectedStation] = useState("all");
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
    }
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    getOriginAirportCodes();
    getDestinationAirportCodes();
  }, [getDestinationAirportCodes, getOriginAirportCodes]);

  useEffect(() => {
    getFlightStatuses({
      origin: originIATACode,
      destination: destinationIATACode,
      airlineCodes: filters.airlineCodes,
      status: filters.status,
      flightNumber: filters.flightNumber,
    });
  }, [
    destinationIATACode,
    getFlightStatuses,
    originIATACode,
    filters,
    refresh,
  ]);

  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  useEffect(() => {
    const updateTimer = () => {
      setCurrentTime(new Date().getTime());
    };
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const [flightStatuses, setFlightStatuses] = useState<{
    active: FlightStatus[];
    departed: FlightStatus[];
  }>({ active: [], departed: [] });

  useEffect(() => {
    setFlightStatuses(() => {
      const newFlightStatuses: {
        active: FlightStatus[];
        departed: FlightStatus[];
      } = { active: [], departed: [] };

      (getFlightStatusesResponse || []).map((curr) => {
        const now = new Date();
        const estimatedBoardingEnd = new Date(curr.estimatedBoardingEnd);

        if (estimatedBoardingEnd < now) {
          newFlightStatuses.departed.push(curr);
        } else {
          newFlightStatuses.active.push(curr);
        }
      });

      return newFlightStatuses;
    });
  }, [getFlightStatusesResponse]);

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleAnimations}
              className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {animationsEnabled ? "Disable" : "Enable"} Animations
            </button>
            <div className="flex items-center gap-4">
              <DarkModeToggle isDark={isDarkMode} onChange={setIsDarkMode} />
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: {Date()}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Air Canada Operations
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Flight Departure Monitor
            </p>
          </div>
          <div className="flex items-center gap-4">
            <StationSelector
              stations={originAirportCodes || []}
              value={originIATACode}
              onChange={(val: string) => setOriginIATACode(val)}
              placeholder="Origin"
            />
            <StationSelector
              stations={destinationAirportCodes || []}
              placeholder="Destination"
              value={destinationIATACode}
              onChange={(val: string) => setDestinationIATACode(val)}
            />
            <ExportButton
              flights={flightStatuses[activeTab]}
              station={selectedStation}
            />
          </div>
        </div>
      </div>
      <StatsPanel currentTime={currentTime} />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-3 min-w-[200px]">
            <TabSelector activeTab={activeTab} onChange={setActiveTab} />
            <ViewModeToggle
              isCompact={isCompactView}
              onChange={setIsCompactView}
            />
          </div>
          <div className="flex-1 flex items-center gap-3 max-w-4xl">
            <SearchInput
              value={filters.flightNumber}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  flightNumber: e,
                })
              }
              placeholder="Search flight number"
            />
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                <GlobeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <select
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-gray-700 dark:text-gray-200"
                  value={filters.flightType}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      flightType: e.target.value,
                    })
                  }
                >
                  <option value="all">All Routes</option>
                  <option value="domestic">Domestic</option>
                  <option value="transborder">Transborder</option>
                  <option value="international">International</option>
                </select>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
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
                  selected={filters.airlineCodes}
                  onChange={(value) =>
                    setFilters({
                      ...filters,
                      airlineCodes: value,
                    })
                  }
                />
              </div>
              {activeTab === "active" && (
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md">
                  <FilterIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <select
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-gray-700 dark:text-gray-200"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="">All Status</option>
                    <option value="EAR">Early</option>
                    <option value="ONT">On time</option>
                    <option value="DLY">Delayed</option>
                    <option value="CNL">Cancelled</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setRefresh((prev) => !prev)}
            className="flex items-center bg-[#C60C30] hover:bg-[#a30926] text-white px-3 py-2 rounded-md transition-colors ml-auto"
          >
            <RefreshCwIcon className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>
        <div className="bg-gray-50 rounded-md p-3 mb-6 grid grid-cols-7 text-sm font-medium text-gray-500">
          {isCompactView ? (
            <>
              <div className="col-span-1">Flight</div>
              <div className="col-span-1">Time</div>
              <div className="col-span-1">Countdown</div>
              <div className="col-span-3">Progress</div>
            </>
          ) : (
            <>
              <div className="col-span-1">Flight</div>
              <div className="col-span-1">Time</div>
              <div className="col-span-1">Countdown</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Boarding/Loading</div>
              <div className="col-span-2">Comments</div>
            </>
          )}
        </div>
        <div
          className={`space-y-2 ${isCompactView ? "space-y-2" : "space-y-4"}`}
        >
          {flightStatuses[activeTab].map((flight, i) =>
            isCompactView ? (
              <CompactFlightCard
                key={`${flight.id}`}
                flight={flight}
                tab={activeTab}
                currentTime={currentTime}
              />
            ) : (
              <FlightCard
                key={`${flight.id}`}
                flight={flight}
                tab={activeTab}
                currentTime={currentTime}
                updateFlight={(newFlight: Partial<FlightStatus>) => {
                  flightStatuses[activeTab];
                  setFlightStatuses((prev) => {
                    const copy = { ...prev };
                    copy[activeTab][i] = {
                      ...copy[activeTab][i],
                      ...newFlight,
                    };
                    return copy;
                  });
                }}
              />
            )
          )}
          {error && (
            <div className="text-center py-8 text-gray-500">
              {error.message}
            </div>
          )}
          {!error && flightStatuses[activeTab]?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No flights match the current filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
