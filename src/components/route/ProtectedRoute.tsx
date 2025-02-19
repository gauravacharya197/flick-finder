"use client";

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/not-found'); // Redirect to 404 page
    }
  }, [isLoggedIn, loading, router]);

  if (loading) {
    return <div>Loading...</div>; // You can customize this loader
  }

  if (!isLoggedIn) {
    return null; // Avoid flickering
  }

  return <>{children}</>;
};

export default ProtectedRoute;
