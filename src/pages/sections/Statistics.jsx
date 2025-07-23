import React from 'react';

const StatsDashboard = () => {
  const renderUserIcon = () => (
    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" viewBox="0 0 64 64" fill="currentColor">
      <circle cx="32" cy="20" r="12" />
      <path d="M12 52c0-11.046 8.954-20 20-20s20 8.954 20 20" />
    </svg>
  );

  const renderPackageIcon = () => (
    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" viewBox="0 0 64 64" fill="currentColor">
      <path d="M8 16l24-8 24 8v32l-24 8-24-8V16z" />
      <path d="M8 16l24 16 24-16M32 32v16" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M20 12l24 8-12 6-24-8z" opacity="0.7" />
    </svg>
  );

  const renderSettingsIcon = () => (
    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" viewBox="0 0 64 64" fill="currentColor">
      <circle cx="32" cy="32" r="8" />
      <path d="M32 4l4 8h8l-4 8 4 8h-8l-4 8-4-8h-8l4-8-4-8h8l4-8z" opacity="0.8" />
      <circle cx="32" cy="32" r="4" fill="white" />
    </svg>
  );

  const stats = [
    {
      icon: renderUserIcon(),
      value: '73166',
      label: 'Total Users',
    },
    {
      icon: renderPackageIcon(),
      value: '4562250',
      label: 'Total Orders',
    },
    {
      icon: renderSettingsIcon(),
      value: '3725',
      label: 'Total Services',
    },
  ];

  return (
    <div className="px-4 sm:px-6 pb-8 mt-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center p-4 bg-white rounded-xl shadow-sm w-full space-x-4"
            >
              <div className="bg-blue-900 rounded-full p-3 sm:p-4">
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-900">{stat.value}</div>
                <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
