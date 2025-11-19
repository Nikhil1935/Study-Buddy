import React from 'react';

export const Spinner: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-iitm-red"></div>
    {message && <p className="text-gray-600 animate-pulse font-medium">{message}</p>}
  </div>
);