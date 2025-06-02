import { FlightStatus } from "../types/shared";

export const isPastDepartureTime = (
  flight: FlightStatus,
  currentTime: number
) => {
  const scheduledDeparture = new Date(flight.scheduledBoardingEnd);
  return currentTime > scheduledDeparture.getTime();
};

export const UTCToLocalTime = (utc: string) => {
  const localTime = new Date(utc).toLocaleString();
  return localTime;
};

export const getPercentComplete = (t1: string, t2: string) => {
  const current = new Date();
  const start = new Date(t1);
  const end = new Date(t2);

  const duration = Math.round((end.getTime() - start.getTime()) / 60000);
  const progress = Math.round((current.getTime() - start.getTime()) / 60000);

  return Math.max(0, Math.min(Math.round((progress / duration) * 100), 100));
};

export const formatTime = (time: string) => {
  const dateTime = new Date(time);
  return dateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatLongTime = (time: string) => {
  const date = new Date(time);

  const datePart = date.toLocaleDateString("en-US", {
    weekday: "short", // Mon
    day: "2-digit", // 02
    month: "short", // Jun
    year: "numeric", // 2025
  });

  const timePart = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Ensures AM/PM format
  });

  return `${datePart} ${timePart}`;
};
