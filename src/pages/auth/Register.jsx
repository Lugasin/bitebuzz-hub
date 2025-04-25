
import React, { useState, useRef } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { InputOTP } from "@/components/ui/input-otp";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, Lock, User, ArrowLeft, Phone } from "lucide-react";
import { BurgerIcon } from "@/components/ui/icons";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

const Register = () => {
  const { loginWithGoogle, isLoading : authIsLoading, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({name: {firstName: '', lastName: ''}, phone: '', verificationCode: '', accountType: 'customer', termsAccepted: false});
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const recaptchaContainer = useRef(null);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "phone" && value.length > 10) {
      return;
    }
    setFormData(prev => {
      if (name === "firstName" || name === "lastName") {
        return {...prev, name: {...prev.name, [name]: value}}
      } else {
        return {...prev, [name]: type === "checkbox" ? checked : value}
      }
      
    });
  };
  
  const handleAccountTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      accountType: value
    }));
  };
  
  const validateForm = () => {
    if (!formData.name.firstName || !formData.name.lastName || !formData.phone) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return false;
    }    
    
    if (!/^\d{10}$/.test(formData.phone)) {
      
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive"
      });
      return false;
    }
    
    if (isCodeSent && !formData.verificationCode) {
      toast({
        title: "Missing verification code",
        description: "Please enter the verification code.",
      });
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.termsAccepted) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (!isCodeSent) {
      handleSendCode();
    } else {
      handleVerifyCode();
    }
  };

  const handleSendCode = async () => {
    try {
      if (!recaptchaContainer.current) {
        window.recaptchaVerifier = new RecaptchaVerifier(recaptchaContainer.current, {
          'size': 'invisible',
          'callback': () => {}
        }, auth);
      }
      
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, `+1${formData.phone}`, appVerifier);
      
      setConfirmationResult(confirmationResult);
      setIsCodeSent(true);
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code.",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Error sending code",
        description: error.message || "An error occurred while sending the verification code.",
        variant: "destructive"
      });
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmationResult) return;
    
    try {
      const result = await confirmationResult.confirm(formData.verificationCode);
      const credential = result.user
      
      
      toast({
        title: "Account created",
        description: "Account created successfully.",
        variant: "success"
      });
      if (userRole === "customer"){      
        navigate("/");
      }else if(userRole === "vendor"){
        navigate("/vendor");
      }else if(userRole === "delivery"){
        navigate("/delivery");
      }
    } catch (error) {
      console.error(error)
      
      toast({
        
        title: "Registration failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive"
      });      
    }
  }
  
  const handleGoogleRegister = async () => {
    try {
      await loginWithGoogle(formData.accountType);
      navigate("/");
      toast({
        title: "Welcome!",
        description: "You have registered with Google successfully.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred during Google registration.",
        variant: "destructive"
      });
    } 
  };
  if (isAuthenticated){
    if(userRole === "customer")return <Navigate to="/"/>
    if(userRole === "vendor")return <Navigate to="/vendor"/>
    if(userRole === "delivery")return <Navigate to="/delivery"/>
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Link to="/" className="absolute top-4 left-4 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
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
          <p className="text-muted-foreground">Create a new account</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      className="pl-10"
                      value={formData.name.firstName}
                      onChange={handleChange}
                      disabled={authIsLoading}
                    />
                 </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      className="pl-10"
                      value={formData.name.lastName}
                      onChange={handleChange}
                      disabled={authIsLoading}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2" >
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="pl-10"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={authIsLoading}
                  />
                </div>
              </div>
              
              {isCodeSent ? (
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <InputOTP
                    length={6}
                    id="verificationCode"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={(value) => setFormData(prev => ({ ...prev, verificationCode: value }))}
                  />
                </div>
              ) : null}
                {!isCodeSent ?(
                <div className="w-full">
                    <Button type="button" onClick={handleSendCode} className="w-full" disabled={isCodeSent || authIsLoading}>
                      Send Code
                    </Button>
                  </div>
                ):null}
              <div ref={recaptchaContainer}></div>
              
              <div className="space-y-2">
                <Label>Account Type</Label>
                <RadioGroup
                  name = "accountType"
                  onValueChange={handleAccountTypeChange}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customer" id="customer" />
                    <Label htmlFor="customer" className="cursor-pointer">Customer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vendor" id="vendor" />
                    <Label htmlFor="vendor" className="cursor-pointer">Restaurant Owner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="cursor-pointer">Delivery Partner</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, termsAccepted: checked }))}
                  disabled={authIsLoading}
                />
                <Label htmlFor="termsAccepted" className="text-sm leading-snug">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={authIsLoading}
              >
                {authIsLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </span>
                )}
              </Button>
            </form>
            
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleRegister}
                disabled={authIsLoading}
              >
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
                Sign up with Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center mt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};
export default Register;
