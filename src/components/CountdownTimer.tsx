import { useEffect, useState } from "react";
import { ClockIcon } from "lucide-react";
import { useAnimations } from "../contexts/AnimationContext";
import { FlightStatuses } from "../types/shared";
import { UTCToLocalTime } from "../utils/timeUtils";

type CoundDownTimerProps = {
  scheduledTime: string;
  estimatedTime: string;
  status: FlightStatuses;
  actualDeparture?: string;
};
export const CountdownTimer = ({
  scheduledTime,
  estimatedTime,
  status,
  actualDeparture,
}: CoundDownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [timerState, setTimerState] = useState("normal");
  const [delayDuration, setDelayDuration] = useState("");
  const { animationsEnabled } = useAnimations();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const departure = new Date(scheduledTime);
      const diff = departure.getTime() - now.getTime();
      const totalSeconds = Math.floor(diff / 1000);
      const minutesLeft = Math.floor(totalSeconds / 60);
      if (status === "ONTIME" && actualDeparture) {
        const departureDelay =
          new Date(actualDeparture).getTime() -
          new Date(scheduledTime).getTime();
        const delayMinutes = Math.round(departureDelay / 60000);
        return {
          display:
            delayMinutes < 0
              ? `${Math.abs(delayMinutes)}m early`
              : delayMinutes === 0
              ? "On time"
              : `${delayMinutes}m late`,
          state: delayMinutes <= 0 ? "departed-ontime" : "departed-late",
        };
      }
      if (minutesLeft <= -60) {
        const delaySeconds = Math.abs(totalSeconds);
        const hours = Math.floor(delaySeconds / 3600);
        const minutes = Math.floor((delaySeconds % 3600) / 60);
        const seconds = delaySeconds % 60;

        setDelayDuration(`Delayed ${hours ? `${hours}h ` : ""}${minutes}m`);
        setTimerState("normal");
        return {
          display: `-${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
          state: "normal",
        };
      }
      if (minutesLeft <= 60) {
        if (minutesLeft <= 5) {
          setTimerState("urgent");
        } else if (minutesLeft <= 10) {
          setTimerState("warning");
        } else {
          setTimerState("normal");
        }
        if (totalSeconds > 0) {
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          return {
            display: `${
              hours ? hours.toString().padStart(2, "0") + ":" : ""
            }${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`,
            state: timerState,
          };
        }
      }
      return {
        display: "",
        state: "normal",
      };
    };
    const updateTimer = () => {
      const result = calculateTimeLeft();
      if (result.display) {
        setTimeLeft(result.display);
        setTimerState(result.state);
      } else {
        setTimeLeft("");
      }
    };
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [scheduledTime, status, actualDeparture, timerState]);

  if (!timeLeft) return null;
  const getTimerStyles = () => {
    const baseStyles = "flex items-center gap-1";
    switch (timerState) {
      case "warning":
        return `${baseStyles} text-amber-500`;
      case "urgent":
        return `${baseStyles} text-red-500 ${
          animationsEnabled ? "animate-pulse" : ""
        }`;
      case "overdue":
        return `${baseStyles} text-red-600`;
      case "departed-ontime":
        return `${baseStyles} text-green-600`;
      case "departed-late":
        return `${baseStyles} text-red-600`;
      default:
        return `${baseStyles} text-gray-600`;
    }
  };
  return (
    <div className="space-y-1">
      <div className={getTimerStyles()}>
        <ClockIcon className="h-4 w-4" />
        <span className="font-medium">{timeLeft}</span>
      </div>
      {delayDuration && (
        <div className="text-xs text-red-600">{delayDuration}</div>
      )}
    </div>
  );
};
