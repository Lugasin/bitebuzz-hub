
import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User, 
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
import { useToast } from "@/components/ui/use-toast";

type UserRole = "customer" | "vendor" | "delivery" | "admin" | "superadmin" | "guest";

interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>("guest");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role as UserRole);
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
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const createUserProfile = async (user: User, name: string, role: UserRole) => {
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
      toast({
        title: "Success",
        description: "Signed in with Google successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in with Google",
      });
      throw error;
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      await createUserProfile(result.user, result.user.displayName || "", "customer");
      toast({
        title: "Success",
        description: "Signed in with Facebook successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in with Facebook",
      });
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign in",
      });
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(result.user, name, role);
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create account",
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password reset email sent",
        description: "Check your email for password reset instructions.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send password reset email",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to sign out",
      });
      throw error;
    }
  };

  const value: AuthContextType = {
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
