export const isPastDepartureTime = flight => {
  if (flight.status === 'departed') return false;
  const now = new Date();
  const scheduledDeparture = new Date(flight.scheduledDeparture);
  return now > scheduledDeparture;
};