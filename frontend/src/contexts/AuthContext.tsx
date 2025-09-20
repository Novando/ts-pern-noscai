'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getCookie, setCookie } from '@/app/utils/cookies';

interface AuthContextType {
  selectedClinicId: string | null;
  selectClinic: (clinicId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing clinic ID in cookies on initial load
    const clinicId = getCookie('clinicId');
    if (clinicId) {
      setSelectedClinicId(clinicId);
    }
  }, []);

  const selectClinic = (clinicId: string) => {
    setCookie('clinicId', clinicId);
    setSelectedClinicId(clinicId);
    router.push('/welcome');
  };

  const logout = () => {
    document.cookie = 'clinicId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setSelectedClinicId(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ selectedClinicId, selectClinic, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
