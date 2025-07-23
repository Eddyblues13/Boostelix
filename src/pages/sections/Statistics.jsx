import React from 'react';
import { Users, Package, Settings } from 'lucide-react';

const StatsDashboard = () => {
  return (
    <div className="px-4 sm:px-6 pb-6 mt-9">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
          {/* Total Users */}
          <div className="flex items-center w-full px-4 sm:px-6 md:px-8 justify-center md:justify-center space-x-6">
            <div className="bg-blue-900 rounded-full p-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900">73166</div>
              <div className="text-gray-600 font-medium">Total Users</div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="flex items-center w-full px-4 sm:px-6 md:px-8 justify-center md:justify-center space-x-6">
            <div className="bg-blue-900 rounded-full p-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900">4562250</div>
              <div className="text-gray-600 font-medium">Total Orders</div>
            </div>
          </div>

          {/* Total Services */}
          <div className="flex items-center col-span-2 md:col-span-1 w-full px-4 sm:px-6 md:px-8 justify-center space-x-6">
            <div className="bg-blue-900 rounded-full p-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-900">3725</div>
              <div className="text-gray-600 font-medium">Total Services</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
