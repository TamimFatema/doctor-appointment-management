'use client';
import { useState } from "react";

interface ModalProps {
    doctor: { id: string; name: string };
    onClose: () => void;
    onConfirm: (date: string) => void;
  }
  
  export const BookAppointmentModal = ({ doctor, onClose, onConfirm }: ModalProps) => {
    const [date, setDate] = useState("");
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Book with {doctor.name}</h2>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
          />
          <div className="flex gap-4">
            <button
              onClick={() => onConfirm(date)}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Confirm
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
  