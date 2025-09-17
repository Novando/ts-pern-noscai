export const roomScheduleQueryCheckWorkingHour = `-- roomScheduleQueryCheckWorkingHour
  WITH appt AS (
    SELECT
      $1::bigint[] AS room_ids,
      $3::timestamptz AS appointment_start,
      $4::timestamptz AS appointment_end,
      EXTRACT(DOW FROM $3::timestamptz)::int AS dow
  )
  SELECT rs.room_id AS id FROM appt
  INNER JOIN room_schedules rs ON rs.room_id = ANY(appt.room_ids) AND rs.day_of_week = $2
  WHERE (appt.appointment_start::time >= rs.starts_at
    AND appt.appointment_end::time <= rs.ends_at)
    AND NOT EXISTS (
      SELECT 1 FROM room_schedule_break_hours b 
      WHERE b.room_schedule_id = rs.id
        AND tstzrange(appt.appointment_start, appt.appointment_end, '[)')
          && tstzrange(
            appt.appointment_start::date + b.starts_at,
            appt.appointment_start::date + b.ends_at,
            '[)'
          )
    )
  LIMIT 1
`