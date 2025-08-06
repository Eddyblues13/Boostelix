import React, { useEffect, useState } from 'react';
import { fetchAdminTickets } from '../../services/adminService'; // update path if needed

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    try {
      const data = await fetchAdminTickets();
      setTickets(data);
    } catch (error) {
      console.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Support Tickets</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-center text-gray-500">No tickets found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">User</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                   <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Message</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Updated At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">#{ticket.id}</td>
                    <td className="px-4 py-3 text-gray-700">{ticket.user?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{ticket.subject}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{ticket.message}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                          ticket.status === 0
                            ? 'bg-yellow-500 text-white'
                            : ticket.status === 1
                            ? 'bg-green-600 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {ticket.status === 0 ? 'Pending' : ticket.status === 1 ? 'Answered' : 'Closed'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(ticket.updated_at || ticket.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTickets;
