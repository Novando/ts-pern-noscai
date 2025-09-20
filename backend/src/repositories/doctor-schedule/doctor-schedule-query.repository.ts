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

export function doctorScheduleQueryGetMultipleDoctorBusinessHoursByServiceId (whereCond: string[]){
  return `-- doctorScheduleQueryGetMultipleDoctorBusinessHoursByServiceId
    SELECT 
      ds.day_of_week AS day_of_week,
      ds.starts_at AS starts_at,
      ds.ends_at AS ends_at,
      d.id AS doctor_id,
      d.name AS doctor_name,
      COALESCE(
        json_agg(
          json_build_object(
            'starts_at', dsb.starts_at,
            'ends_at', dsb.ends_at
          )
          ORDER BY dsb.starts_at
        ) FILTER (WHERE dsb.id IS NOT NULL),
        '[]'::json
      ) AS breaks
    FROM doctor_schedules ds
    LEFT JOIN doctor_schedule_break_hours dsb ON ds.id = dsb.doctor_schedule_id
    INNER JOIN doctor_services doc_ser ON ds.doctor_id = doc_ser.doctor_id AND doc_ser.service_id = $1
    INNER JOIN services s ON s.id = doc_ser.service_id
    INNER JOIN rooms r ON r.id = s.room_id AND r.clinic_id = $2
    INNER JOIN doctors d ON d.id = ds.doctor_id
    WHERE 1=1
    ${whereCond.join("\n    ")}
    GROUP BY d.id, ds.day_of_week, ds.starts_at, ds.ends_at
  `
}