import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SummaryApi from '../common';
import uploadImage from '../helpers/uploadImage';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Profile = () => {
  const user = useSelector(state => state?.user?.user);
  const [form, setForm] = useState({
    name: '',
    email: '',
    profilePic: ''
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState({ street: '', city: '', state: '', zipCode: '', country: 'India', label: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const dispatch = useDispatch();

  // Move fetchAddresses to top-level
  const fetchAddresses = async () => {
    const token = localStorage.getItem('authToken');
    if (!token || !user?._id) return;
    const res = await fetch(SummaryApi.getUserAddresses.url, {
      method: SummaryApi.getUserAddresses.method,
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success) setAddresses(data.data);
    else toast.error(data.message || 'Failed to fetch addresses');
  };

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        profilePic: user.profilePic || ''
      });
      setPreview(user.profilePic || '');
    }
  }, [user]);

  // Fetch addresses on mount
  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const upload = await uploadImage(file);
      setForm(prev => ({ ...prev, profilePic: upload.url }));
      setPreview(upload.url);
      setLoading(false);
    }
  };

  const handleAddressFormChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOrEditAddress = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token || !user?._id) return;
    let res;
    if (editingIndex !== null) {
      // Edit
      res = await fetch(SummaryApi.addAddress.url, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, addressIndex: editingIndex, address: addressForm })
      });
    } else {
      // Add
      res = await fetch(SummaryApi.addAddress.url, {
        method: SummaryApi.addAddress.method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, address: addressForm })
      });
    }
    const data = await res.json();
    if (data.success) {
      setShowAddressForm(false);
      setEditingIndex(null);
      setAddressForm({ street: '', city: '', state: '', zipCode: '', country: 'India', label: '' });
      fetchAddresses();
      toast.success('Address saved!');
    } else {
      toast.error(data.message || 'Failed to save address');
    }
  };

  const handleEditAddress = (idx) => {
    setEditingIndex(idx);
    setAddressForm(addresses[idx]);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (idx) => {
    const token = localStorage.getItem('authToken');
    if (!token || !user?._id) return;
    const res = await fetch(SummaryApi.addAddress.url, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user._id, addressIndex: idx })
    });
    const data = await res.json();
    if (data.success) {
      fetchAddresses();
      toast.success('Address deleted!');
    } else {
      toast.error(data.message || 'Failed to delete address');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please login');
      setLoading(false);
      return;
    }
    const response = await fetch(SummaryApi.updateUser.url, {
      method: SummaryApi.updateUser.method,
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user._id,
        name: form.name,
        email: form.email,
        profilePic: form.profilePic
      })
    });
    const data = await response.json();
    setLoading(false);
    if (data.success) {
      toast.success('Profile updated!');
      dispatch(setUserDetails({ ...user, ...form }));
    } else {
      toast.error(data.message || 'Failed to update profile');
    }
  };

  return (
    <div className='container mx-auto max-w-lg p-6 bg-white rounded shadow mt-8'>
      <h2 className='text-2xl font-bold mb-4'>My Profile</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='flex flex-col items-center'>
          <div className='w-24 h-24 rounded-full overflow-hidden border mb-2'>
            <img src={preview || '/default-profile.png'} alt='Profile' className='w-full h-full object-cover' />
          </div>
          <label className='cursor-pointer text-blue-600'>
            {loading ? 'Uploading...' : 'Change Photo'}
            <input type='file' className='hidden' accept='image/*' onChange={handleImageChange} />
          </label>
        </div>
        <div>
          <label className='block font-medium'>Name</label>
          <input type='text' name='name' value={form.name} onChange={handleChange} className='w-full border rounded px-3 py-2' required />
        </div>
        <div>
          <label className='block font-medium'>Email</label>
          <input type='email' name='email' value={form.email} onChange={handleChange} className='w-full border rounded px-3 py-2' required />
        </div>
        <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded w-full' disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
      <hr className='my-6' />
      <h3 className='text-xl font-semibold mb-2'>Address Book</h3>
      <div className='mb-4'>
        {addresses.length === 0 && <div className='text-gray-500'>No addresses yet.</div>}
        {addresses.map((addr, idx) => (
          <div key={idx} className="border rounded p-3 mb-2 flex items-center justify-between">
            <div>
              <div className='font-medium'>{addr.label || 'Address'}</div>
              <div className='text-sm'>{addr.street}, {addr.city}, {addr.state}, {addr.zipCode}, {addr.country}</div>
            </div>
            <div className='flex gap-2'>
              <button onClick={() => handleEditAddress(idx)} className='text-blue-600'><FaEdit /></button>
              <button onClick={() => handleDeleteAddress(idx)} className='text-red-600'><FaTrash /></button>
            </div>
          </div>
        ))}
        <button onClick={() => { setShowAddressForm(true); setEditingIndex(null); setAddressForm({ street: '', city: '', state: '', zipCode: '', country: 'India', label: '' }); }} className='bg-blue-600 text-white px-3 py-1 rounded mt-2'>Add Address</button>
      </div>
      {showAddressForm && (
        <form onSubmit={handleAddOrEditAddress} className='space-y-2 bg-gray-50 p-4 rounded'>
          <div>
            <label className='block font-medium'>Label</label>
            <input type='text' name='label' value={addressForm.label} onChange={handleAddressFormChange} className='w-full border rounded px-3 py-2' placeholder='Home, Work, etc.' />
          </div>
          <div>
            <label className='block font-medium'>Street</label>
            <input type='text' name='street' value={addressForm.street} onChange={handleAddressFormChange} className='w-full border rounded px-3 py-2' required />
          </div>
          <div>
            <label className='block font-medium'>City</label>
            <input type='text' name='city' value={addressForm.city} onChange={handleAddressFormChange} className='w-full border rounded px-3 py-2' required />
          </div>
          <div>
            <label className='block font-medium'>State</label>
            <input type='text' name='state' value={addressForm.state} onChange={handleAddressFormChange} className='w-full border rounded px-3 py-2' required />
          </div>
          <div>
            <label className='block font-medium'>Zip Code</label>
            <input type='text' name='zipCode' value={addressForm.zipCode} onChange={handleAddressFormChange} className='w-full border rounded px-3 py-2' required />
          </div>
          <div>
            <label className='block font-medium'>Country</label>
            <input type='text' name='country' value={addressForm.country} onChange={handleAddressFormChange} className='w-full border rounded px-3 py-2' required />
          </div>
          <div className='flex gap-2'>
            <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded'>{editingIndex !== null ? 'Save Changes' : 'Add Address'}</button>
            <button type='button' onClick={() => { setShowAddressForm(false); setEditingIndex(null); }} className='bg-gray-300 px-4 py-2 rounded'>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile; 