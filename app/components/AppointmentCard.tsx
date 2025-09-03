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
  showActions = false 
}: AppointmentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default: // PENDING
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "✅";
      case "COMPLETED":
        return "✅";
      case "CANCELLED":
        return "❌";
      default: // PENDING
        return "⏳";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
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
                  <span className="text-2xl text-blue-600">👨‍⚕️</span>
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
                  <span className="mr-1">📅</span>
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">⏰</span>
                  <span>{formattedTime}</span>
                </div>
              </div>

              {/* Symptoms (if available) */}
              {appointment.symptoms && (
                <div className="mt-3">
                  <p className="text-xs text-slate-500 font-medium">Symptoms:</p>
                  <p className="text-sm text-slate-700">{appointment.symptoms}</p>
                </div>
              )}

              {/* Notes (if available) */}
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
          {/* Status Badge */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(appointment.status)}`}>
            <span className="mr-1">{getStatusIcon(appointment.status)}</span>
            {appointment.status}
          </div>

          {/* Action Buttons */}
          {showActions && onAction && (
            <div className="flex space-x-2">
              {appointment.status === "PENDING" && (
                <>
                  <button
                    onClick={() => onAction(appointment.id, "confirm")}
                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => onAction(appointment.id, "cancel")}
                    className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </>
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

          {/* Time Until Appointment */}
          <div className="text-xs text-slate-400 text-right">
            {new Date(appointment.date) > new Date() ? (
              <>
                In {Math.ceil((new Date(appointment.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
              </>
            ) : (
              <>Completed</>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Appointment ID: #{appointment.id.slice(-8).toUpperCase()}</span>
          <span>Created: {new Date(appointment.date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};