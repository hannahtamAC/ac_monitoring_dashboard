import { FlightStatus } from "../types/shared";

export const getBoardingStartTime = (flight) => {
  // Specific boarding times based on aircraft type
  let boardingMinutes = 35; // default for narrow-body aircraft
  if (flight.aircraftType.includes("777")) {
    boardingMinutes = 50;
  } else if (flight.aircraftType.includes("787")) {
    boardingMinutes = 45;
  } else if (flight.aircraftType.includes("A330")) {
    boardingMinutes = 45;
  } else if (
    flight.aircraftType.includes("737") ||
    flight.aircraftType.includes("A320") ||
    flight.aircraftType.includes("A321")
  ) {
    boardingMinutes = 35;
  }
  const scheduledDeparture = new Date(flight.scheduledDeparture);
  const boardingTime = new Date(scheduledDeparture);
  boardingTime.setMinutes(scheduledDeparture.getMinutes() - boardingMinutes);
  return {
    time: boardingTime,
    minutes: boardingMinutes,
  };
};
export const isBoardingLate = (flight) => {
  if (flight.status === "departed" || flight.status === "scheduled")
    return false;
  const now = new Date();
  const boardingStartTime = getBoardingStartTime(flight);
  // If boarding progress is 0 and we're past the start time, it's late
  return flight.boardingProgress === 0 && now > boardingStartTime.time;
};
export const formatBoardingTime = (date) => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getInferredStatus = (flight: FlightStatus) => {
  const now = new Date();
  const estimatedBoardingStart = new Date(flight.estimatedBoardingStart);
  const estimatedBoardingEnd = new Date(flight.estimatedBoardingEnd);

  if (flight.statusCode == "CNL") {
    return "CANCELLED";
  }
  if (flight.statusCode == "DLY") {
    return "DELAYED";
  }
  if (flight.statusCode == "EAR") {
    return "EARLY";
  }
  if (now > estimatedBoardingStart && now < estimatedBoardingEnd) {
    return "BOARDING";
  }
  if (now > estimatedBoardingEnd) {
    return "DEPARTED";
  }
  if (flight.statusCode == "ONT") {
    return "ONTIME";
  }

  return "";
};
