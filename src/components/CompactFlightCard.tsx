import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";
import { ClockIcon, UserIcon, LuggageIcon } from "lucide-react";
import { isPastDepartureTime, UTCToLocalTime } from "../utils/timeUtils";
import { CountdownTimer } from "./CountdownTimer";
import { TimeDisplay } from "./TimeDisplay";
import { useAnimations } from "../contexts/AnimationContext";
import { FlightStatus } from "../types/shared";
import { getInferredStatus } from "../utils/boardingUtils";

declare type CompactFlightCardProps = {
  flight: FlightStatus;
};
export const CompactFlightCard = ({ flight }: CompactFlightCardProps) => {
  const { animationsEnabled } = useAnimations();
  const getCardClassName = () => {
    if (flight.statusCode === "DELAYED") {
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
    return Math.round(0 * 100) || 0;
  };
  const getBaggageProgress = () => {
    return Math.round(0 * 100) || 0;
  };
  return (
    <div className={`bg-white border rounded-lg p-3 ${getCardClassName()}`}>
      <div className="grid grid-cols-12 gap-2 items-center">
        <div className="col-span-3">
          <div className="flex items-center justify-between">
            <div className="font-bold">
              {flight.carrierCode} {flight.flightNumber}
            </div>
          </div>
          <div className="text-xs text-gray-500">Gate {flight.gate}</div>
          <StatusBadge status={flight.statusCode} />
        </div>
        <div className="col-span-2">
          <div className="text-sm text-gray-500">
            {flight.originAirportCode} - {flight.destinationAirportCode}
          </div>
          <TimeDisplay
            scheduledTime={flight.scheduledBoardingEnd}
            estimatedTime={flight.estimatedBoardingEnd}
          />
        </div>
        <div className="col-span-2">
          <CountdownTimer
            scheduledTime={flight.scheduledBoardingEnd}
            status={flight.statusCode}
            actualDeparture={flight.estimatedBoardingEnd}
          />
        </div>
        <div className="col-span-2">
          <StatusBadge status={getInferredStatus(flight)} inferred />
        </div>
        <div className="col-span-3 space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center text-xs text-gray-500">
                <UserIcon className="h-3 w-3 mr-1" />
                <span>{0}/100</span>
              </div>
            </div>
            <ProgressBar
              value={getBoardingProgress()}
              status={flight.statusCode}
              startTime={new Date(flight.estimatedBoardingStart)}
              completeTime={new Date(flight.estimatedBoardingEnd)}
              type="boarding"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center text-xs text-gray-500">
                <LuggageIcon className="h-3 w-3 mr-1" />
                <span>0/100</span>
              </div>
            </div>
            <ProgressBar
              value={getBaggageProgress()}
              status={flight.statusCode === "DELAYED" ? "delayed" : "loading"}
              startTime={new Date(flight.scheduledBoardingStartTime)}
              completeTime={new Date(flight.scheduledBoardingEnd)}
              type="baggage"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
