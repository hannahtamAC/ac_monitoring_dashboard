export type RequestHeader = {
  "Content-Type": string;
  Authorization?: string;
};

export type ACError = {
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
export type Operators = "mainline" | "rouge" | "jazz";
export type FlightStatuses = "boarding" | "departed" | "delayed" | "scheduled";
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
