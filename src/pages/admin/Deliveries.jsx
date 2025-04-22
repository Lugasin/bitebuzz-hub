import React from 'react';

const AdminDeliveries = () => {
  // Dummy data for demonstration
  const deliveries = [
    { id: 1, name: 'Delivery Driver 1', email: 'driver1@example.com', location: 'Location A' },
    { id: 2, name: 'Delivery Driver 2', email: 'driver2@example.com', location: 'Location B' },
    { id: 3, name: 'Delivery Driver 3', email: 'driver3@example.com', location: 'Location C' },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Admin - Deliveries</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Location</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{delivery.name}</td>
              <td className="border border-gray-300 px-4 py-2">{delivery.email}</td>
              <td className="border border-gray-300 px-4 py-2">{delivery.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDeliveries;