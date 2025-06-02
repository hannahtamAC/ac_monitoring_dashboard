import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";
import { UserIcon, LuggageIcon } from "lucide-react";
import { getPercentComplete, isPastDepartureTime } from "../utils/timeUtils";
import { CountdownTimer } from "./CountdownTimer";
import { TimeDisplay } from "./TimeDisplay";
import { useAnimations } from "../contexts/AnimationContext";
import { FlightComment, FlightStatus } from "../types/shared";
import CommentSection from "./CommentSection";
import { useCallback, useEffect } from "react";
import { useQuery } from "../hooks/useQuery";

declare type FlightCardProps = {
  flight: FlightStatus;
  tab: "active" | "departed";
  currentTime: number;
  updateFlight: (flight: Partial<FlightStatus>) => void;
};

export const FlightCard = ({
  flight,
  tab,
  currentTime,
  updateFlight,
}: FlightCardProps) => {
  const { animationsEnabled } = useAnimations();
  const { response: addCommentResponse, makeRequest: addComment } = useQuery<
    unknown,
    FlightComment
  >(`/flightstatuses/${flight.id}/comments`, "POST");

  const cardClassName = () => {
    if (flight.statusCode === "DLY") {
      return "border-red-200 bg-red-50";
    }
    if (isPastDepartureTime(flight, currentTime) && tab !== "departed") {
      return `border-red-300 bg-red-50 shadow-[inset_0_0_0_2px_#ef4444] ${
        animationsEnabled ? "animate-pulse" : "animate-pulse"
      }`;
    }
    return "border-gray-200 bg-green-50";
  };

  const createNewComment = useCallback(
    (content: string) => {
      addComment({ content });
    },
    [addComment]
  );

  useEffect(() => {
    if (addCommentResponse) {
      console.log(addCommentResponse);
      updateFlight({ comments: [...flight.comments, addCommentResponse] });
    }
  }, [addCommentResponse]);

  return (
    <div className={`bg-white border rounded-lg p-3 ${cardClassName()}`}>
      <div className="grid grid-cols-7 gap-2 items-center">
        <div className="col-span-1">
          <div className="flex items-center justify-between">
            <div className="font-bold">
              {flight.carrierCode} {flight.flightNumber}
            </div>
          </div>
          <div className="text-xs text-gray-500">Gate {flight.gate}</div>
          {/* <StatusBadge status={flight.statusCode} /> */}
          <div className="text-sm text-gray-500">Fin {flight.fin}</div>
        </div>
        <div className="col-span-1">
          <div className="text-sm text-gray-500">
            {flight.originAirportCode} - {flight.destinationAirportCode}
          </div>
          <TimeDisplay
            scheduledTime={flight.scheduledBoardingEnd}
            estimatedTime={flight.estimatedBoardingEnd}
          />
        </div>
        <div className="col-span-1">
          <CountdownTimer
            scheduledTime={flight.scheduledBoardingEnd}
            estimatedTime={flight.estimatedBoardingEnd}
            status={flight.statusCode}
            currentTime={currentTime}
            tab={tab}
          />
        </div>
        <div className="col-span-1">
          <StatusBadge status={flight.statusCode} inferred />
        </div>
        <div className="col-span-1 space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center text-xs text-gray-500">
                <UserIcon className="h-3 w-3 mr-1" />
                <span>
                  {flight.statusCode !== "CNL"
                    ? getPercentComplete(
                        flight.estimatedBoardingStart,
                        flight.estimatedBoardingEnd
                      )
                    : 0}
                  /100
                </span>
              </div>
            </div>
            <ProgressBar
              value={
                flight.statusCode !== "CNL"
                  ? getPercentComplete(
                      flight.estimatedBoardingStart,
                      flight.estimatedBoardingEnd
                    )
                  : 0
              }
              status={flight}
              startTime={new Date(flight.estimatedBoardingStart)}
              completeTime={new Date(flight.estimatedBoardingEnd)}
              type="boarding"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center text-xs text-gray-500">
                <LuggageIcon className="h-3 w-3 mr-1" />
                <span>
                  {" "}
                  {flight.statusCode !== "CNL"
                    ? getPercentComplete(
                        flight.estimatedBoardingStart,
                        flight.estimatedBoardingEnd
                      )
                    : 0}
                  /100
                </span>
              </div>
            </div>
            <ProgressBar
              value={
                flight.statusCode !== "CNL"
                  ? getPercentComplete(
                      flight.estimatedBoardingStart,
                      flight.estimatedBoardingEnd
                    )
                  : 0
              }
              status={flight}
              startTime={new Date(flight.scheduledBoardingStart)}
              completeTime={new Date(flight.scheduledBoardingEnd)}
              type="baggage"
            />
          </div>
        </div>
        <div className="col-span-2 space-y-2">
          <div className="m-2">
            <CommentSection
              comments={flight.comments}
              onSubmit={createNewComment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
