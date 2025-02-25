'use client'
import { useRouter } from "next/navigation";
import { SignInForm } from "@/components/admin/signin/SignInForm";
import { setAuthCookie } from "@/utils/auth";
import toast from "react-hot-toast";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { AdminLogin } from "@/services/AccountService";
import { useAuth } from "@/app/context/AuthContext";
export default function AdminSignIn() {
  const router = useRouter();
  const { login } = useAuth();
  const loginMutation = useMutation({
    mutationFn: AdminLogin,
    onSuccess: (response) => {
      // Assuming your API returns a success indicator or token
      login(response.data);
      
      setAuthCookie();
      toast.success("Login successful!");
      router.push("/admin");
    },
    onError: (error) => {
     
      
      toast.error(error?.message || "Invalid credentials. Please try again.");
    }
  });

  const handleSignIn = async (credentials: { email: string; password: string }) => {
    // Call the mutation with credentials
    loginMutation.mutate(credentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
        <SignInForm 
          onSignIn={handleSignIn} 
          isLoading={loginMutation.isPending} 
        />
        <Link href="/" className="block mt-4 text-center text-primary">
          Go back to home
        </Link>
      </div>
    </div>
  );
}