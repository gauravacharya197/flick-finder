'use client'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { GetUsers } from '@/services/AdminService'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/primitives/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/primitives/card';
import Skeleton from '@/components/common/Skeleton';
import { CustomTag } from '@/components/common/CustomTag';



export const Users = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => GetUsers(),
  })

  if (isLoading) {
    return (
      
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            
          </div>
      
    )
  }

  if (error) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Error Loading Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Failed to load user data. Please try again later.</p>
        </CardContent>
      </Card>
    )
  }

  return (  <>
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white dark:text-gray-100">
          Users
        </h1>
        
        
      </div>
  
       
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Auth Provider</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users?.data.length > 0 ? (
                users?.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                       
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.givenName} {user.familyName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.authenticationProvider}</TableCell>
                    <TableCell>
                      <CustomTag text={user.isVerified ? 'Verified' : 'Unverified'}>
                        
                      </CustomTag>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
          </>
 
 
  )
}

export default Users