interface AppointmentCardProps {
  appointment: {
    id: string;
    doctor: { 
      name: string; 
      specialization: string;
      photo_url?: string;
    };
    date: string;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    symptoms?: string;
    notes?: string;
  };
  onAction?: (appointmentId: string, action: string) => void;
  showActions?: boolean;
}

export const AppointmentCard = ({
  appointment,
  onAction,
  showActions = false,
}: AppointmentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
      case "COMPLETED":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case "CANCELLED":
        return (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              strokeWidth={4}
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const { date: formattedDate, time: formattedTime } = formatDate(appointment.date);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Doctor Info Section */}
        <div className="flex-1">
          <div className="flex items-start space-x-4">
            {/* Doctor Avatar */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                {appointment.doctor.photo_url ? (
                  <img
                    src={appointment.doctor.photo_url}
                    alt={appointment.doctor.name}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                ) : (
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Doctor Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-800 truncate">
                Dr. {appointment.doctor.name}
              </h3>
              <p className="text-slate-600 text-sm mb-2">
                {appointment.doctor.specialization}
              </p>

              {/* Appointment Date & Time */}
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{formattedTime}</span>
                </div>
              </div>

              {/* Symptoms & Notes */}
              {appointment.symptoms && (
                <div className="mt-3">
                  <p className="text-xs text-slate-500 font-medium">Symptoms:</p>
                  <p className="text-sm text-slate-700">{appointment.symptoms}</p>
                </div>
              )}
              {appointment.notes && (
                <div className="mt-2">
                  <p className="text-xs text-slate-500 font-medium">Notes:</p>
                  <p className="text-sm text-slate-700">{appointment.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status & Actions Section */}
        <div className="flex flex-col items-end justify-between space-y-4">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(
              appointment.status
            )}`}
          >
            <span className="mr-1">{getStatusIcon(appointment.status)}</span>
            {appointment.status}
          </div>

          {showActions && onAction && (
            <div className="flex space-x-2">
              {appointment.status === "PENDING" && (
                <button
                  onClick={() => onAction(appointment.id, "cancel")}
                  className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Cancel
                </button>
              )}
              {appointment.status === "CONFIRMED" && (
                <button
                  onClick={() => onAction(appointment.id, "reschedule")}
                  className="px-3 py-1 bg-amber-500 text-white text-xs rounded-lg hover:bg-amber-600 transition-colors duration-200"
                >
                  Reschedule
                </button>
              )}
            </div>
          )}

          <div className="text-xs text-slate-400 text-right">
            {new Date(appointment.date) > new Date() ? (
              <>In {Math.ceil((new Date(appointment.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days</>
            ) : (
              <>Completed</>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Appointment ID: #{appointment.id.slice(-8).toUpperCase()}</span>
          <span>Created: {new Date(appointment.date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
