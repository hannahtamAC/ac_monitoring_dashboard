import { FlightSegment } from "../types/shared";

export const isPastDepartureTime = (flight: FlightSegment) => {
  const now = new Date();
  const scheduledDeparture = new Date(flight.origin.localScheduledTime);
  return now > scheduledDeparture;
};
