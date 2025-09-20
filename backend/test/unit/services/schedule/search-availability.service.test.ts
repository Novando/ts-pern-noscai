// @ts-nocheck
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { searchAvailabilityService } from '../../../../src/services/schedule/search-availability.service';
import { withTx } from '../../../../src/utils/pg-tx.util';

// Mock the dependencies
jest.mock('../../../../src/utils/pg-tx.util');

// Mock the repositories
const mockDb = { query: jest.fn() };
const mockClinicScheduleRepository = {
  getClinicBusinessHours: jest.fn(),
};
const mockDoctorScheduleRepository = {
  getMultipleDoctorBusinessHoursByServiceId: jest.fn(),
};
const mockRoomScheduleRepository = {
  getMultipleRoomBusinessHoursByServiceId: jest.fn(),
};
const mockAppointmentRepository = {
  getAppointmentByServiceId: jest.fn(),
};

// Create a mock context with all required properties
const mockContext = {
  db: mockDb,
  clinicScheduleRepository: mockClinicScheduleRepository,
  doctorScheduleRepository: mockDoctorScheduleRepository,
  roomScheduleRepository: mockRoomScheduleRepository,
  appointmentRepository: mockAppointmentRepository,
} as any;

describe('searchAvailabilityService', () => {
  const validParams = {
    clinicId: 1,
    serviceId: 1,
    selectedTime: '2023-09-21T10:00:00Z',
  };

  const mockClinicSchedule = [
    { day_of_week: 4, start_time: '09:00:00', end_time: '17:00:00' }, // Thursday
  ];

  const mockDoctorSchedules = [
    {
      doctor_id: 1,
      doctor_name: 'Dr. Smith',
      day_of_week: 4,
      start_time: '09:00:00',
      end_time: '17:00:00',
    },
  ];

  const mockRoomSchedules = [
    {
      room_id: 1,
      day_of_week: 4,
      start_time: '09:00:00',
      end_time: '17:00:00',
    },
  ];

  const mockAppointments = [
    {
      id: 1,
      starts_at: '2023-09-21T10:00:00Z',
      ends_at: '2023-09-21T10:30:00Z',
      doctor_id: 1,
      doctor_name: 'Dr. Smith',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock withTx to execute the callback with the mock context
    (withTx as jest.Mock).mockImplementation(async (db, callback) => {
      return callback(mockContext);
    });

    // Setup default mock responses
    mockClinicScheduleRepository.getClinicBusinessHours.mockResolvedValue(mockClinicSchedule);
    mockDoctorScheduleRepository.getMultipleDoctorBusinessHoursByServiceId.mockResolvedValue(mockDoctorSchedules);
    mockRoomScheduleRepository.getMultipleRoomBusinessHoursByServiceId.mockResolvedValue(mockRoomSchedules);
    mockAppointmentRepository.getAppointmentByServiceId.mockResolvedValue(mockAppointments);
  });

  it('should validate input parameters', async () => {
    // Test with missing required fields
    await expect(searchAvailabilityService.call(mockContext, {} as any))
      .rejects.toThrow('"clinicId" is required');

    // Test with invalid date
    await expect(searchAvailabilityService.call(mockContext, {
      ...validParams,
      selectedTime: 'invalid-date',
    })).rejects.toThrow('"selectedTime" must be a valid date');
  });

  it('should return available time slots when no appointments exist', async () => {
    // Mock no appointments
    mockAppointmentRepository.getAppointmentByServiceId.mockResolvedValueOnce([]);

    const result = await searchAvailabilityService.call(mockContext, validParams);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('date');
    expect(result[0]).toHaveProperty('doctorId');
    expect(result[0]).toHaveProperty('timeSlots');
  });

  it('should handle no availability when clinic is closed', async () => {
    // Mock clinic closed on the selected day
    mockClinicScheduleRepository.getClinicBusinessHours.mockResolvedValueOnce([
      { day_of_week: 5, start_time: '09:00:00', end_time: '17:00:00' }, // Friday
    ]);

    const result = await searchAvailabilityService.call(mockContext, validParams);
    expect(result).toHaveLength(0);
  });

  it('should filter out booked time slots', async () => {
    // Mock an appointment from 10:00 to 10:30
    mockAppointmentRepository.getAppointmentByServiceId.mockResolvedValueOnce([
      {
        id: 1,
        starts_at: '2023-09-21T10:00:00Z',
        ends_at: '2023-09-21T10:30:00Z',
        doctor_id: 1,
      },
    ]);

    const result = await searchAvailabilityService.call(mockContext, validParams);

    // The 10:00-10:30 slot should be booked
    const hasBookedSlot = result.some(day =>
      day.timeSlots.some(slot =>
        slot.startTime === '10:00:00' && slot.endTime === '10:30:00'
      )
    );

    expect(hasBookedSlot).toBe(false);
  });

  it('should limit results to 3 time slots', async () => {
    // Mock multiple available time slots
    mockAppointmentRepository.getAppointmentByServiceId.mockResolvedValueOnce([]);

    const result = await searchAvailabilityService.call(mockContext, validParams);

    // Count total time slots across all days
    const totalSlots = result.reduce((sum, day) => sum + day.timeSlots.length, 0);
    expect(totalSlots).toBeLessThanOrEqual(3);
  });

  it('should handle database errors', async () => {
    // Mock a database error
    const error = new Error('Database connection failed');
    mockClinicScheduleRepository.getClinicBusinessHours.mockRejectedValueOnce(error);

    await expect(searchAvailabilityService.call(mockContext, validParams))
      .rejects.toThrow('Database connection failed');
  });

  it('should filter by doctorId when provided', async () => {
    const doctorId = 2;

    await searchAvailabilityService.call(mockContext, {
      ...validParams,
      doctorId,
    });

    expect(mockDoctorScheduleRepository.getMultipleDoctorBusinessHoursByServiceId)
      .toHaveBeenCalledWith(validParams.serviceId, validParams.clinicId, doctorId);
  });
});
