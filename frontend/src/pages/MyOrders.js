import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import displayINRCurrency from '../helpers/displayCurrency';
import SummaryApi from '../common';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Shipped: 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const statusSteps = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

const MyOrders = () => {
  const user = useSelector(state => state?.user?.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        const res = await fetch(`${SummaryApi.getUserOrders?.url || '/api/user-orders'}?userId=${user._id}`, {
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
  }, [user]);

  // Helper for status timeline
  const renderStatusTimeline = (status) => {
    const currentStep = statusSteps.indexOf(status);
    return (
      <div className='flex items-center gap-2 my-2'>
        {statusSteps.map((step, idx) => (
          <React.Fragment key={step}>
            <div className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs ${idx <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>{idx+1}</div>
            {idx < statusSteps.length-1 && <div className={`h-1 w-8 ${idx < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
          </React.Fragment>
        ))}
        <span className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-200 text-gray-600'}`}>{status}</span>
      </div>
    );
  };

  return (
    <div className='container mx-auto max-w-5xl p-6 min-h-[70vh]'>
      <h2 className='text-3xl font-bold mb-8 text-center'>My Orders</h2>
      {loading ? (
        <div className='flex justify-center items-center h-40'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
      ) : error ? (
        <div className='text-red-500 text-center'>{error}</div>
      ) : orders.length === 0 ? (
        <div className='flex flex-col items-center justify-center h-96'>
          <img src='https://illustrations.popsy.co/gray/empty-cart.svg' alt='No Orders' className='w-48 mb-6'/>
          <div className='text-gray-500 text-lg mb-2'>You have no orders yet.</div>
          <button className='mt-4 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition' onClick={() => navigate('/')}>Shop Now</button>
        </div>
      ) : (
        <div className='space-y-8'>
          {orders.map(order => (
            <div key={order._id} className='bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2'>
                <div className='font-mono text-xs text-gray-500'>Order ID: {order._id}</div>
                <div className='text-sm text-gray-600'>Placed: {new Date(order.createdAt).toLocaleString()}</div>
                <div>{renderStatusTimeline(order.status)}</div>
              </div>
              <div className='mb-2'>
                <span className='font-semibold'>Delivery Address:</span>
                <div className='ml-2 text-sm'>{order.address?.label && <span className='font-bold'>{order.address.label}: </span>}{order.address?.street}, {order.address?.city}, {order.address?.state}, {order.address?.zipCode}, {order.address?.country}</div>
              </div>
              <div>
                <span className='font-semibold'>Items:</span>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                  {order.items.map((item, idx) => (
                    <div key={idx} className='flex items-center gap-4 border p-2 rounded bg-gray-50'>
                      <img src={item.productId?.image?.[0] || item.productId?.productImage?.[0]} alt='' className='w-16 h-16 object-contain border rounded' />
                      <div>
                        <div className='font-medium'>{item.productId?.name || item.productId?.productName}</div>
                        <div className='text-sm text-gray-600'>Qty: {item.quantity}</div>
                        <div className='text-sm text-gray-600'>Price: {displayINRCurrency(item.productId?.price || item.productId?.sellingPrice)}</div>
                        {item.customizedImage && <img src={item.customizedImage} alt='Customized' className='w-10 h-10 mt-1 border rounded' />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className='flex justify-end mt-2'>
                <span className='font-semibold text-lg'>Total: {displayINRCurrency(order.items.reduce((sum, item) => sum + (item.productId?.sellingPrice || item.productId?.price) * item.quantity, 0))}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className='flex justify-center mt-10'>
        <button className='underline text-blue-600' onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  );
};

export default MyOrders; 