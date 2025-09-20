export type TimeSlotDTORes = {
  doctorName: string
  starts: Date;
  ends: Date;
}

export type GetServiceAvailabilityDTORes = {
  date: Date;
  timeSlots: TimeSlotDTORes[];
}