export const clinicScheduleQueryCheckWorkingHour = `-- clinicScheduleQueryCheckWorkingHour
  WITH appt AS (
    SELECT
      $1::bigint AS clinic_id,
      $3::timestamptz AS appointment_start,
      $4::timestamptz AS appointment_end,
      EXTRACT(DOW FROM $3::timestamptz)::int AS dow
  )
  SELECT
    NOT EXISTS (
      SELECT 1 FROM clinic_schedule_break_hours b
      WHERE b.clinic_schedule_id = cs.id
        AND tstzrange(appt.appointment_start, appt.appointment_end, '[)')
          && tstzrange(
            appt.appointment_start::date + b.starts_at,
            appt.appointment_start::date + b.ends_at,
            '[)'
          )
    ) AS not_in_break
  FROM appt
  JOIN clinic_schedules cs ON cs.clinic_id = appt.clinic_id AND cs.day_of_week = $2
  WHERE (appt.appointment_start::time >= cs.starts_at AND appt.appointment_end::time <= cs.ends_at);
`