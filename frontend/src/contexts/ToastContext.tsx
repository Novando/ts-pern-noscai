'use client';

import { createContext, useContext, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';

type ToastContextType = {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
};

const ToastContext = createContext<ToastContextType>({
  showSuccess: () => {},
  showError: () => {},
});

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const showSuccess = useCallback((message: string) => {
    toast.success(message, {
      duration: 2000,
      position: 'top-center',
    });
  }, []);

  const showError = useCallback((message: string) => {
    toast.error(message, {
      duration: 3000,
      position: 'top-center',
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      <Toaster
        toastOptions={{
          className: '!bg-white !text-gray-800 !shadow-lg',
          success: {
            className: '!bg-green-50 !text-green-700',
            iconTheme: {
              primary: '#10B981',
              secondary: 'white',
            },
          },
          error: {
            className: '!bg-red-50 !text-red-700',
            iconTheme: {
              primary: '#EF4444',
              secondary: 'white',
            },
          },
        }}
      />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
