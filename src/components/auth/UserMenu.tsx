import React, { useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { FaUser, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import Modal from "@/components/ui/Modal";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../ui/primitives/card";
import { Button } from "../ui/primitives/button";

const UserMenu = () => {
  const { isLoggedIn, user, logout,loading } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    if (isLoggedIn) setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);
  const handleLogout = () => {
    logout();
    setModalOpen(false);
  };

  // Get user's first letter if logged in
  const userInitial = isLoggedIn && user?.name ? user.name.charAt(0).toUpperCase() : null;
  if (loading)  return <></>
  return (
    <div className="relative" ref={menuRef}>
      {isLoggedIn ? (
        <button
          className="flex items-center hover:scale-105"
          onClick={handleButtonClick}
        >
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-500 shadow-md">
            <span className="text-black text-lg font-bold">{userInitial}</span>
          </div>
        </button>
      ) : (
        <Link href="/auth/login" className="flex items-center hover:scale-105">
  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-500 shadow-md">
    <FaUser className="text-black text-xs sm:text-base" />
  </div>
</Link>
      )}

      <Modal 
        open={modalOpen} 
        onCancel={handleCloseModal} 
        width={320}
        centered
        className="p-0 rounded-lg overflow-hidden"
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="px-4 pt-4 pb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-500 shadow-sm">
                <span className="text-black text-lg font-bold">{userInitial}</span>
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{user?.name}</CardTitle>
                <CardDescription className="text-xs mt-0.5 truncate">{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
            
          <CardContent className="px-7 py-3">
            <div className="flex items-center gap-2 py-1">
              <span className="text-sm text-white">Login Mode: {user?.authenticationProvider}</span>
            </div>
          </CardContent>
            
          <CardFooter className="flex justify-between items-center px-4 py-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700"
            >
              Close
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <FaSignOutAlt size={14} />
              Logout
            </Button>
          </CardFooter>
        </Card>
      </Modal>
    </div>
  );
};

export default UserMenu;