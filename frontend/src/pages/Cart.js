import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import fetchCustomizedImage from '../helpers/fetchCustomizedImage';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const context = useContext(Context)
    const loadingCart = new Array(4).fill(null)

    const [addressForm, setAddressForm] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India' // Default country
    });
    const [userAddresses, setUserAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const navigate = useNavigate();

    const user = useSelector(state => state?.user?.user);
    const [customizedImages, setCustomizedImages] = useState({});

    const fetchData = async() =>{
        const token = localStorage.getItem('authToken');  

        if (!token) {
            console.error("No auth token found");
            return;
        }
        const response = await fetch(SummaryApi.addToCartProductView.url,{
            method : SummaryApi.addToCartProductView.method,
            credentials : 'include',
            headers: {
                'Authorization': `Bearer ${token}`,   // Send the token in Authorization header
                'Content-Type': 'application/json'    // Specify content type
            },
        })
       

        const responseData = await response.json()

        if(responseData.success){
            setData(responseData.data)
        }


    }

    const fetchAddresses = async () => {
        const token = localStorage.getItem('authToken');
        if (!token || !user?._id) return;
        try {
            const response = await fetch(SummaryApi.getUserAddresses.url, {
                method: SummaryApi.getUserAddresses.method,
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const responseData = await response.json();
            if (responseData.success) setUserAddresses(responseData.data);
            else toast.error(responseData.message || 'Failed to fetch addresses');
        } catch (error) {
            console.error("Error fetching addresses:", error);
            toast.error("Failed to fetch addresses.");
        }
    };

    const handleAddressFormChange = (e) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        if (!token || !user?._id) {
            toast.error('Please login to add an address.');
            return;
        }
        if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zipCode) {
            toast.error('Please fill in all address fields.');
            return;
        }
        const res = await fetch(SummaryApi.addAddress.url, {
            method: SummaryApi.addAddress.method,
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user._id, address: addressForm })
        });
        const data = await res.json();
        if (data.success) {
            toast.success('Address added successfully!');
            fetchAddresses();
            setAddressForm({ street: '', city: '', state: '', zipCode: '', country: 'India' });
            setShowAddressForm(false);
        } else {
            toast.error(data.message || 'Failed to add address');
        }
    };

    const handleLoading = async() =>{
        setLoading(true)
        await fetchData()
        await fetchAddresses(); // Fetch addresses after cart data
        setLoading(false)
    }

    useEffect(()=>{
        handleLoading()
    },[])

    // Fetch customized images for all cart products when data changes
    useEffect(() => {
        if (user?._id && data.length > 0) {
            data.forEach(product => {
                const pid = product?.productId?._id;
                if (pid) {
                    fetchCustomizedImage(user._id, pid).then(img => {
                        setCustomizedImages(prev => ({ ...prev, [pid]: img }));
                    });
                }
            });
        }
    }, [data, user]);

    const increaseQty = async(id,qty) =>{
        const response = await fetch(SummaryApi.updateCartProduct.url,{
            method : SummaryApi.updateCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {   
                    _id : id,
                    quantity : qty + 1
                }
            )
        })

        const responseData = await response.json()


        if(responseData.success){
            fetchData()
        }
    }


    const decraseQty = async(id,qty) =>{
       if(qty >= 2){
            const response = await fetch(SummaryApi.updateCartProduct.url,{
                method : SummaryApi.updateCartProduct.method,
                credentials : 'include',
                headers : {
                    "content-type" : 'application/json'
                },
                body : JSON.stringify(
                    {   
                        _id : id,
                        quantity : qty - 1
                    }
                )
            })

            const responseData = await response.json()


            if(responseData.success){
                fetchData()
            }
        }
    }

    const deleteCartProduct = async(id)=>{
        const response = await fetch(SummaryApi.deleteCartProduct.url,{
            method : SummaryApi.deleteCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {   
                    _id : id,
                }
            )
        })

        const responseData = await response.json()

        if(responseData.success){
            fetchData()
            context.fetchUserAddToCart()
        }
    }

    const totalQty = data.reduce((previousValue,currentValue)=> previousValue + currentValue.quantity,0)
    const totalPrice = data.reduce((preve,curr)=> preve + (curr.quantity * curr?.productId?.sellingPrice) ,0)

    // Place order handler
    const handlePlaceOrder = async () => {
        if (!userAddresses[selectedAddressIdx]) {
            toast.error('Please select a delivery address.');
            return;
        }
        if (data.length === 0) {
            toast.error('Your cart is empty.');
            return;
        }
        const token = localStorage.getItem('authToken');
        const items = data.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            customizedImage: customizedImages[item.productId._id] || undefined
        }));
        const res = await fetch(SummaryApi.placeOrder.url, {
            method: SummaryApi.placeOrder.method,
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: user._id,
                address: userAddresses[selectedAddressIdx],
                items,
                paymentMethod: 'COD'
            })
        });
        const result = await res.json();
        if (result.success) {
            setOrderPlaced(true);
            setOrderId(result.data._id);
            toast.success('Order placed successfully!');
            // Optionally, clear cart here
        } else {
            toast.error(result.message || 'Failed to place order');
        }
    };
  return (
    <div className='container mx-auto max-w-5xl p-6 min-h-[70vh]'>
      <h2 className='text-3xl font-bold mb-8 text-center'>My Cart</h2>
      <div className='flex flex-col lg:flex-row gap-10 lg:justify-between'>
        {/* Cart Products */}
        <div className='w-full max-w-3xl'>
          {loading ? (
            <div className='flex flex-col gap-4'>
              {loadingCart.map((_, idx) => (
                <div key={idx} className='w-full bg-slate-200 h-32 border border-slate-300 animate-pulse rounded'></div>
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-96'>
              <img src='https://illustrations.popsy.co/gray/empty-cart.svg' alt='Empty Cart' className='w-48 mb-6'/>
              <div className='text-gray-500 text-lg mb-2'>Your cart is empty.</div>
              <button className='mt-4 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition' onClick={() => navigate('/')}>Browse Products</button>
            </div>
          ) : (
            data.map((product, index) => (
              <div key={product?._id+"Add To Cart Loading"} className='w-full bg-white h-auto my-4 border border-slate-300 rounded grid grid-cols-[128px,1fr] shadow-lg hover:shadow-2xl transition-shadow'>
                <div className='w-32 h-32 bg-slate-200 flex flex-col items-center justify-center rounded-l'>
                  <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' alt={product?.productId?.productName} />
                  {customizedImages[product?.productId?._id] && (
                    <img src={customizedImages[product?.productId?._id]} alt='Customized' className='w-16 h-16 object-contain border-2 border-blue-500 mt-1 rounded' />
                  )}
                </div>
                <div className='px-4 py-2 relative flex flex-col justify-between'>
                  {/* Delete product */}
                  <div className='absolute right-0 top-0 text-red-600 rounded-full p-2 hover:bg-gray-600 hover:text-white cursor-pointer' onClick={()=>deleteCartProduct(product?._id)}>
                    <MdDelete/>
                  </div>
                  <div>
                    <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1 font-semibold'>{product?.productId?.productName}</h2>
                    <p className='capitalize text-slate-500'>{product?.productId.category}</p>
                  </div>
                  <div className='flex items-center justify-between mt-2'>
                    <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                    <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product?.productId?.sellingPrice  * product?.quantity)}</p>
                  </div>
                  <div className='flex items-center gap-3 mt-2'>
                    <button className='border border-red-600 text-red-600 hover:bg-gray-600 hover:text-white w-7 h-7 flex justify-center items-center rounded ' onClick={()=>decraseQty(product?._id,product?.quantity)}>-</button>
                    <span className='font-semibold'>{product?.quantity}</span>
                    <button className='border border-red-600 text-red-600 hover:bg-gray-600 hover:text-white w-7 h-7 flex justify-center items-center rounded ' onClick={()=>increaseQty(product?._id,product?.quantity)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary & Address */}
        <div className='mt-5 lg:mt-0 w-full max-w-sm'>
          <div className='bg-white rounded-lg shadow-lg p-6 mb-6'>
            <h2 className='text-xl font-semibold mb-4'>Summary</h2>
            <div className='flex items-center justify-between mb-2 text-lg'>
              <span>Items</span>
              <span>{totalQty}</span>
            </div>
            <div className='flex items-center justify-between mb-2 text-lg'>
              <span>Subtotal</span>
              <span>{displayINRCurrency(totalPrice)}</span>
            </div>
            <div className='flex items-center justify-between mb-2 text-lg'>
              <span>Shipping</span>
              <span>{displayINRCurrency(0)}</span>
            </div>
            <div className='flex items-center justify-between font-bold text-xl border-t pt-2 mt-2'>
              <span>Total</span>
              <span>{displayINRCurrency(totalPrice)}</span>
            </div>
          </div>

          {/* Address Section */}
          <div className='bg-white p-6 rounded-lg shadow mb-6'>
            <h2 className='text-xl font-semibold mb-3'>Delivery Address</h2>
            <button onClick={() => setShowAddressForm(prev => !prev)} className='bg-blue-500 text-white px-4 py-2 rounded mb-4'>
              {showAddressForm ? 'Hide Address Form' : 'Add New Address'}
            </button>
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className='space-y-3'>
                <input type='text' name='street' placeholder='Street Address' value={addressForm.street} onChange={handleAddressFormChange} className='w-full px-3 py-2 border rounded' required />
                <input type='text' name='city' placeholder='City' value={addressForm.city} onChange={handleAddressFormChange} className='w-full px-3 py-2 border rounded' required />
                <input type='text' name='state' placeholder='State' value={addressForm.state} onChange={handleAddressFormChange} className='w-full px-3 py-2 border rounded' required />
                <input type='text' name='zipCode' placeholder='Zip Code' value={addressForm.zipCode} onChange={handleAddressFormChange} className='w-full px-3 py-2 border rounded' required />
                <input type='text' name='country' placeholder='Country' value={addressForm.country} onChange={handleAddressFormChange} className='w-full px-3 py-2 border rounded' required />
                <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded w-full'>Save Address</button>
              </form>
            )}
            <h3 className='text-lg font-semibold mt-4 mb-2'>Your Saved Addresses</h3>
            {loading ? (
              <p>Loading addresses...</p>
            ) : userAddresses.length === 0 ? (
              <p>No addresses saved yet.</p>
            ) : (
              <div className='space-y-2'>
                {userAddresses.map((address, index) => (
                  <div key={index} className={`border p-3 rounded-md bg-gray-50 flex items-center justify-between ${selectedAddressIdx === index ? 'border-blue-500' : ''}`}>
                    <div onClick={() => setSelectedAddressIdx(index)} className='cursor-pointer flex-1'>
                      <p>{address.street}, {address.city}, {address.state} - {address.zipCode}</p>
                      <p>{address.country}</p>
                    </div>
                    {selectedAddressIdx === index && <span className='ml-2 text-blue-600 font-bold'>Selected</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Place Order Button and Confirmation */}
          {!orderPlaced ? (
            <button className='bg-blue-600 p-2 text-white w-full mt-2 rounded-lg shadow hover:bg-blue-700 transition' onClick={handlePlaceOrder}>Place Order (COD)</button>
          ) : (
            <div className='bg-green-100 text-green-800 p-4 mt-4 rounded text-center'>
              <p>Order placed successfully!</p>
              <button className='underline text-blue-600 mt-2' onClick={() => navigate('/my-orders')}>Track My Orders</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart