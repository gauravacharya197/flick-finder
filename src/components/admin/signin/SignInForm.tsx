"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/primitives/card";
import { Input } from "@/components/ui/primitives/input";
import { Button } from "@/components/ui/primitives/button";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
type SignInFormProps = {
  onSignIn: (credentials: { email: string; password: string }) => void;
  isLoading?: boolean;
};

export const SignInForm = ({ onSignIn, isLoading = false }: SignInFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");  

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSignIn({ email, password });
      };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Admin Portal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
               value={email}
               onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="pl-10"
                required
              />
              <FaUser className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="password"
                placeholder="Password"
                className="pl-10"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              "Signing in..."
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In <FaSignInAlt />
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}