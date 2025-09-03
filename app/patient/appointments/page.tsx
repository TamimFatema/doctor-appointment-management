"use client";

import { useState } from "react";
import {
  useCancelAppointment,
  usePatientAppointments,
} from "../../../hooks/useAppointments";
import { AppointmentCard } from "../../components/AppointmentCard";

// Modal Component
function CancelModal({
  isOpen,
  onClose,
  onCancel,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-slate-800 mb-4 text-center">
          Cancel Appointment
        </h2>
        <p className="text-slate-600 mb-6 text-center">
          This appointment will be cancelled immediately.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-red-500 text-white rounded-xl shadow hover:bg-red-600 transition-all duration-200"
          >
            Cancel Appointment
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 block mx-auto text-slate-500 hover:text-slate-700 text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function PatientAppointments() {
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(
    null
  );

  const {
    data: appointmentsData,
    isLoading,
    error,
    refetch,
  } = usePatientAppointments(statusFilter, currentPage, true);

  const { cancelAppointment, isPending: isCancelling } = useCancelAppointment();

  const handleCancelClick = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    setModalOpen(true);
  };

  const handleCancel = () => {
    if (selectedAppointment) {
      cancelAppointment(selectedAppointment);
      setSelectedAppointment(null);
    }
    setModalOpen(false);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-red-100">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
              <span className="text-red-500 w-6 h-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M4.93 19h14.14a1 1 0 00.93-1.37l-7.07-12.25a1 1 0 00-1.73 0L4 17.63a1 1 0 00.93 1.37z"
                  />
                </svg>
              </span>
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Error Loading Appointments
            </h2>
            <p className="text-slate-600 mb-4">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-teal-600 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-6">
      {/* Cancel Modal */}
      <CancelModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCancel={handleCancel}
      />

      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-blue-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              My Appointments
            </h1>
            <p className="text-slate-600 mt-2">
              Manage your scheduled appointments
            </p>
          </div>

          {/* Status Filter */}
          <div className="mt-4 md:mt-0">
            <label className="block text-slate-700 text-sm font-medium mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-48 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        {appointmentsData && (
          <div className="text-sm text-slate-600 mb-4">
            Showing {appointmentsData.data?.length ?? 0} of{" "}
            {appointmentsData.total} appointment(s)
          </div>
        )}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading State
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-4 text-slate-600">
                Loading appointments...
              </span>
            </div>
          </div>
        ) : appointmentsData?.data?.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-blue-100">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <span className="text-blue-500 w-6 h-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              No appointments found
            </h3>
            <p className="text-slate-600 mb-4">
              {statusFilter === "PENDING"
                ? "You don't have any pending appointments."
                : `No ${statusFilter.toLowerCase()} appointments found.`}
            </p>
            {statusFilter !== "PENDING" && (
              <button
                onClick={() => setStatusFilter("PENDING")}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                View pending appointments
              </button>
            )}
          </div>
        ) : (
          // Appointments List
          appointmentsData?.data?.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100"
            >
              <AppointmentCard
                appointment={appointment}
                onAction={handleCancelClick}
                showActions={
                  appointment.status === "PENDING" ||
                  appointment.status === "CONFIRMED"
                }
              />
            </div>
          ))
        )}
      </div>

      {/* Pagination (unchanged) */}
      {appointmentsData && appointmentsData.totalPages > 1 && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mt-6 border border-blue-100">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="text-sm text-slate-600 mb-4 sm:mb-0">
              Page {currentPage} of {appointmentsData.totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1 || isLoading}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Previous
              </button>
              <div className="flex space-x-1">
                {Array.from(
                  { length: Math.min(5, appointmentsData.totalPages) },
                  (_, i) => {
                    let pageNum: number;

                    if (appointmentsData.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= appointmentsData.totalPages - 2) {
                      pageNum = appointmentsData.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={isLoading}
                        className={`w-10 h-10 rounded-xl transition-all duration-200 ${currentPage === pageNum
                          ? "bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}
                {appointmentsData.totalPages > 5 &&
                  currentPage < appointmentsData.totalPages - 2 && (
                    <span className="px-2 py-2 text-slate-400">...</span>
                  )}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(p + 1, appointmentsData.totalPages)
                  )
                }
                disabled={
                  currentPage === appointmentsData.totalPages || isLoading
                }
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
