import React from 'react';
import { ProgressBar } from './ProgressBar';
import { StatusBadge } from './StatusBadge';
import { AlertCircleIcon, CheckCircleIcon, ClockIcon, LuggageIcon, AlertTriangleIcon, UserIcon } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { getBoardingStartTime, isBoardingLate, formatBoardingTime } from '../utils/boardingUtils';
import { isPastDepartureTime } from '../utils/timeUtils';
import { useAnimations } from '../contexts/AnimationContext';
import { TimeDisplay } from './TimeDisplay';
export const FlightCard = ({
  flight
}) => {
  const {
    animationsEnabled
  } = useAnimations();
  const getProgressValue = () => {
    switch (flight.status) {
      case 'boarding':
        return Math.round(flight.boardedPassengers / flight.totalPassengers * 100);
      case 'loading':
        return flight.loadingProgress;
      case 'departed':
        return 100;
      default:
        return 0;
    }
  };
  const getTimeDisplay = () => {
    if (flight.status === 'departed') {
      const diff = flight.actualDeparture.getTime() - flight.scheduledDeparture.getTime();
      const minutesDiff = Math.round(diff / 60000);
      if (minutesDiff < 0) {
        return <div className="flex items-center text-green-600">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            <span>{Math.abs(minutesDiff)} mins early</span>
          </div>;
      } else if (minutesDiff === 0) {
        return <div className="flex items-center text-green-600">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            <span>On time</span>
          </div>;
      } else {
        return <div className="flex items-center text-amber-600">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{minutesDiff} mins late</span>
          </div>;
      }
    }
    return null;
  };
  const getBaggageProgress = () => {
    return Math.round(flight.loadedBags / flight.totalBags * 100) || 0;
  };
  const renderBoardingInfo = () => {
    const {
      time: boardingStartTime,
      minutes: boardingMinutes
    } = getBoardingStartTime(flight);
    const isLate = isBoardingLate(flight);
    return <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            {flight.status === 'boarding' || flight.status === 'delayed' ? <div className="text-xs text-gray-500">
                POS boarding:{' '}
                {formatBoardingTime(getBoardingStartTime(flight).time)}
              </div> : null}
          </div>
          <div className="flex items-center gap-1">
            {isLate && <div className="flex items-center text-amber-600 text-xs">
                <AlertTriangleIcon className="h-3 w-3 mr-1" />
                Late Start
              </div>}
            <div className="text-xs font-medium">
              {flight.status === 'boarding' && <span>
                  {flight.boardedPassengers}/{flight.totalPassengers} pax
                </span>}
            </div>
          </div>
        </div>
        <ProgressBar value={getProgressValue()} status={flight.status} />
        {flight.status === 'scheduled' && <div className="text-xs text-gray-500 mt-1">
            Boarding starts at {formatBoardingTime(boardingStartTime)}
          </div>}
      </div>;
  };
  const getCardClassName = () => {
    if (flight.status === 'departed') {
      return flight.actualDeparture.getTime() <= flight.scheduledDeparture.getTime() ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50';
    }
    if (flight.status === 'delayed') {
      return 'border-red-200 bg-red-50';
    }
    if (isPastDepartureTime(flight)) {
      return `border-red-300 bg-red-50 shadow-[inset_0_0_0_2px_#ef4444] ${animationsEnabled ? 'animate-pulse' : ''}`;
    }
    return 'border-gray-200 bg-green-50';
  };
  return <div className={`bg-white border rounded-lg p-4 ${getCardClassName()}`}>
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-3">
          <div className="font-bold">{flight.flightNumber}</div>
          <div className="text-sm text-gray-500">{flight.airline}</div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <span>{flight.aircraftType}</span>
            {flight.operator !== 'mainline' && <span>• {flight.operator === 'rouge' ? 'Rouge' : 'Jazz'}</span>}
            <span>• {flight.destinationCode}</span>
          </div>
        </div>
        <div className="col-span-2">
          <TimeDisplay scheduledTime={flight.scheduledDeparture} estimatedTime={flight.status === 'delayed' ? flight.estimatedDeparture : null} />
          <div className="text-xs text-gray-500">Gate {flight.gate}</div>
          {(flight.status === 'boarding' || flight.status === 'delayed') && <div className="text-xs text-gray-500">
              POS: {formatBoardingTime(getBoardingStartTime(flight).time)}
            </div>}
        </div>
        <div className="col-span-2">
          <CountdownTimer scheduledTime={flight.scheduledDeparture} status={flight.status} actualDeparture={flight.actualDeparture} />
        </div>
        <div className="col-span-2">
          <div className="flex items-center">
            <StatusBadge status={flight.status} isBoarding={flight.boardedPassengers > 0 && flight.boardedPassengers < flight.totalPassengers} isLoading={flight.loadedBags > 0 && flight.loadedBags < flight.totalBags} scheduledDeparture={flight.scheduledDeparture} boardingComplete={flight.boardedPassengers === flight.totalPassengers} loadingComplete={flight.loadedBags === flight.totalBags} />
            {getTimeDisplay()}
          </div>
          {flight.status === 'delayed' && <div className="mt-1 flex items-start text-sm text-red-600">
              <AlertCircleIcon className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <span>{flight.delayReason}</span>
            </div>}
        </div>
        <div className="col-span-3 space-y-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center text-xs text-gray-500">
                <UserIcon className="h-3 w-3 mr-1" />
                <span>Boarding</span>
              </div>
              <div className="text-xs font-medium">
                {flight.boardedPassengers}/{flight.totalPassengers}
              </div>
            </div>
            <ProgressBar value={getProgressValue()} status={flight.status} startTime={flight.boardingStartTime} completeTime={flight.boardingCompleteTime} type="boarding" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center text-xs text-gray-500">
                <LuggageIcon className="h-3 w-3 mr-1" />
                <span>Baggage</span>
              </div>
              <div className="text-xs font-medium">
                {flight.loadedBags}/{flight.totalBags}
              </div>
            </div>
            <ProgressBar value={getBaggageProgress()} status={flight.status === 'delayed' ? 'delayed' : 'loading'} startTime={flight.loadingStartTime} completeTime={flight.loadingCompleteTime} type="baggage" />
          </div>
        </div>
      </div>
    </div>;
};