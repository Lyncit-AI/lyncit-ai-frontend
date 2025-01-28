import React from 'react';

const NotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p>Sorry, the page you are looking for does not exist.</p>
      </div>
    </div>
  );
};

export default NotFound;
