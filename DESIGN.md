# Design Note
- All data shall be hard deleted (soft delete add complexity and not on the requirement)
- Scheduler used only by administrator with pre-registered patients, doctors, rooms, devices and services, thus no password required for auth
- [Limitation] cannot handle intraday booking (i.e, start 11.45PM done 12.15AM)
- [Limitation] assign appointment to a random room based on selected doctor and free room schedule