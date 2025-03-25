import React from 'react';
interface StatusBadgeProps {
  status: string;
  isBoarding?: boolean;
  isLoading?: boolean;
  scheduledDeparture?: Date;
  boardingComplete?: boolean;
  loadingComplete?: boolean;
}
export const StatusBadge = ({
  status,
  isBoarding,
  isLoading,
  scheduledDeparture,
  boardingComplete,
  loadingComplete
}: StatusBadgeProps) => {
  const getProcessStatusConfig = (processType: 'boarding' | 'loading', isComplete: boolean) => {
    const now = new Date();
    const isLate = scheduledDeparture && scheduledDeparture.getTime() - now.getTime() <= 10 * 60 * 1000 && !isComplete;
    if (isComplete) {
      return {
        text: processType === 'boarding' ? 'Boarding' : 'Loading',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200'
      };
    }
    if (isLate) {
      return {
        text: processType === 'boarding' ? 'Boarding' : 'Loading',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200'
      };
    }
    return {
      text: processType === 'boarding' ? 'Boarding' : 'Loading',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-900',
      borderColor: 'border-amber-300'
    };
  };
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'scheduled':
        return {
          text: 'Scheduled',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200'
        };
      case 'departed':
        return {
          text: 'Departed',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'delayed':
        return {
          text: 'Delayed',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      default:
        return {
          text: status,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200'
        };
    }
  };
  const renderBadge = (config: ReturnType<typeof getStatusConfig>) => {
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
        {config.text}
      </span>;
  };
  if (isBoarding && isLoading) {
    return <div className="flex flex-col gap-1">
        {renderBadge(getProcessStatusConfig('boarding', boardingComplete))}
        {renderBadge(getProcessStatusConfig('loading', loadingComplete))}
      </div>;
  }
  if (status === 'delayed' || status === 'departed') {
    return renderBadge(getStatusConfig(status));
  }
  if (isBoarding) return renderBadge(getProcessStatusConfig('boarding', boardingComplete));
  if (isLoading) return renderBadge(getProcessStatusConfig('loading', loadingComplete));
  return renderBadge(getStatusConfig('scheduled'));
};