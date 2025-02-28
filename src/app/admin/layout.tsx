import { ReactNode } from "react";
import AdminProviders from "./AdminProviders"; // Import the new client-side wrapper

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminProviders>{children}</AdminProviders>;
}
