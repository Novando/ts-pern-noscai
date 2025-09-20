'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';

export default function WelcomePage() {
  const router = useRouter();
  const { selectedClinicId, logout } = useAuth();

  // Handle redirection in useEffect instead of during render
  useEffect(() => {
    if (!selectedClinicId) {
      router.push('/');
    }
  }, [selectedClinicId, router]);

  // If no clinic is selected, show nothing while redirecting
  if (!selectedClinicId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Welcome to Our Clinic</h1>

        <div className="bg-white shadow rounded-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">What would you like to do?</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div
              className="bg-blue-50 p-6 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
              onClick={() => router.push('/appointments')}
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">New Appointment</h3>
              <p className="text-gray-600">Book a new service appointment</p>
            </div>

            <div
              className="bg-green-50 p-6 rounded-lg border border-green-100 hover:bg-green-100 transition-colors cursor-pointer"
              onClick={() => router.push('/schedules')}
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">View Schedules</h3>
              <p className="text-gray-600">Check doctor availability</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Select a different clinic
        </button>
      </div>
    </div>
  );
}
