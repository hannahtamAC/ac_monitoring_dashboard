import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";
import { ClockIcon, UserIcon, LuggageIcon } from "lucide-react";
import { isPastDepartureTime } from "../utils/timeUtils";
import { CountdownTimer } from "./CountdownTimer";
import { TimeDisplay } from "./TimeDisplay";
import { useAnimations } from "../contexts/AnimationContext";
import { FlightSegment } from "../types/shared";

declare type CompactFlightCardProps = {
  flight: FlightSegment;
};
export const CompactFlightCard = ({ flight }: CompactFlightCardProps) => {
  const { animationsEnabled } = useAnimations();
  const getCardClassName = () => {
    if (flight.origin.statusCode !== "CANCELLED") {
      return new Date(flight.destination.localScheduledTime).getTime() <=
        new Date(flight.destination.estimatedTimeLocal).getTime()
        ? "border-green-200 bg-green-50"
        : "border-red-200 bg-red-50";
    }
    if (flight.origin.statusCode === "DELAYED") {
      return "border-red-200 bg-red-50";
    }
    if (isPastDepartureTime(flight)) {
      return `border-red-300 bg-red-50 shadow-[inset_0_0_0_2px_#ef4444] ${
        animationsEnabled ? "animate-pulse" : ""
      }`;
    }
    return "border-gray-200 bg-green-50";
  };
  const getBoardingProgress = () => {
    return (
      Math.round((flight.boardedPassengers / flight.totalPassengers) * 100) || 0
    );
  };
  const getBaggageProgress = () => {
    return Math.round((flight.loadedBags / flight.totalBags) * 100) || 0;
  };
  return (
    <div className={`bg-white border rounded-lg p-3 ${getCardClassName()}`}>
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-3">
          <div className="flex items-center justify-between">
            <div className="font-bold">{flight.flightNumber}</div>
            <div className="text-sm text-gray-500">
              {flight.destinationCode}
            </div>
          </div>
          <div className="text-xs text-gray-500">Gate {flight.gate}</div>
          <StatusBadge
            status={flight.status}
            isBoarding={
              flight.boardedPassengers > 0 &&
              flight.boardedPassengers < flight.totalPassengers
            }
            isLoading={
              flight.loadedBags > 0 && flight.loadedBags < flight.totalBags
            }
            scheduledDeparture={flight.scheduledDeparture}
            boardingComplete={
              flight.boardedPassengers === flight.totalPassengers
            }
            loadingComplete={flight.loadedBags === flight.totalBags}
          />
        </div>
        <div className="col-span-3">
          <TimeDisplay
            scheduledTime={flight.scheduledDeparture}
            estimatedTime={
              flight.status === "delayed" ? flight.estimatedDeparture : null
            }
          />
        </div>
        <div className="col-span-3">
          <CountdownTimer
            scheduledTime={flight.scheduledDeparture}
            status={flight.status}
            actualDeparture={flight.actualDeparture}
          />
        </div>
        <div className="col-span-3 space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center text-xs text-gray-500">
                <UserIcon className="h-3 w-3 mr-1" />
                <span>
                  {flight.boardedPassengers}/{flight.totalPassengers}
                </span>
              </div>
            </div>
            <ProgressBar
              value={getBoardingProgress()}
              status={flight.status}
              startTime={flight.boardingStartTime}
              completeTime={flight.boardingCompleteTime}
              type="boarding"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center text-xs text-gray-500">
                <LuggageIcon className="h-3 w-3 mr-1" />
                <span>
                  {flight.loadedBags}/{flight.totalBags}
                </span>
              </div>
            </div>
            <ProgressBar
              value={getBaggageProgress()}
              status={flight.status === "delayed" ? "delayed" : "loading"}
              startTime={flight.loadingStartTime}
              completeTime={flight.loadingCompleteTime}
              type="baggage"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
