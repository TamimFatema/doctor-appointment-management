// components/BookAppointmentModal.tsx (using React Query hooks)
'use client';
import { useState } from "react";
import { useCreateAppointment } from "../../hooks/useAppointments";

interface ModalProps {
  doctor: { id: string; name: string; specialization?: string };
  onClose: () => void;
  onSuccess: () => void;
}

export const BookAppointmentModal = ({ doctor, onClose, onSuccess }: ModalProps) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [step, setStep] = useState<"date" | "time" | "confirm">("date");
  
  const { mutate: createAppointment, isPending, error, reset } = useCreateAppointment();

  // Generate time slots (9 AM to 5 PM)
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep("time");
    reset(); // Clear any previous errors
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("confirm");
    reset(); // Clear any previous errors
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) return;

    const dateTimeString = `${selectedDate}T${selectedTime}:00.000Z`;
    
    createAppointment(
      { doctorId: doctor.id, date: dateTimeString },
      {
        onSuccess: (data) => {
          if (data.success) {
            onSuccess();
            onClose();
          }
        },
        onError: () => {
          // Error is already handled by the hook and available in the error state
        }
      }
    );
  };

  const getFormattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

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

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4 rounded">
            <div className="flex items-center">
              <div className="text-red-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between mb-6">
            {["Date", "Time", "Confirm"].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === stepName.toLowerCase()
                      ? "bg-blue-500 text-white"
                      : index < (step === "date" ? 0 : step === "time" ? 1 : 2)
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                {index < 2 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      index < (step === "date" ? 0 : step === "time" ? 1 : 2)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "date" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Select Date</h3>
              <p className="text-slate-600 text-sm">Choose a date for your appointment</p>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400">📅</span>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateSelect(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[0, 1, 2, 3, 4, 5].map((days) => {
                  const date = new Date();
                  date.setDate(date.getDate() + days);
                  const dateString = date.toISOString().split('T')[0];
                  const isSelected = selectedDate === dateString;
                  
                  return (
                    <button
                      key={dateString}
                      onClick={() => handleDateSelect(dateString)}
                      disabled={isPending}
                      className={`p-3 rounded-lg border transition-all duration-200 disabled:opacity-50 ${
                        isSelected
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-xs">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-lg font-bold">
                        {date.getDate()}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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

          {step === "confirm" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-800">Confirm Appointment</h3>
              
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xl">👨‍⚕️</span>
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
                  {isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Booking...
                    </div>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};