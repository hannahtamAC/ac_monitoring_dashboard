import React from 'react';
interface TimeDisplayProps {
  scheduledTime: Date;
  estimatedTime?: Date | null;
}
export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  scheduledTime,
  estimatedTime
}) => {
  const formatTime = (time: Date) => {
    return time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <div className="space-y-1">
      <div className="font-medium">{formatTime(scheduledTime)}</div>
      {estimatedTime && estimatedTime.getTime() !== scheduledTime.getTime() && <div className="text-sm text-red-600">
          Est: {formatTime(estimatedTime)}
        </div>}
    </div>;
};