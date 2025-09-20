export type BookedAppointmentDTORes = {
  id: number;
  doctorName: string;
  roomName: string;
  patientName: string;
  serviceName: string;
  startsAt: Date;
  endsAt: Date;
};