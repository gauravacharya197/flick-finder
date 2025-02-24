import Container from '@/components/common/Container';
import ProtectedRoute from '@/components/route/ProtectedRoute';
import { UserSettings } from '@/components/userSettings';
import { siteConfig } from '@/config/siteConfig';
import { Metadata } from 'next';
import React from 'react'
export const metadata: Metadata = {
  title: `${siteConfig.siteName} - Settings`,
  description: siteConfig.description,
  // other metadata
};
 const SettingsPage = () => {
  return (
    <Container className='text-white'>
       <ProtectedRoute>
     <UserSettings/>
     </ProtectedRoute>
    
    </Container>

  )
}
export default SettingsPage;