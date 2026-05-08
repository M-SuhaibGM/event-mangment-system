"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner"; // Using sonner instead of alert for a better UI

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Password Matching Validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // 2. Call Better Auth Sign Up
    await authClient.signUp.email({
      email,
      password,
      name,
    }, {
      onRequest: () => setLoading(true),
      onSuccess: () => {
        setLoading(false);
        toast.success("Account created! Redirecting...");
        router.push("/sign-in"); // Redirect to sign-in page after registration
      },
      onError: (ctx) => {
        setLoading(false);
        toast.error(ctx.error.message || "Registration failed. Try again.");
      },
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-[450px] shadow-lg border-none rounded-3xl p-4">
        <CardHeader>
          <CardTitle className="text-3xl font-black text-center uppercase tracking-tighter">
            Create Account
          </CardTitle>
          <p className="text-center text-gray-500 text-sm">Join the AWS Cloud community</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 ml-1">Full Name</label>
              <Input 
                type="text" 
                placeholder="John Doe" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="rounded-xl p-6 bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500"
                required 
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-400 ml-1">Email Address</label>
              <Input 
                type="email" 
                placeholder="jhon@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="rounded-xl p-6 bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500"
                required 
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-400 ml-1">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="rounded-xl p-6 bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500"
                required 
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-gray-400 ml-1">Confirm Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className="rounded-xl p-6 bg-gray-50 border-none focus-visible:ring-2 focus-visible:ring-blue-500"
                required 
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-lg font-bold shadow-lg shadow-blue-100 transition-all active:scale-[0.98]" 
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register Now"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Log in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}