import React from "react";
import { formatTime } from "../utils/timeUtils";
interface TimeDisplayProps {
  scheduledTime: string;
  estimatedTime?: string | null;
}
export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  scheduledTime,
  estimatedTime,
}) => {
  return (
    <div className="space-y-1">
      <div className="font-medium">{formatTime(scheduledTime)}</div>
      {estimatedTime &&
        new Date(estimatedTime).getTime() !==
          new Date(scheduledTime).getTime() && (
          <div
            className={`text-sm ${
              new Date(estimatedTime).getTime() <
              new Date(scheduledTime).getTime()
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            Est: {formatTime(estimatedTime)}
          </div>
        )}
    </div>
  );
};
