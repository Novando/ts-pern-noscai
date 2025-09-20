# Design Note

## Core Design Decisions
- All data shall be hard deleted (soft delete add complexity and not on the requirement)
- Scheduler used only by administrator with pre-registered patients, doctors, rooms, devices and services, thus no password required for auth
- Assign appointment to a random room based on selected doctor and free room schedule
- Clinic service availability is checked based on doctor and room availability
- Time slot is displayed available without buffer
- Buffer will be applied once appointment is created

## Known Limitations
1. **Time Handling**:
    - Cannot handle intraday bookings crossing midnight (e.g., 11:45 PM to 12:15 AM)
    - Timezone handling is simplified (use UTC for database storage, sent with Berlin time to client. Display on UI are based on the client location)

2. **Scheduling Logic**:
    - Room assignment is random based on doctor availability
    - Checking all working hours and break time of doctors, clinics and rooms.
    - Limited conflict resolution for overlapping schedules (using constraint check in each doctor_services, rooms, patients, and time range)

3. **Performance Considerations**:
    - No pagination implementation for large datasets
    - Potential performance impact with increasing dataset
    - No caching layer implemented (cookie cache only for 15 minutes, for idempotent HTTP method)

## Technical Tradeoffs
1. **Testing**:
    - No unit tests implemented

2. **Error Handling**:
    - Simplified error handling (but standardized) in favor of development speed

## Pending Decisions
- [ ] Finalize holiday/blackout date handling
- [ ] Extra cache layer

## Security Notes
- No rate limiting implemented
- No CORS origin
- Input validation is basic and may need strengthening