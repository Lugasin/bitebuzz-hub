import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signOut,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

// Create the AuthContext
const AuthContext = createContext(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState("guest");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            // Assume role is stored as "role" in the user document
            setUserRole(userDoc.data().role);
          } else {
            setUserRole("customer"); // Default role if no document exists
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole("customer");
        }
      } else {
        setUserRole("guest");
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Helper function to create a new user profile in Firestore.
  const createUserProfile = async (user, name, role) => {
    const userRef = doc(db, "users", user.uid);
    // Update the Firebase Auth displayName if a name is provided.
    if (name) {
      await updateProfile(user, { displayName: name });
    }

    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: name || user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        role: role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  };

  // Email/Password login function.
  const signInWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in",
      });
      throw error;
    }
  };

  // Email/Password sign-up function.
  const signUpWithEmail = async (email, password, name, role = "customer") => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(result.user, name, role);
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create account",
      });
      throw error;
    }
  };

  // Google login using popup.
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserProfile(result.user, result.user.displayName || "", "customer");
      toast({
        title: "Success",
        description: "Signed in with Google successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in with Google",
      });
      throw error;
    }
  };

  // Facebook login using popup.
  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      await createUserProfile(result.user, result.user.displayName || "", "customer");
      toast({
        title: "Success",
        description: "Signed in with Facebook successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in with Facebook",
      });
      throw error;
    }
  };

  // Guest login: Create a temporary guest user object.
  const guestLogin = async (guestData) => {
    try {
      const guestUser = {
        uid: "guest-" + Math.random().toString(36).substring(2, 9),
        displayName: guestData.displayName || "Guest User",
        email: guestData.email || null,
        phoneNumber: guestData.phoneNumber || null,
        photoURL: null,
        isAnonymous: true,
      };

      setCurrentUser(guestUser);
      setUserRole("guest");
      toast({
        title: "Guest access granted",
        description: "You can now place orders as a guest.",
      });
      return guestUser;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to continue as guest",
      });
      throw error;
    }
  };

  // Set up ReCAPTCHA for phone number login.
  const setupRecaptcha = (phoneNumber) => {
    // Note: Ensure there's a div with id "recaptcha-container" rendered in your component.
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "normal",
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      }
    );

    return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  };

  // Verify OTP for phone authentication.
  const verifyOTP = async (confirmationResult, otp) => {
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      await createUserProfile(user, "Guest User", "guest");
      toast({
        title: "Phone verified",
        description: "You can now place your order as a guest.",
      });
      return user;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to verify OTP",
      });
      throw error;
    }
  };

  // Reset password via email.
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password reset email sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send password reset email",
      });
      throw error;
    }
  };

  // Logout function.
  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign out",
      });
      throw error;
    }
  };

  // Prepare the context value
  const value = {
    currentUser,
    userRole,
    isLoading,
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    guestLogin,
    setupRecaptcha,
    verifyOTP,
    resetPassword,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
