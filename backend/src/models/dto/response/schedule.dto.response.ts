export type TimeSlotDTORes = {
  doctorName: string
  starts: Date;
  ends: Date;
}

export type GetServiceAvailabilityDTORes = {
  doctorId: number;
  doctorName: string;
  date: Date;
  timeSlots: TimeSlotDTORes[];
}