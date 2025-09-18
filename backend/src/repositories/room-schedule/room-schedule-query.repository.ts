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

export const roomScheduleQueryGetMultipleRoomBusinessHoursByServiceId = `-- roomScheduleQueryGetMultipleRoomBusinessHoursByServiceId
  SELECT 
    rs.day_of_week AS day_of_week,
    rs.starts_at AS starts_at,
    rs.ends_at AS ends_at,
    COALESCE(
      json_agg(
        json_build_object(
          'starts_at', rsb.starts_at,
          'ends_at', rsb.ends_at
        )
        ORDER BY rsb.starts_at
      ) FILTER (WHERE rsb.id IS NOT NULL),
      '[]'::json
    ) AS breaks
  FROM room_schedules rs
  LEFT JOIN room_schedule_break_hours rsb ON rs.id = rsb.room_schedule_id
  INNER JOIN services s ON rs.room_id = s.room_id WHERE s.id = $1
  GROUP BY rs.id, rs.day_of_week, rs.starts_at, rs.ends_at
`