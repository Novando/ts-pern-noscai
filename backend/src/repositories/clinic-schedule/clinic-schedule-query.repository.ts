export const clinicScheduleQueryCheckBusinessHour = `-- clinicScheduleQueryCheckWorkingHour
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

export const clinicScheduleQueryGetClinicBusinessHours = `-- clinicScheduleQueryGetClinicBusinessHours
  SELECT
    cs.day_of_week AS day_of_week,
    cs.starts_at AS starts_at,
    cs.ends_at AS ends_at,
    COALESCE(
      json_agg(
        json_build_object(
          'starts_at', csb.starts_at,
          'ends_at', csb.ends_at
        )
        ORDER BY csb.starts_at
      ) FILTER (WHERE csb.id IS NOT NULL),
      '[]'::json
    ) AS breaks
  FROM clinic_schedules cs
  LEFT JOIN clinic_schedule_break_hours csb ON cs.id = csb.clinic_schedule_id
  WHERE cs.clinic_id = $1
  GROUP BY cs.id, cs.day_of_week, cs.starts_at, cs.ends_at
`