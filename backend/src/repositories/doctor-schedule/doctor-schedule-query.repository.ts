export const doctorScheduleQueryCheckWorkingHour = `-- doctorScheduleQueryCheckWorkingHour
  WITH appt AS (
    SELECT
      $1::bigint AS doctor_id,
      $3::timestamptz AS appointment_start,
      $4::timestamptz AS appointment_end,
      EXTRACT(DOW FROM $3::timestamptz)::int AS dow
  )
  SELECT
    NOT EXISTS (
      SELECT 1 FROM doctor_schedule_break_hours b
      WHERE b.doctor_schedule_id = ds.id
        AND tstzrange(appt.appointment_start, appt.appointment_end, '[)')
          && tstzrange(
            appt.appointment_start::date + b.starts_at,
            appt.appointment_start::date + b.ends_at,
            '[)'
          )
    ) AS not_in_break
  FROM appt
  JOIN doctor_schedules ds ON ds.doctor_id = appt.doctor_id AND ds.day_of_week = $2
  WHERE (appt.appointment_start::time >= ds.starts_at AND appt.appointment_end::time <= ds.ends_at);
`