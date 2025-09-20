'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';
import { fetchServices } from '@/src/services/service';
import { Service } from '@/src/types/service';
import {useToast} from "@/src/contexts/ToastContext";

export default function AppointmentsPage() {
  const router = useRouter();
  const { showError } = useToast();
  const { selectedClinicId } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services when component mounts or clinic changes
  useEffect(() => {
    const loadServices = async () => {
      if (!selectedClinicId) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchServices();
        setServices(data);
      } catch (err) {
        showError((err as Error).message)
        setError('Failed to load services. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, [selectedClinicId]);

  const handleServiceSelect = (serviceId: number) => {
    router.push(`/appointments/services/${serviceId}`);
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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Available Services at the clinic
          </h1>
          <p className="mt-2 text-gray-600">
            Select a service to book an appointment
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-6 text-red-600">{error}</div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services available at this clinic.</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleServiceSelect(service.id);
                }}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">
                      {service.duration} minutes
                    </span>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceSelect(service.id);
                      }}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Check Availability
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Clinic Selection
          </button>
        </div>
      </div>
    </div>
  );
}