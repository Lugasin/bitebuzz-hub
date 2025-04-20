import React, { useState, useRef } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { BurgerIcon } from "@/components/ui/icons";

const Login = () => {
  const { loginWithPhoneNumber, loginWithGoogle, isLoading, isAuthenticated, userRole, sendCode } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [formData, setFormData] = useState({
    phoneNumber: "",
    code: "",
  });

  const [showCodeInput, setShowCodeInput] = useState(false);

  const sendVerificationCode = async () => {
    if (!formData.phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }
    try {
      await sendCode(formData.phoneNumber);
      setShowCodeInput(true);
      toast({
        title: "Code Sent",
        description: "A verification code has been sent to your phone number.",
      });
    } catch (error) {
      toast({
        title: "Error Sending Code",
        description: "There was an error sending the verification code.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.phoneNumber || !formData.code) {
      toast({
        title: "Missing Information",
        description: "Please enter your phone number and verification code.",
        variant: "destructive",
      });
      return;
    }
    try {
      await loginWithPhoneNumber(formData.phoneNumber, formData.code);
      // Navigation logic after successful login based on userRole
      navigate("/");
      // if (userRole === "customer") {
      //   navigate("/");
      // } else if (userRole === "vendor") {
      //   navigate("/vendor");
      // } else if (userRole === "delivery") {
      //   navigate("/delivery");
      // } else {
      //   // Default navigation if userRole is unexpected or null
      //   navigate("/");
      // }
    } catch (error) {
      console.error("Login error:", error); // Added a prefix for clarity

      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isAuthenticated) {
    navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Link
        to="/"
        className="absolute top-4 left-4 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BurgerIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">E-eats</h1>
          </div>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your phone number to login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              {showCodeInput && (
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>

                
                <div className="relative">
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    placeholder="Verification code"
                    value={formData.code}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                </div>
              )}

              {!showCodeInput && (
                <Button
                  type="button"
                  className="w-full"
                  onClick={sendVerificationCode}
                  disabled={isLoading}
                >
                  Send Code
                </Button>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    {" "}
                    {/* Added justify-center */}
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center"> {/* Added justify-center */}
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div
                className="relative flex justify-center text-xs uppercase"
              >
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={loginWithGoogle}
                disabled={isLoading}
              >
                {/*  */}


                <svg viewBox="0 0 48 48" className="h-5 w-5 mr-2">
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                Sign in with Google
              </Button>
            </div>
             </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-medium"
              >
                Sign up
               </Link>
            </p>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/guest-order" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Continue as guest
          </Link>
        </div>
      </motion.div>
    </div>
  );
};


export default Login;