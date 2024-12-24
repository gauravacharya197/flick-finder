"use client"
import Contact from "@/components/Contact";
import { Dashboard } from "@/components/Dashboard";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  useEffect(() => {
    console.log("UI Effect running");
  }, []);
    return (
        <Dashboard/>
  )
}
