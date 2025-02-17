'use client'
import { useRouter } from "next/navigation";
import { SignInForm } from "@/components/admin/signin/SignInForm";
import { setAuthCookie } from "@/utils/auth";

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
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
        <SignInForm onSignIn={handleSignIn} />
      </div>
    </div>
  );
}