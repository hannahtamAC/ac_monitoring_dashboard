import { FlightStatus } from "../types/shared";

export const isPastDepartureTime = (flight: FlightStatus) => {
  const now = new Date();
  const scheduledDeparture = new Date(flight.scheduledBoardingEnd);
  return now > scheduledDeparture;
};

export const UTCToLocalTime = (utc: string) => {
  const localTime = new Date(utc).toLocaleString();
  return localTime;
};
