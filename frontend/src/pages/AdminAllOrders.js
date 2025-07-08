import React, { useEffect, useState } from 'react';
import displayINRCurrency from '../helpers/displayCurrency';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const statusOptions = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const AdminAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch(SummaryApi.adminOrders.url, {
          method: SummaryApi.adminOrders.method,
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setOrders(data.data);
        else setError(data.message || 'Failed to fetch orders');
      } catch (err) {
        setError('Failed to fetch orders');
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(SummaryApi.adminOrderStatus.url, {
        method: SummaryApi.adminOrderStatus.method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders => orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        toast.success('Order status updated!');
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className='p-4 max-w-7xl mx-auto min-h-[70vh]'>
      <h2 className='text-3xl font-bold mb-8 text-center'>All Orders (Admin)</h2>
      {loading ? (
        <div className='flex justify-center items-center h-40'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
      ) : error ? (
        <div className='text-red-500 text-center'>{error}</div>
      ) : orders.length === 0 ? (
        <div className='flex flex-col items-center justify-center h-96'>
          <img src='https://illustrations.popsy.co/gray/empty-cart.svg' alt='No Orders' className='w-48 mb-6'/>
          <div className='text-gray-500 text-lg mb-2'>No orders found.</div>
        </div>
      ) : (
        <div className='overflow-x-auto rounded-lg shadow-lg bg-white'>
          <table className='min-w-full text-sm text-left'>
            <thead className='bg-gray-100 sticky top-0 z-10'>
              <tr>
                <th className='px-6 py-4'>Order ID</th>
                <th className='px-6 py-4'>User</th>
                <th className='px-6 py-4'>Address</th>
                <th className='px-6 py-4'>Items</th>
                <th className='px-6 py-4'>Status</th>
                <th className='px-6 py-4'>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className='border-b hover:bg-gray-50 transition'>
                  <td className='px-6 py-4 font-mono text-xs'>{order._id}</td>
                  <td className='px-6 py-4'>
                    <div className='font-semibold'>{order.user?.name || 'N/A'}</div>
                    <div className='text-xs text-gray-500'>{order.user?.email}</div>
                  </td>
                  <td className='px-6 py-4 text-xs'>
                    {order.address?.label && <span className='font-bold'>{order.address.label}: </span>}
                    {order.address?.street}, {order.address?.city}, {order.address?.state}, {order.address?.zipCode}, {order.address?.country}
                  </td>
                  <td className='px-6 py-4'>
                    <ul className='list-disc pl-4'>
                      {order.items.map((item, idx) => (
                        <li key={idx} className='mb-1'>
                          <span className='font-medium'>{item.productId?.productName || item.productId?.name}</span> x {item.quantity} <span className='text-gray-500'>({displayINRCurrency(item.productId?.price || item.productId?.sellingPrice)})</span>
                          {item.customizedImage && <img src={item.customizedImage} alt='Customized' className='w-8 h-8 inline ml-2 border rounded' />}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2'>
                      <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)} className='border rounded px-2 py-1 bg-white'>
                        {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-200 text-gray-600'}`}>{order.status}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAllOrders; 