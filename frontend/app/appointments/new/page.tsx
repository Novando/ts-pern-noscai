'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { useAuth } from '@/app/contexts/AuthContext';
import { fetchServiceAvailability } from '@/app/services/schedule';
import { TimeSlot } from '@/app/types/schedule';

// Mock service ID - replace with actual service selection in a real app
const SERVICE_ID = 1;

export default function NewAppointmentPage() {
  const router = useRouter();
  const { selectedClinicId } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Calculate min and max dates
  const minDate = new Date();
  const maxDate = dayjs().add(3, 'day').toDate();

  // Fetch time slots when selected date changes
  useEffect(() => {
    const loadTimeSlots = async () => {
      if (!selectedClinicId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchServiceAvailability(SERVICE_ID, selectedDate);
        setTimeSlots(response.value.timeSlots || []);
      } catch (err) {
        console.error('Error loading time slots:', err);
        setError('Failed to load available time slots. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTimeSlots();
  }, [selectedDate, selectedClinicId]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    // Here you would typically submit the appointment
    console.log('Selected appointment:', {
      serviceId: SERVICE_ID,
      clinicId: selectedClinicId,
      startTime: selectedSlot.start,
      endTime: selectedSlot.end
    });

    // Redirect to confirmation page or next step
    // router.push('/appointments/confirm');
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="mt-2 text-gray-600">Select a date and time for your appointment</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
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
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSlotSelect(slot)}
                    disabled={!slot.available}
                    className={`p-4 rounded-md border ${
                      selectedSlot?.start === slot.start
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'
                    } ${!slot.available ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  >
                    <div className="font-medium">
                      {dayjs(slot.start).format('h:mm A')} - {dayjs(slot.end).format('h:mm A')}
                    </div>
                    {!slot.available && (
                      <div className="text-xs text-red-600 mt-1">Booked</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/welcome')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedSlot}
            className={`px-6 py-2 rounded-md ${
              selectedSlot
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
