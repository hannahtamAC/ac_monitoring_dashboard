import { FlightStatus } from "../types/shared";
import { getInferredStatus } from "../utils/boardingUtils";

interface ProgressBarProps {
  value: number;
  status: FlightStatus;
  startTime?: Date | null;
  completeTime?: Date | null;
  type: "boarding" | "baggage";
}
export const ProgressBar = ({
  value,
  status,
  startTime,
  completeTime,
  type,
}: ProgressBarProps) => {
  const inferredStatus = getInferredStatus(status);

  const getColorClass = () => {
    if (value === 100) return "bg-green-500";
    switch (inferredStatus) {
      case "BOARDING":
        return value > 0 ? "bg-amber-500" : "bg-gray-300";
      case "EARLY":
        return value > 0 ? "bg-amber-500" : "bg-gray-300";
      case "DEPARTED":
        return "bg-green-500";
      case "DELAYED":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const getTooltipText = () => {
    if (!startTime) return "";
    const label = type === "boarding" ? "Boarding" : "Baggage Loading";
    let text = `${label} Started: ${formatTime(startTime)}`;
    if (completeTime) {
      const duration = Math.round(
        (completeTime.getTime() - startTime.getTime()) / 60000
      );
      text += `\n${label} Completed: ${formatTime(completeTime)}`;
      text += `\nTotal Duration: ${duration} minutes`;
    } else if (value === 100) {
      text += "\nStatus: Complete";
    } else {
      text += "\nStatus: In Progress";
    }
    return text;
  };
  return (
    <div className="relative group">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${getColorClass()} transition-all duration-300`}
          style={{
            width: `${value}%`,
          }}
        />
      </div>
      {(startTime || value === 100) && (
        <div className="absolute hidden group-hover:block bottom-full left-0 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded whitespace-pre z-10">
          {getTooltipText()}
        </div>
      )}
    </div>
  );
};
