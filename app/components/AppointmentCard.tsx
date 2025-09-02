interface AppointmentCardProps {
    appointment: {
      id: string;
      doctor: { name: string; specialization: string };
      date: string;
      status: string;
    };
  }
  
  export const AppointmentCard = ({ appointment }: AppointmentCardProps) => (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        <p>
          <span className="font-bold">Doctor:</span> {appointment.doctor.name}
        </p>
        <p>
          <span className="font-bold">Specialization:</span> {appointment.doctor.specialization}
        </p>
        <p>
          <span className="font-bold">Date:</span>{" "}
          {new Date(appointment.date).toLocaleDateString("en-GB")}
        </p>
        <p>
          <span className="font-bold">Status:</span> {appointment.status}
        </p>
      </div>
    </div>
  );
  