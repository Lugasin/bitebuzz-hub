
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Vendor } from "@/models/vendor";
import Link from 'next/link';

const VendorLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const checkVendor = async () => {
          if (user) {
            try {
              const vendor = await Vendor.getVendorByFirebaseUid(user.uid);
              if (vendor) {
                console.log("Vendor already logged in, redirecting to dashboard");
                router.push('/vendor/dashboard');
              } else {
                console.log("User is not a vendor");
              }
            } catch (error) {
              console.error("Error checking vendor:", error);
            }
          }
        };
        checkVendor();
      }, [user, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("Attempting to log in vendor with email:", email);
      await login(email, password);
      console.log("Vendor login successful, redirecting to dashboard");
      toast({
        title: "Logged in!",
        description: "Welcome to your dashboard."
      });
      const vendor = await Vendor.getVendorByFirebaseUid(user.uid);
      if (!vendor) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User is not a vendor"
        });
      }
      router.push('/vendor/dashboard');
    } catch (error) {
        console.error('Vendor login failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Login failed. Please check your credentials."
      });
    }
  };

  return (
      <main>
          <div className="container flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
        <CardHeader>
            <CardTitle>Vendor Login</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <CardFooter className="flex justify-between">
                    <Button type="submit">Login</Button>
                    <Link href="/forgot-password">
                    <p className="text-sm">Forgot Password?</p>
                    </Link>
                </CardFooter>
            </div>
            </form>
        </CardContent>
        </Card>
          </div>
      </main>
  );
};

export default VendorLogin;
