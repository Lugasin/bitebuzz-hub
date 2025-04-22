import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Admin } from '@/models/admin';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Link } from 'react-router-dom';

const AdminRegister = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { signUpWithEmail, currentUser } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        const checkCurrentUser = async () => {
          try {
            if (currentUser) {
              navigate('/admin/dashboard');
            }
          } catch (error) {
            console.error('Error checking current user:', error);
          }
        };
        checkCurrentUser();
      }, [currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          console.log('AdminRegister: Starting admin registration process');
          const userCredential = await signUpWithEmail(
            email,
            password,
            name,
            'admin'

          );
          const firebaseUid = userCredential.user.uid;

          console.log(
            `AdminRegister: Firebase user created with UID: ${firebaseUid}`
          );
          const newAdminData = { name, email, firebaseUid };
          await Admin.createAdmin(newAdminData);
          console.log(
            `AdminRegister: Admin profile created for UID: ${firebaseUid}`
          );
          toast.success('Admin created successfully.');
          navigate('/admin/dashboard');
        } catch (error) {
          toast.error(
            `Admin registration failed: ${error.message || 'Unknown error'}`
          );

            console.error("Admin registration error:", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Admin Registration</CardTitle>
                    <CardDescription>Create an admin account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                required
                            />
                        </div>
                        <div>
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
                        <div>
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
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-center">
                        Already have an account?{" "}
                        <Link to="/admin/login" className="underline text-blue-500">
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AdminRegister;