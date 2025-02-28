"use client";

import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function NavbarClient() {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <FaUserCircle className="text-2xl text-gray-600" />
      <span className="text-gray-700 font-medium">{user?.name || "Guest"}</span>
    </div>
  );
}
