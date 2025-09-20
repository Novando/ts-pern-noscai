export type ScheduleEntity = {
  doctorId?: number;
  doctorName?: string;
  dayOfWeek: number;
  startsAt: Date;
  endsAt: Date;
  breaks: { startsAt: Date; endsAt: Date }[];
};