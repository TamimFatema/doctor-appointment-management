"use client";

import { useState } from "react";
import { useDoctorAppointments } from "../../../hooks/useAppointments";
import { useAuthStore } from "../../../store/useAuthStore";
import { api } from "../../../utils/api";

export default function DoctorDashboard() {
  const user = useAuthStore((state) => state.user);
  const [selectedDate, setSelectedDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [actionType, setActionType] = useState<"COMPLETED" | "CANCELLED" | null>(null);

  const { data: appointments = [], refetch } = useDoctorAppointments(
    selectedDate,
    statusFilter === "PENDING" ? undefined : statusFilter,
    currentPage
  );

  // Pagination setup
  const appointmentsPerPage = 5;
  const totalPages = Math.ceil(appointments.length / appointmentsPerPage);
  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * appointmentsPerPage,
    currentPage * appointmentsPerPage
  );

  const handleStatusUpdate = async (
    appointmentId: string,
    status: "COMPLETED" | "CANCELLED"
  ) => {
    try {
      await api.patch("/appointments/update-status", {
        appointment_id: appointmentId,
        status,
      });
      refetch();
      alert(`Appointment marked as ${status.toLowerCase()} successfully!`);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update appointment status");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-600">
      <h1 className="text-3xl font-bold mb-6">Welcome, Dr. {user?.name}</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Filter Appointments</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border px-3 py-2 rounded border-gray-400 text-gray-600"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border px-3 py-2 rounded border-gray-400 text-gray-600"
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>


      {/* Appointments List */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>

        {paginatedAppointments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No appointments found.</p>
        ) : (
          <div className="space-y-4">
            {paginatedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <img
                    src={
                      appointment.patient.photo_url ||
                      "https://via.placeholder.com/50x50.png?text=Patient"
                    }
                    alt={appointment.patient.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{appointment.patient.name}</p>
                    <p className="text-gray-600">
                      {new Date(appointment.date).toLocaleDateString()} at{" "}
                      {new Date(appointment.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${appointment.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : appointment.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {appointment.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setActionType("COMPLETED");
                          setIsModalOpen(true);
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setActionType("CANCELLED");
                          setIsModalOpen(true);
                        }}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4 mb-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded ${currentPage === index + 1
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && selectedAppointment && actionType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Confirm {actionType === "COMPLETED" ? "Completion" : "Cancellation"}
            </h3>
            <p className="mb-6">
              Are you sure you want to mark the appointment with{" "}
              <span className="font-semibold">
                {selectedAppointment.patient.name}
              </span>{" "}
              as{" "}
              <span className="font-bold">{actionType.toLowerCase()}</span>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleStatusUpdate(selectedAppointment.id, actionType);
                  setIsModalOpen(false);
                }}
                className={`px-4 py-2 rounded text-white ${actionType === "COMPLETED"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                  }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
