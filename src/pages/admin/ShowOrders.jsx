import React, { useEffect, useState, useCallback } from 'react';
import { fetchAllOrders } from '../../services/adminService';
import toast from 'react-hot-toast';
import { VariableSizeList as List } from 'react-window';
import dayjs from 'dayjs';

const ShowOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetchAllOrders();
        console.log("Here is the response", res.data.success);
        if (res.data.success) {
          setOrders(res.data.data);
        } else {
          toast.error(res.data.message || 'Failed to load orders.');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error loading orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const TableHeader = () => (
    <div className="grid grid-cols-[0.7fr_0.8fr_2.2fr_0.8fr_0.7fr] gap-x-4 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-700 px-4 py-2 rounded-t-lg">
      <div>Order #</div>
      <div>User</div>
      <div>Order Details</div>
      <div>Created</div>
      <div>Status</div>
    </div>
  );

  const Row = ({ index, style }) => {
    const order = orders[index];
    return (
      <div
        style={{
          ...style,
          top: `${parseFloat(style.top) + 8}px` // space between rows
        }}
        className="grid grid-cols-[0.7fr_0.8fr_2.2fr_0.8fr_0.7fr] gap-x-4 px-4 py-3 items-start text-sm bg-white rounded-lg shadow-sm"
      >
        <div>{order.id}</div>
        <div className="truncate">{order.user?.first_name || 'N/A'}</div>

        {/* Order Details */}
        <div className="whitespace-normal break-words pr-4">
          {order.service?.service_title || '-'}
          <br />
          Link: {order?.link}
          <br />
          Quantity: {order?.quantity}
        </div>

        <div>{dayjs(order.created_at).format('MMM D, YYYY')}</div>
        <div>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              order.status === 'Completed'
                ? 'bg-green-100 text-green-700'
                : order.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>
    );
  };

  // Dynamically set row height based on content
  const getItemSize = useCallback(
    (index) => {
      const order = orders[index];
      const details = `${order.service?.service_title || ''} Link: ${order?.link || ''} Quantity: ${order?.quantity || ''}`;
      const lineCount = Math.ceil(details.length / 50); // rough chars per line
      return Math.max(70, lineCount * 20 + 40); // ensure enough height
    },
    [orders]
  );

  return (
    <div className="p-4 lg:p-6">
      <h2 className="text-xl font-bold mb-5 text-gray-800">All Orders</h2>

      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-600">No orders found.</div>
      ) : (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {/* Horizontal scroll only on mobile */}
          <div className="max-h-[600px] sm:overflow-x-visible overflow-x-auto">
            <div className="min-w-[700px]">
              <TableHeader />
              <List
                height={500}
                itemCount={orders.length}
                itemSize={getItemSize} // dynamic height
                width="100%"
              >
                {Row}
              </List>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowOrders;
