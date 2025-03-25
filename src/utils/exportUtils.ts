interface ExportData {
  date: string;
  station: string;
  flights: Array<{
    flightNumber: string;
    finNumber: string;
    origin: string;
    destination: string;
    gate: string;
    scheduledDeparture: string;
    actualDeparture: string | null;
    boardingStart: string | null;
    boardingComplete: string | null;
    loadingStart: string | null;
    loadingComplete: string | null;
    status: string;
    delay: {
      isDelayed: boolean;
      duration?: number;
      reason?: string;
    };
    passengers: {
      total: number;
      boarded: number;
    };
    baggage: {
      total: number;
      loaded: number;
    };
  }>;
}
export const generateExportData = (flights, station = 'all'): ExportData => {
  const filteredFlights = station === 'all' ? flights : flights.filter(f => f.origin === station);
  return {
    date: new Date().toISOString().split('T')[0],
    station: station,
    flights: filteredFlights.map(flight => ({
      flightNumber: flight.flightNumber,
      finNumber: flight.finNumber,
      origin: flight.origin,
      destination: flight.destinationCode,
      gate: flight.gate,
      scheduledDeparture: flight.scheduledDeparture.toISOString(),
      actualDeparture: flight.actualDeparture?.toISOString() || null,
      boardingStart: flight.boardingStartTime?.toISOString() || null,
      boardingComplete: flight.boardingCompleteTime?.toISOString() || null,
      loadingStart: flight.loadingStartTime?.toISOString() || null,
      loadingComplete: flight.loadingCompleteTime?.toISOString() || null,
      status: flight.status,
      delay: {
        isDelayed: flight.status === 'delayed',
        duration: flight.delayDuration,
        reason: flight.delayReason
      },
      passengers: {
        total: flight.totalPassengers,
        boarded: flight.boardedPassengers
      },
      baggage: {
        total: flight.totalBags,
        loaded: flight.loadedBags
      }
    }))
  };
};
export const downloadExportFile = (data: ExportData) => {
  const fileName = `flight-data-${data.station}-${data.date}.json`;
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};