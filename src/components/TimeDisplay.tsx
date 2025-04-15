import React from "react";
interface TimeDisplayProps {
  scheduledTime: string;
  estimatedTime?: string | null;
}
export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  scheduledTime,
  estimatedTime,
}) => {
  const formatTime = (time: string) => {
    const dateTime = new Date(time);
    return dateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="space-y-1">
      <div className="font-medium">{formatTime(scheduledTime)}</div>
      {estimatedTime &&
        new Date(estimatedTime).getTime() !==
          new Date(scheduledTime).getTime() && (
          <div className="text-sm text-red-600">
            Est: {formatTime(estimatedTime)}
          </div>
        )}
    </div>
  );
};
