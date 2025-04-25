import React from 'react';

import { useNavigate } from 'react-router-dom';
import  { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

function DeleteProfile() {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const api = useApi();

  React.useEffect(() => {
    if (!authUser) {
      navigate('/');
    }
  }, [authUser, navigate]);

  const handleDelete = async () => {
    try {
      const response = await api.del('/users/me');

      if (response) {
        toast.success("User profile deleted successfully");
        navigate('/');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error("Error deleting the profile");
    }
  };

  const handleCancel = () => {
    navigate('/customer/profile');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Delete Profile</h1>
      <p className="mb-4">Are you sure you want to delete your profile? This action cannot be undone.</p>
      <div className="flex space-x-4">
        <button 
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleDelete}
        >
          Confirm Delete
        </button>
        <button 
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteProfile;