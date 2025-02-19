'use client'
import { useRouter } from "next/navigation";
import { SignInForm } from "@/components/admin/signin/SignInForm";
import { setAuthCookie } from "@/utils/auth";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminSignIn() {
  const router = useRouter();

  const handleSignIn = async (credentials: { email: string; password: string }) => {
    // Simulating authentication (Replace this with actual auth logic)
    const isAuthenticated = 
      credentials.email === "gaurav@g.com" && 
      credentials.password === "password";

    if (isAuthenticated) {
      setAuthCookie();
      router.push("/admin");
    } else {
     toast.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
        <SignInForm onSignIn={handleSignIn} />
        <Link href="/" className="block mt-4 text-center text-primary">
          Go back to home </Link>
      </div>
    </div>
  );
}