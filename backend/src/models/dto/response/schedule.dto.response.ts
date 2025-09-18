export type TimeSlotDTORes = {
  starts: Date;
  ends: Date;
}

export type GetServiceAvailabilityDTORes = {
  date: Date;
  timeSlots: TimeSlotDTORes[];
}