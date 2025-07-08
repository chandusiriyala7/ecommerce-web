import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const Wishlist = () => {
  const user = useSelector(state => state?.user?.user);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?._id) return;
      const token = localStorage.getItem('authToken');
      try {
        const res = await fetch(SummaryApi.getWishlist.url, {
          method: SummaryApi.getWishlist.method,
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setWishlist(data.data);
        else toast.error(data.message || 'Failed to fetch wishlist');
      } catch (err) {
        toast.error('Failed to fetch wishlist');
      }
      setLoading(false);
    };
    fetchWishlist();
  }, [user]);

  const handleRemove = async (productId) => {
    const token = localStorage.getItem('authToken');
    await fetch(SummaryApi.removeFromWishlist.url, {
      method: SummaryApi.removeFromWishlist.method,
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, productId })
    });
    setWishlist(wishlist.filter(p => p._id !== productId));
    toast.info('Removed from wishlist');
  };

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('authToken');
    if (!token || !user?._id) {
      toast.error('Please login to add to cart.');
      return;
    }
    const res = await fetch(SummaryApi.addToCartProduct.url, {
      method: SummaryApi.addToCartProduct.method,
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    });
    const data = await res.json();
    if (data.success) {
      toast.success('Added to cart!');
    } else {
      toast.error(data.message || 'Failed to add to cart');
    }
  };

  return (
    <div className='container mx-auto max-w-6xl p-6 min-h-[70vh]'>
      <h2 className='text-3xl font-bold mb-8 text-center'>My Wishlist</h2>
      {loading ? (
        <div className='flex justify-center items-center h-40'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
      ) : wishlist.length === 0 ? (
        <div className='flex flex-col items-center justify-center h-96'>
          <img src='https://illustrations.popsy.co/gray/empty-cart.svg' alt='Empty Wishlist' className='w-48 mb-6'/>
          <div className='text-gray-500 text-lg mb-2'>Your wishlist is empty.</div>
          <button className='mt-4 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition' onClick={() => navigate('/')}>Browse Products</button>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
          {wishlist.map(product => (
            <div key={product._id} className='bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col p-4 relative group'>
              <button onClick={() => handleRemove(product._id)} className='absolute top-3 right-3 text-red-500 bg-white rounded-full p-2 shadow hover:bg-red-100 transition z-10' title='Remove from wishlist'>
                <FaHeart className='text-xl'/>
              </button>
              <div className='flex-1 flex flex-col items-center justify-center cursor-pointer' onClick={() => navigate(`/product/${product._id}`)}>
                <img src={product.productImage?.[0] || product.image?.[0]} alt={product.name || product.productName} className='w-32 h-32 object-contain mb-3 group-hover:scale-105 transition-transform duration-300' />
                <div className='font-semibold text-lg text-center mb-1'>{product.name || product.productName}</div>
                <div className='text-gray-600 text-sm mb-2'>{product.category}</div>
                <div className='text-accent font-bold text-xl mb-2'>₹{product.sellingPrice || product.price}</div>
              </div>
              <button onClick={() => handleAddToCart(product._id)} className='mt-2 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow transition'>
                <FaShoppingCart /> Add to Cart
              </button>
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

export default Wishlist; 