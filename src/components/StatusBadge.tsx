const getStatusConfig = (status: string) => {
  switch (status) {
    case "EARLY":
      return {
        text: "Early",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        borderColor: "border-gray-200",
      };
    case "ONTIME":
      return {
        text: "On Time",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-200",
      };
    case "DELAYED":
      return {
        text: "Delayed",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-200",
      };
    case "CANCELLED":
      return {
        text: "Cancelled",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-200",
      };
    default:
      return {
        text: status,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        borderColor: "border-gray-200",
      };
  }
};

const getInferredStatusConfig = (status: string) => {
  switch (status) {
    case "ARRIVING":
      return {
        text: "Arriving",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        borderColor: "border-gray-200",
      };
    case "BOARDING":
      return {
        text: "Boarding",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-200",
      };
    case "DEPARTED":
      return {
        text: "Departed",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-200",
      };
    case "CANCELLED":
      return {
        text: "Cancelled",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        borderColor: "border-red-200",
      };
    default:
      return {
        text: status,
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        borderColor: "border-gray-200",
      };
  }
};
interface StatusBadgeProps {
  status: FlightStatuses;
  inferred?: boolean;
}
export const StatusBadge = ({ status, inferred = false }: StatusBadgeProps) => {
  const statusConfig = inferred
    ? getInferredStatusConfig(status)
    : getStatusConfig(status);

  if (!status) {
    return <span></span>;
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}
    >
      {statusConfig.text}
    </span>
  );
};
