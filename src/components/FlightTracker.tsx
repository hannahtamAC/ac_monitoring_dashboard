import { useEffect, useState } from "react";
import { FlightCard } from "./FlightCard";
import { CompactFlightCard } from "./CompactFlightCard";
import { TabSelector } from "./TabSelector";
import { ViewModeToggle } from "./ViewModeToggle";
import { DarkModeToggle } from "./DarkModeToggle";
import { ExportButton } from "./ExportButton";
import { StatsPanel } from "./StatsPanel";
import { MultiSelect } from "./MultiSelect";
import SearchInput from "./SearchInput";
import {
  PlaneTakeoffIcon,
  FilterIcon,
  RefreshCwIcon,
  GlobeIcon,
} from "lucide-react";
import { useAnimations } from "../contexts/AnimationContext";
import {
  AirlineCode,
  FlightSegment,
  FlightStatusByRouteResponse,
} from "../types/shared";
import { StationSelector } from "./StationSelector";
import { useQuery } from "../hooks/useQuery";

export const FlightTracker = () => {
  const {
    response: flightsStatusByInbound,
    makeRequest,
    error,
  } = useQuery<unknown, FlightStatusByRouteResponse>(
    "/flightstatusbyroute",
    "POST"
  );

  const { animationsEnabled, toggleAnimations } = useAnimations();
  const [activeTab, setActiveTab] = useState("active");
  const [isCompactView, setIsCompactView] = useState(false);
  const [statsFilters, setStatsFilters] = useState({
    flightType: "all",
    operators: [],
  });
  const [filters, setFilters] = useState<{
    status: string;
    flightType: string;
    airlineCodes: AirlineCode[];
  }>({
    status: "all",
    flightType: "all",
    airlineCodes: [],
  });
  const [originIATACode, setOriginIATACode] = useState("");
  const [destinationIATACode, setDestinationIATACode] = useState("");

  useEffect(() => {
    if (originIATACode && destinationIATACode && filters.airlineCodes.length) {
      makeRequest({
        origin: originIATACode,
        destination: destinationIATACode,
        airlineCode: filters.airlineCodes[0],
      });
    }
  }, [originIATACode, destinationIATACode, filters, makeRequest]);

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

  const filteredBounds = (
    (flightsStatusByInbound && flightsStatusByInbound.bounds) ||
    []
  )
    .map((bounds) => {
      // const isActive =
      //   flight.status !== "departed" ||
      //   (flight.actualDeparture &&
      //     new Date().getTime() - flight.actualDeparture.getTime() <
      //       5 * 60 * 1000);
      // if (activeTab === "active" && !isActive) return false;
      // if (activeTab === "departed" && isActive) return false;
      if (filters.flightType === "all" || bounds.type === filters.flightType) {
        return [];
      }

      const filteredSegments = bounds.segments.filter((segment) => {
        const matchesStatus =
          filters.status === "all" ||
          segment.origin.statusCode === filters.status;
        // const matchesType =
        //   filters.flightType === "all" || segment.origin.flightType === filters.flightType;
        const matchesOperator =
          filters.airlineCodes.length === 0 ||
          filters.airlineCodes.includes(segment.markingFlightInfo.carrierCode);

        return matchesStatus && matchesOperator;
      });

      return filteredSegments;
    })
    .flat();

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
              value={originIATACode}
              onChange={(val: string) => setOriginIATACode(val)}
              placeholder="Origin"
            />
            <StationSelector
              placeholder="Destination"
              value={destinationIATACode}
              onChange={(val: string) => setDestinationIATACode(val)}
            />
            <ExportButton flights={filteredBounds} station={selectedStation} />
          </div>
        </div>
      </div>
      <StatsPanel
        flights={flightsStatusByInbound || []}
        filters={statsFilters}
        onFilterChange={setStatsFilters}
      />

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
            <SearchInput placeholder="Search flight" />
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
                      code: "ACR",
                    },
                    {
                      value: "jazz",
                      label: "Jazz",
                      code: "JAZZ",
                    },
                  ]}
                  selected={filters.airlineCodes}
                  onChange={(values: AirlineCode[]) =>
                    setFilters({
                      ...filters,
                      airlineCodes: values,
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
                    <option value="all">All Status</option>
                    <option value="EARLY">EARLY</option>
                    <option value="ONTIME">ONTIME</option>
                    <option value="DELAYED">DELAYED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={makeRequest}
            className="flex items-center bg-[#C60C30] hover:bg-[#a30926] text-white px-3 py-2 rounded-md transition-colors ml-auto"
          >
            <RefreshCwIcon className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>
        <div className="bg-gray-50 rounded-md p-3 mb-6 grid grid-cols-12 text-sm font-medium text-gray-500">
          {isCompactView ? (
            <>
              <div className="col-span-3">Flight</div>
              <div className="col-span-3">Time</div>
              <div className="col-span-3">Countdown</div>
              <div className="col-span-3">Progress</div>
            </>
          ) : (
            <>
              <div className="col-span-3">Flight</div>
              <div className="col-span-2">Time</div>
              <div className="col-span-2">Countdown</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3">Boarding/Loading</div>
            </>
          )}
        </div>
        <div
          className={`space-y-2 ${isCompactView ? "space-y-2" : "space-y-4"}`}
        >
          {filteredBounds.map((segment: FlightSegment) =>
            isCompactView ? (
              <CompactFlightCard
                key={`${segment.destination}=${segment.origin.gate}=${segment.destination.localScheduledTime}`}
                flight={segment}
              />
            ) : (
              <FlightCard
                key={`${segment.destination}=${segment.origin.gate}=${segment.destination.localScheduledTime}`}
                flight={segment}
              />
            )
          )}
          {error && (
            <div className="text-center py-8 text-gray-500">
              {error.message}
            </div>
          )}
          {!error && filteredBounds.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No flights match the current filters
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
