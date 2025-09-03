'use client';
import { useState, useEffect } from "react";
import { useCreateAppointment } from "../../hooks/useAppointments";

interface ModalProps {
  doctor: { id: string; name: string; specialization?: string };
  onClose: () => void;
  onSuccess: () => void;
}

export const BookAppointmentModal = ({ doctor, onClose, onSuccess }: ModalProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [step, setStep] = useState<"date" | "time" | "confirm" | "result">("date");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const { mutate: createAppointment, isPending, error, reset } = useCreateAppointment();

  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep("time");
    reset();
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("confirm");
    reset();
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;
    const dateTimeString = `${selectedDate}T${selectedTime}:00.000Z`;

    createAppointment(
      { doctorId: doctor.id, date: dateTimeString },
      {
        onSuccess: (data) => {
          if (data.success) {
            setStatus("success");
            setStep("result");
            onSuccess();
          } else {
            setStatus("error");
            setStep("result");
          }
        },
        onError: () => {
          setStatus("error");
          setStep("result");
        }
      }
    );
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "success") {
      timer = setTimeout(() => {
        onClose();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [status, onClose]);

  const getFormattedDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const DoctorIcon = () => (
    <svg
      className="w-8 h-8 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      />
    </svg>
  );

  const SuccessIcon = () => (
    <svg
      className="w-12 h-12 text-green-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );

  const ErrorIcon = () => (
    <svg
      className="w-12 h-12 text-red-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Book Appointment</h2>
              <p className="text-blue-100 text-sm mt-1">with Dr. {doctor.name}</p>
              {doctor.specialization && (
                <p className="text-blue-100 text-xs mt-1">{doctor.specialization}</p>
              )}
            </div>
            <button
              onClick={onClose}
              disabled={isPending}
              className="text-white hover:text-blue-200 transition-colors duration-200 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Date Selection */}
          {step === "date" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Select Date</h3>
              <p className="text-slate-600 text-sm">Choose a date for your appointment</p>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateSelect(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-3 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          )}

          {/* Time Selection */}
          {step === "time" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Select Time</h3>
              <p className="text-slate-600 text-sm">
                Available time slots for {getFormattedDate(selectedDate)}
              </p>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    disabled={isPending}
                    className={`p-3 rounded-xl border transition-all duration-200 disabled:opacity-50 ${
                      selectedTime === time
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep("date")}
                disabled={isPending}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-4 disabled:opacity-50"
              >
                ← Back to date selection
              </button>
            </div>
          )}

          {/* Confirm Booking */}
          {step === "confirm" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800">Confirm Appointment</h3>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <DoctorIcon />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Dr. {doctor.name}</p>
                    {doctor.specialization && (
                      <p className="text-slate-600 text-sm">{doctor.specialization}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date:</span>
                    <span className="font-medium text-slate-800">{getFormattedDate(selectedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Time:</span>
                    <span className="font-medium text-slate-800">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration:</span>
                    <span className="font-medium text-slate-800">30 minutes</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep("time")}
                  disabled={isPending}
                  className="flex-1 py-3 px-4 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
                >
                  ← Back
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isPending || !selectedDate || !selectedTime}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 px-4 rounded-xl font-medium shadow-md hover:from-blue-600 hover:to-teal-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}

          {/* Result */}
          {step === "result" && (
            <div className="text-center space-y-4">
              {status === "success" ? (
                <div>
                  <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <SuccessIcon />
                  </div>
                  <h3 className="text-lg font-semibold text-green-700">Booking Confirmed!</h3>
                  <p className="text-slate-600 mt-2">
                    Your appointment with Dr. {doctor.name} is successfully booked.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <ErrorIcon />
                  </div>
                  <h3 className="text-lg font-semibold text-red-700">Booking Failed</h3>
                  <p className="text-slate-600 mt-2">
                    Something went wrong. Please try again.
                  </p>
                  <button
                    onClick={() => setStep("confirm")}
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-600 transition-all duration-200"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
