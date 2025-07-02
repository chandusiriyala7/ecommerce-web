import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SummaryApi from '../common';
import uploadImage from '../helpers/uploadImage';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';

const Profile = () => {
  const user = useSelector(state => state?.user?.user);
  const [form, setForm] = useState({
    name: '',
    email: '',
    profilePic: ''
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');
  const dispatch = useDispatch();

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
    </div>
  );
};

export default Profile; 