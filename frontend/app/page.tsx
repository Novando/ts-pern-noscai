'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clinic } from '@/app/types/clinic';
import { fetchClinics } from '@/app/services/clinic';
import { ClinicCard } from '@/app/components/ClinicCard';
import { useAuth } from '@/app/contexts/AuthContext';

export default function ClinicSelectionPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { selectedClinicId, selectClinic } = useAuth();

  // Redirect to welcome page if already authenticated
  useEffect(() => {
    if (selectedClinicId) {
      router.push('/welcome');
    }
  }, [selectedClinicId, router]);

  useEffect(() => {
    const loadClinics = async () => {
      try {
        const response = await fetchClinics();
        setClinics(response.value.data);
        setError(null);
      } catch (err) {
        console.error('Failed to load clinics:', err);
        setError('Failed to load clinics. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadClinics();
  }, []);

  const handleClinicSelect = (clinic: Clinic) => {
    selectClinic(clinic.id.toString());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading clinics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="mt-3 text-lg font-medium text-gray-900">Error loading clinics</h2>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Select a Clinic</h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Please choose a clinic to continue
          </p>
        </div>

        {clinics.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No clinics found</h3>
            <p className="mt-1 text-sm text-gray-500">There are no clinics available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clinics.map((clinic) => (
              <ClinicCard 
                key={clinic.id} 
                clinic={clinic} 
                onSelect={handleClinicSelect} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
