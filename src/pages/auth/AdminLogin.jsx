import React, { useState, useEffect } from 'react';
import { Admin } from '@/models';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('AdminLogin component mounted');
    return () => {
      console.log('AdminLogin component unmounted');
    };
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userCredential = await login(email, password);
      if (userCredential) {
        console.log('Firebase login successful for user:', userCredential.user.uid);
        const admin = await Admin.getAdminByFirebaseUid(userCredential.user.uid);
        if (admin) {
          console.log('Admin data retrieved successfully:', admin);
          toast({
            title: 'Logged in',
            description: 'You have been logged in successfully.',
          });
          navigate('/admin/dashboard');
        } else {
          console.error('Admin not found in the database.');
          toast({
            title: 'Error',
            description: 'Admin not found.',
          });
          setError('Admin not found.');
        }
      } else {
        console.error('User credential not found after login.');
        toast({
          title: 'Error',
          description: 'User credential not found.',
        });
        }
     } catch (err) {
        console.error('Admin login error:', err);
        toast({
          title: 'Error',
          description: err.message || 'Login failed',
        });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
    </div>
  );
};


export default AdminLogin;
