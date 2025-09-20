export type GetDoctorBookedScheduleDTOReq = {
  doctorId: number;
  clinicId: number;
  from: Date;
  to: Date;
};
