'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dayjs from 'dayjs';
import { useAuth } from '@/src/contexts/AuthContext';
import { fetchServiceAvailability } from '@/src/services/schedule';
import {AvailabilityResponse, TimeSlot} from '@/src/types/schedule';
import { Service } from '@/src/types/service';
import { fetchDoctorsByService, Doctor } from '@/src/services/doctor';
import { useToast } from '@/src/contexts/ToastContext';
import { bookAppointment } from '@/src/services/appointment';

export default function ServiceAppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(params.id);
  const { selectedClinicId } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<AvailabilityResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  // const [service, setService] = useState<Service | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  // Calculate min and max dates
  const minDate = new Date();
  const maxDate = dayjs().add(30, 'day').toDate();

  useEffect(() => {
    if (serviceId && selectedClinicId) {
      loadAvailability();
      loadDoctors();
    }
  }, [serviceId, selectedClinicId]);

  useEffect(() => {
    if (selectedDate) {
      loadAvailability();
    }
  }, [selectedDate, selectedDoctor]);

  // const loadService = async () => {
  //   try {
  //     const data = await fetchServiceById(serviceId);
  //     setService(data);
  //   } catch (error) {
  //     console.error('Error loading service details:', error);
  //     setError('Failed to load service details. Please try again.');
  //   }
  // };

  const loadDoctors = async () => {
    try {
      const data = await fetchDoctorsByService(serviceId);
      setDoctors(data);
    } catch (error) {
      console.error('Error loading doctors:', error);
      setError('Failed to load doctors. Please try again.');
    }
  };

  const loadAvailability = async () => {
    if (!selectedClinicId) return;

    setIsLoading(true);
    try {
      const response = await fetchServiceAvailability({
        serviceId,
        selectedTime: selectedDate,
        doctorId: selectedDoctor || undefined
      });
      setTimeSlots(response.value.data || []);
    } catch (err) {
      console.error('Error loading time slots:', err);
      setError('Failed to load available time slots. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
    setSelectedSlot(null);
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const doctorId = e.target.value ? parseInt(e.target.value) : null;
    setSelectedDoctor(doctorId);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleSubmit = async () => {
    if (!selectedSlot || !selectedClinicId) return;

    setIsSubmitting(true);
    try {
      // Find the availability that contains the selected slot
      const availability = timeSlots.find(avail => 
        avail.timeSlots.some(slot => 
          slot.starts === selectedSlot.starts && 
          slot.ends === selectedSlot.ends
        )
      );

      if (!availability) {
        throw new Error('Selected time slot is no longer available');
      }

      await bookAppointment({
        serviceId: serviceId,
        startsAt: selectedSlot.starts,
        patientId: 1, // Using 1 as dummy patient ID
        doctorId: availability.doctorId
      });

      showSuccess('Appointment booked successfully!');
      router.push('/appointments'); // Redirect to appointments page
    } catch (error) {
      console.error('Error booking appointment:', error);
      showError('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedClinicId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Please select a clinic first</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Select Clinic
          </button>
        </div>
      </div>
    );
  }

  // if (!service) {
  //   return <div>Loading service details...</div>;
  // }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="mt-2 text-gray-600">Select a date and time for your appointment</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="mb-6">
            <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-2">
              Select Doctor (Optional)
            </label>
            <select
              id="doctor"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={selectedDoctor || ''}
              onChange={handleDoctorChange}
            >
              <option value="">Any Available Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="appointment-date" className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              id="appointment-date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              min={dayjs(minDate).format('YYYY-MM-DD')}
              max={dayjs(maxDate).format('YYYY-MM-DD')}
              value={dayjs(selectedDate).format('YYYY-MM-DD')}
              onChange={handleDateChange}
            />
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Available Time Slots for {dayjs(selectedDate).format('dddd, MMMM D, YYYY')}
              {selectedDoctor && ` with ${doctors.find(d => d.id === selectedDoctor)?.name}`}
            </h2>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-6 text-red-600">{error}</div>
            ) : timeSlots.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No available time slots for the selected date. Please choose another date.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {timeSlots.flatMap(availability =>
                  availability.timeSlots.map((slot, index) => (
                    <button
                      key={`${availability.doctorId}-${index}`}
                      type="button"
                      onClick={() => handleSlotSelect(slot)}
                      className={`p-4 rounded-md border hover:bg-gray-50 ${
                        selectedSlot?.starts === slot.starts
                          ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-medium text-black">
                        {dayjs(slot.starts).format('h:mm A')} - {dayjs(slot.ends).format('h:mm A')}
                      </div>(
                      <div className="text-sm text-gray-500 mt-1">
                        Dr. {availability.doctorName}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedSlot || isSubmitting}
            className={`px-6 py-2 rounded-md ${
              selectedSlot && !isSubmitting
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Booking...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
