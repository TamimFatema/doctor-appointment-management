"use client";

import { useState } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useDoctors } from "../../../hooks/useDoctors";
import { usePatientAppointments } from "../../../hooks/useAppointments";
import { api } from "../../../utils/api";
import { DoctorList } from "../../components/DoctorList";
import { BookAppointmentModal } from "../../components/BookAppointmentModal";
import { AppointmentCard } from "../../components/AppointmentCard";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  photo_url: string | null;
}

interface Appointment {
  id: string;
  doctor: Doctor;
  date: string;
  status: string;
}

export default function PatientDashboard() {
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const { data: doctorsData = [] } = useDoctors(search, specialization);
  const { data: appointmentsData, refetch } = usePatientAppointments(
    user?.id || ""
  );

  const handleBook = async (date: string) => {
    if (!selectedDoctor) return;
    await api.post("/appointments", { doctorId: selectedDoctor.id, date });
    setSelectedDoctor(null);
    refetch();
    alert("Appointment booked successfully!");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-400">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h1>

      {/* Search + filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
        />
        <input
          type="text"
          placeholder="Filter by specialization..."
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* Doctor list with pagination */}
      <DoctorList
        doctors={doctorsData}
        onBook={setSelectedDoctor}
        itemsPerPage={6}
      />

      {/* Book appointment modal */}
      {selectedDoctor && (
        <BookAppointmentModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onConfirm={handleBook}
        />
      )}

      {/* Patient appointments */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
        <div className="grid grid-cols-1 gap-4">
          {appointmentsData?.map((app: Appointment) => (
            <AppointmentCard key={app.id} appointment={app} />
          ))}
        </div>
      </div>
    </div>
  );
}
