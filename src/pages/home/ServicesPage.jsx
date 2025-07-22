import React from 'react';

const ServicesPage = () => {
  const services = [
    {
      id: 5861,
      title: 'Instagram Followers - Old Accounts With Posts | 0/1Min',
      rate: 'NGN 3677.22',
      min: 50,
      max: '1 000 000',
      time: '4 hours 2 minutes',
      description: '✅ All Flag Working',
    },
    {
      id: 5843,
      title: 'Instagram Followers - Old Accounts With Posts | 0/1Min',
      rate: 'NGN 3635.14',
      min: 10,
      max: '500 000',
      time: '3 hours 1 minute',
      description: '❌ Disable The Flag For Review',
    },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-900">Our Services</h1>
        <p className="text-blue-700 mt-2 max-w-xl mx-auto">
          A list of most of the services we render
        </p>
      </div>

      {/* Filter/Search Row */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full shadow">
          Filter
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full shadow">
          NGN ₦
        </button>
        <input
          type="text"
          placeholder="Search"
          className="px-5 py-2 rounded-full border border-blue-300 focus:outline-none w-64 text-blue-900"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full shadow">
          Search
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Rate Per 1000</th>
              <th className="px-4 py-3">Min Order</th>
              <th className="px-4 py-3">Max Order</th>
              <th className="px-4 py-3">Average Time</th>
              <th className="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody className="text-blue-900">
            {/* Highlight row */}
            <tr className="bg-blue-100 font-semibold">
              <td className="px-4 py-3 text-blue-700">📸 NEW</td>
              <td className="px-4 py-3" colSpan="6">
                ⚡ Instagram Followers - 28/04/2025 - [ No Flag Problem - Working ]
              </td>
            </tr>

            {services.map((service) => (
              <tr key={service.id} className="border-t hover:bg-blue-50 transition">
                <td className="px-4 py-3">{service.id}</td>
                <td className="px-4 py-3">{service.title}</td>
                <td className="px-4 py-3">{service.rate}</td>
                <td className="px-4 py-3">{service.min}</td>
                <td className="px-4 py-3">{service.max}</td>
                <td className="px-4 py-3">{service.time}</td>
                <td className="px-4 py-3">
                  <button className="bg-blue-100 text-blue-900 font-medium px-4 py-1 rounded-full">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ServicesPage;
