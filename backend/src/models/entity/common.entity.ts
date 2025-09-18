export type ScheduleEntity = {
  dayOfWeek: number;
  startsAt: Date;
  endsAt: Date;
  breaks: { startsAt: Date; endsAt: Date }[];
};