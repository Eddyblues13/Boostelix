import React from 'react';
import { AlertTriangle, MessageSquareWarning, Search } from 'lucide-react';


const Support = () => {
  return (
    <div className="p-6 space-y-10 bg-gray-50 min-h-screen">
      {/* ✅ Ticket Instructions */}
      <div className="p-6 bg-white rounded-lg shadow space-y-4">
        <div className="flex items-center space-x-3 text-blue-700">
          <AlertTriangle className="w-6 h-6" />
          <h2 className="text-xl font-bold">‼️ IMPORTANT, READ ‼️</h2>
        </div>

        <div className="space-y-3 text-sm text-gray-800">
          <p className="font-semibold text-blue-700">Please Use The Following SUBJECTS:</p>

          <div>
            <h6 className="text-red-600 font-bold">🔴 ORDER REQUEST + ORDER IDs</h6>
            <p>
              For issues with an order, go to your order history, copy and paste the order IDs as well as your request in the message tab e.g{' '}
              <strong>134450 - speed up</strong>, <strong>134455 - refill</strong>, <strong>134458 - cancel</strong>.
            </p>
          </div>

          <div>
            <h6 className="text-gray-700 font-bold">⚪️ PAYMENT (GATEWAY NAME)</h6>
            <p>
              For payment issues, state the payment gateway used (e.g. <strong>Flutterwave</strong>), the amount sent, and your email.
              On weekends, message admin via{' '}
              <a
                href="https://t.me/apollosome"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline font-semibold"
              >
                TELEGRAM
              </a>
              .
            </p>
          </div>

          <div>
            <h6 className="text-blue-600 font-bold">🔵 OTHER</h6>
            <p>
              For general questions or complaints, use <strong>OTHER</strong> as the subject and type your message.
            </p>
          </div>

          <div className="border-t pt-3">
            <h6 className="text-blue-700 font-bold">NOTE</h6>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>
                We respond within <span className="text-green-600 font-semibold">5 Minutes</span> to{' '}
                <span className="text-yellow-600 font-semibold">6 Hours</span> depending on ticket load.
              </li>
              <li>
                Support is available Monday to Friday from <span className="text-indigo-600 font-semibold">9AM to 5PM</span>.
              </li>
              <li>Do not create multiple tickets for the same order ID.</li>
              <li>Open a new ticket for unrelated issues.</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <MessageSquareWarning className="w-6 h-6 text-red-600 mt-1" />
            <p className="text-red-800 text-sm font-semibold">
              Notice to all users! Any misbehavior with support may lead to account limitation or suspension.
            </p>
          </div>
        </div>
      </div>
<div className="bg-white p-6 rounded-lg shadow mb-8">
  <h2 className="text-xl font-bold mb-4 text-blue-700">Submit a Support Ticket</h2>
  
  <form className="space-y-6" method="post" action="" id="ticketsend">
    {/* Optional alert (can be conditionally rendered) */}
    <div className="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> Something went wrong. Please check your inputs.</span>
    </div>

    <div>
      <label htmlFor="subject" className="block font-medium mb-1">Subject</label>
      <input
        type="text"
        id="subject"
        name="TicketForm[subject]"
        className="w-full border border-gray-300 rounded-md px-4 py-2"
        placeholder="Enter subject"
      />
    </div>

    <div>
      <label htmlFor="message" className="block font-medium mb-1">Message</label>
      <textarea
        id="message"
        name="TicketForm[message]"
        rows="6"
        className="w-full border border-gray-300 rounded-md px-4 py-2"
        placeholder="Type your message here..."
      />
    </div>

    {/* File uploader placeholder */}
    <div>
      <label className="block font-medium mb-1">Attach Files (optional)</label>
      <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      <p className="text-xs text-gray-400 mt-1">Max file size: 5 MB. Supported formats only.</p>
    </div>

    <div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
      >
        Submit Ticket
      </button>
    </div>
  </form>
</div>



      {/* ✅ Search Bar */}
      <div className="bg-white p-6 rounded-lg shadow">
        <form action="/" method="get" className="flex items-center w-full">
          <input
            type="text"
            name="search"
            placeholder="Search"
            className="w-full border border-gray-300 rounded-l-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-3 rounded-r-md hover:bg-blue-700 transition"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* ✅ Ticket History Table */}
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <h3 className="text-lg font-bold mb-4">Your Support Tickets</h3>
        <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 whitespace-nowrap">Last Update</th>
            </tr>
          </thead>
          <tbody>
            {/* Replace this with dynamic data later */}
            <tr>
              <td className="py-4 px-4 text-center text-gray-400" colSpan={4}>
                No tickets found.
              </td>
            </tr>
          </tbody>
        </table>

        {/* ✅ Pagination Placeholder */}
        <div className="mt-6 flex justify-end">
          {/* Pagination logic or buttons will go here */}
        </div>
      </div>
    </div>
  );
};

export default Support;
