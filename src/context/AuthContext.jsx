
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signOut, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

/**
 * User roles in the application
 * @typedef {"customer" | "vendor" | "delivery" | "admin" | "superadmin" | "guest"} UserRole
 */

/**
 * Authentication context types
 * @typedef {Object} AuthContextType
 * @property {User|null} currentUser - The currently authenticated Firebase user
 * @property {UserRole} userRole - The role of the current user
 * @property {boolean} isLoading - Whether authentication state is being loaded
 * @property {Function} signInWithGoogle - Sign in with Google function
 * @property {Function} signInWithFacebook - Sign in with Facebook function
 * @property {Function} signInWithEmail - Sign in with email and password function
 * @property {Function} signUpWithEmail - Sign up with email and password function
 * @property {Function} resetPassword - Reset password function
 * @property {Function} logout - Logout function
 * @property {boolean} isAuthenticated - Whether a user is authenticated
 */

const AuthContext = createContext(null);

/**
 * Custom hook to use the auth context
 * @returns {AuthContextType} The auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Auth provider component to wrap the app
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState("guest");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // After authenticating, get user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            setUserRole("customer"); // Default role
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole("customer");
        }
      } else {
        setUserRole("guest");
      }
      
      // Authentication state loaded
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const createUserProfile = async (user, name, role) => {
    const userRef = doc(db, "users", user.uid);
    
    // Update display name if provided
    if (name) {
      await updateProfile(user, {
        displayName: name,
      });
    }
    
    // Check if user document already exists
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

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserProfile(result.user, result.user.displayName || "", "customer");
      toast.success("Signed in with Google successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to sign in with Google");
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      await createUserProfile(result.user, result.user.displayName || "", "customer");
      toast.success("Signed in with Facebook successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to sign in with Facebook");
      throw error;
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
    } catch (error) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  };

  const signUpWithEmail = async (email, password, name, role = "customer") => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(result.user, name, role);
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent. Check your inbox.");
    } catch (error) {
      toast.error(error.message || "Failed to send password reset email");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  };

  const value = {
    currentUser,
    userRole,
    isLoading,
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    logout,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
