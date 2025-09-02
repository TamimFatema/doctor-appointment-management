interface DoctorCardProps {
    doctor: {
      id: string;
      name: string;
      specialization: string;
      photo_url?: string | null;
    };
    onBook: (doctor: any) => void;
  }
  
  export const DoctorCard = ({ doctor, onBook }: DoctorCardProps) => (
    <div className="bg-white p-4 rounded shadow">
      <img
        src={doctor.photo_url || "/default-doctor.png"}
        alt={doctor.name}
        className="w-24 h-24 object-cover rounded-full mx-auto mb-2"
      />
      <h2 className="text-lg font-bold text-center">{doctor.name}</h2>
      <p className="text-gray-500 text-center mb-2">{doctor.specialization}</p>
      <button
        onClick={() => onBook(doctor)}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Book Appointment
      </button>
    </div>
  );
  