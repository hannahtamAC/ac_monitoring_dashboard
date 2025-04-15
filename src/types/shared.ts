export type RequestHeader = {
  Content-Type: string;
  Authorization?: string;
};

export type ACError = {
  friendlyMessage?: string;
  systemErrorMessage?: string;
  systemErrorCode?: string;
  friendlyCode?: string;
  lang: string;
};

export type ServerError = {
  message?: string;
  code?: string;
  status?: number;
};

export type ApiMethods = "PUT" | "POST" | "GET";

export type Airlines = "Air Canada" | "Air Canada Rouge" | "Air Canada Jazz";
export type AirlineCode = "AC" | "ACR" | "QK";
export type Operators = "mainline" | "rouge" | "jazz";
export type FlightStatuses = "EARLY" | "ONTIME" | "DELAYED" | "CANCELLED";
export type InferredStatuses = "ARRIVING" | "BOARDING" | "DEPARTED" | "CANCELLED";
export type FlightTypes = "domestic" | "international" | "transborder";

export type FlightStatusByInboundResponse = {
  id: number;
  airline: Airlines;
  operator: Operators;
  flightNumber: string;
  destination: string;
  destinationCode: string;
  gate: string;
  scheduledDeparture: number;
  actualDeparture: Date | null;
  status: FlightStatuses;
  boardedPassengers: number;
  totalPassengers: number;
  loadingProgress: number;
  totalBags: number;
  loadedBags: number;
  delayReason: string | null;
  aircraftType: string;
  isWideBody: boolean;
  isInternational: boolean;
  flightType: FlightTypes;
};

export type FlightSegment = {
  aircraft: {
    aircraftName: string;
  };
  markingFlightInfo: {
    carrierCode: AirlineCode;
    carrierName: Airlines;
    flightNumber: string;
  };
  destination: {
    localScheduledTime: string;
    estimatedTimeLocal: string;
  };
  origin: {
    gate: string;
    localScheduledTime: string;
    statusCode: FlightStatuses;
  };
};
export type Bound = {
  boundNumber: number;
  connectionCount: number;
  containsDirect: number;
  destination: string;
  distanceTotal: number;
  durationTotal: number;
  origin: string;
  type: string;
  segmentCount: number;
  segments: FlightSegment[];
};
export type FlightStatusByRouteResponse = {
  bounds: Bound[];
};

export type DelayReason = {
  code: string,
  message: string
}

export type FlightStatus = {
  id: string,
  carrierCode: AirlineCode,
  carrierName: Airlines,
  flightNumber: string,
  scheduledBoardingStart: string,
  scheduledBoardingEnd: string,
  delayReason?: DelayReason[],
  estimatedBoardingEnd: string,
  estimatedBoardingStart: string,
  aircraftCode: string,
  fin: string,
  statusCode: FlightStatuses,
  gate: string,
  destinationAirportCode: string,
  originAirportCode: string,
  checkInOpen: boolean
}
