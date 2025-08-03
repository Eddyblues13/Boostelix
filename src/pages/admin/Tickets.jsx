import React from 'react';

const AdminTickets = () => {
  // Mock ticket data – replace this with real API data
  const tickets = [
    {
      id: 1,
      category_id: 'Billing',
      subject: 'Refund not received',
      order_ids: [12345, 12346],
      request_type: 'Refund',
      message: 'I requested a refund two days ago and still haven’t received it.',
      status: 'Pending',
      last_reply: '2 hours ago',
    },
    {
      id: 2,
      category_id: 'Technical',
      subject: 'App crashes on login',
      order_ids: [],
      request_type: 'Bug Report',
      message: 'The app crashes every time I try to log in using my credentials.',
      status: 'Open',
      last_reply: '5 minutes ago',
    },
    {
      id: 3,
      category_id: 'General',
      subject: 'Inquiry about pricing',
      order_ids: [],
      request_type: 'Question',
      message: 'Can you explain the pricing tiers for enterprise customers?',
      status: 'Resolved',
      last_reply: 'Yesterday',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Support Tickets</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Subject</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Order IDs</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Request Type</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Message</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Last Reply</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700">{ticket.category_id}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{ticket.subject}</td>
                  <td className="px-4 py-3 text-gray-700">{ticket.order_ids.length > 0 ? ticket.order_ids.join(', ') : '-'}</td>
                  <td className="px-4 py-3 text-gray-700">{ticket.request_type}</td>
                  <td className="px-4 py-3 text-gray-700">{ticket.message}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                        ticket.status === 'Pending'
                          ? 'bg-yellow-500 text-white'
                          : ticket.status === 'Resolved'
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{ticket.last_reply}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTickets;
