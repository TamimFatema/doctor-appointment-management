"use client";

import { useState, useMemo } from "react";
import { DoctorCard } from "./DoctorCard";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  photo_url?: string | null;
}

interface DoctorListProps {
  doctors: Doctor[];
  onBook: (doctor: Doctor) => void;
  itemsPerPage?: number;
}

export const DoctorList = ({
  doctors,
  onBook,
  itemsPerPage = 6,
}: DoctorListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpec, setFilterSpec] = useState("ALL");

  // Get unique specializations
  const specializations = useMemo(() => {
    const specs = Array.from(new Set(doctors.map((d) => d.specialization)));
    return ["ALL", ...specs];
  }, [doctors]);

  // Filter + search
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch = doctor.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesSpec =
        filterSpec === "ALL" || doctor.specialization === filterSpec;
      return matchesSearch && matchesSpec;
    });
  }, [doctors, searchQuery, filterSpec]);

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDoctors = filteredDoctors.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl justify-between">
        <input
          type="text"
          placeholder="Search by doctor name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-1/2 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={filterSpec}
          onChange={(e) => {
            setFilterSpec(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-1/3 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {specializations.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {currentDoctors.length > 0 ? (
          currentDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} onBook={onBook} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No doctors found.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded transition ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
