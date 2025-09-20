import { Clinic } from '@/src/types/clinic';
import React from 'react';

type ClinicCardProps = {
  clinic: Clinic;
  onSelect: (clinic: Clinic) => void;
};

export const ClinicCard: React.FC<ClinicCardProps> = ({ clinic, onSelect }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-200"
      onClick={() => onSelect(clinic)}
    >
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{clinic.name}</h3>
            <p className="text-gray-500 text-sm">Click to select this clinic</p>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(clinic);
            }}
          >
            Select Clinic
            <svg
              className="ml-2 -mr-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
