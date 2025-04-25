import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const EditProfile = () => {
  const { user } = useAuth();
  const { get, put } = useApi();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        navigate('/');
        return;
      }
      try {
        const response = await get(`/users/${user.uid}`);
        setUserData(response);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, get, navigate]);

  useEffect(()=>{
    setFormData(userData);
  }, [user, get, navigate]);

  if (loading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-8 text-red-500">Error: {error}</div>;
  }

  if (!userData) {
    return <div className="container mx-auto p-8">No data available</div>;
  }

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await put(`/users/${user.uid}`, formData);
        if (response) {
          setSuccess("Profile updated successfully!");
          setError(null);
          setTimeout(() => {
              navigate('/customer/profile');
          }, 2000);
        }
    } catch (error) {
      setError(error.message || "Failed to update profile.");
      setSuccess(null);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2">Name</label>
          <input type="text" id="name" className="w-full border border-gray-300 px-4 py-2 rounded" value={formData.name || ''} onChange={handleInputChange}/>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email</label>
          <input type="email" id="email" className="w-full border border-gray-300 px-4 py-2 rounded" value={formData.email || ''} onChange={handleInputChange}/>
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block mb-2">Location</label>
          <input type="text" id="location" className="w-full border border-gray-300 px-4 py-2 rounded" value={formData.location || ''} onChange={handleInputChange}/>
        </div>
        <div className="mb-4">
          <label htmlFor="phoneNumber" className="block mb-2">Phone Number</label>
          <input type="text" id="phoneNumber" className="w-full border border-gray-300 px-4 py-2 rounded" defaultValue={userData.phoneNumber || ''} />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block mb-2">Address</label>
          <textarea id="address" className="w-full border border-gray-300 px-4 py-2 rounded" rows="4" defaultValue={userData.address || ''}></textarea>
        </div>
        <div className="flex justify-end">
          <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;