import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';

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
        if (!token) return;
        try {
            const response = await fetch(SummaryApi.getUserAddresses.url, {
                method: SummaryApi.getUserAddresses.method,
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const responseData = await response.json();
            if (responseData.success) {
                setUserAddresses(responseData.data);
            } else {
                toast.error(responseData.message);
            }
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
        if (!token) {
            toast.error("Please login to add an address.");
            return;
        }
        if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zipCode) {
            toast.error("Please fill in all address fields.");
            return;
        }

        try {
            const response = await fetch(SummaryApi.addAddress.url, {
                method: SummaryApi.addAddress.method,
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addressForm)
            });
            const responseData = await response.json();
            if (responseData.success) {
                toast.success("Address added successfully!");
                fetchAddresses(); // Refresh addresses
                setAddressForm({ street: '', city: '', state: '', zipCode: '', country: 'India' }); // Clear form
                setShowAddressForm(false);
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            console.error("Error adding address:", error);
            toast.error("Failed to add address.");
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
  return (
    <div className='container mx-auto'>
        
        <div className='text-center text-lg my-3'>
            {
                data.length === 0 && !loading && (
                    <p className='bg-white py-5'>No Data</p>
                )
            }
        </div>

        <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>   
                {/***view product */}
                <div className='w-full max-w-3xl'>
                    {
                        loading ? (
                            loadingCart?.map((el,index) => {
                                return(
                                    <div key={el+"Add To Cart Loading"+index} className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'>
                                    </div>
                                )
                            })
                             
                        ) : (
                          data.map((product,index)=>{
                           return(
                            <div key={product?._id+"Add To Cart Loading"} className='w-full bg-white h-32 my-2 border border-slate-300  rounded grid grid-cols-[128px,1fr]'>
                                <div className='w-32 h-32 bg-slate-200'>
                                    <img src={product?.productId?.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply' />
                                </div>
                                <div className='px-4 py-2 relative'>
                                    {/**delete product */}
                                    <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-gray-600 hover:text-white cursor-pointer' onClick={()=>deleteCartProduct(product?._id)}>
                                        <MdDelete/>
                                    </div>

                                    <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1'>{product?.productId?.productName}</h2>
                                    <p className='capitalize text-slate-500'>{product?.productId.category}</p>
                                    <div className='flex items-center justify-between'>
                                            <p className='text-red-600 font-medium text-lg'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                            <p className='text-slate-600 font-semibold text-lg'>{displayINRCurrency(product?.productId?.sellingPrice  * product?.quantity)}</p>
                                    </div>
                                    <div className='flex items-center gap-3 mt-1'>
                                        <button className='border border-red-600 text-red-600 hover:bg-gray-600 hover:text-white w-6 h-6 flex justify-center items-center rounded ' onClick={()=>decraseQty(product?._id,product?.quantity)}>-</button>
                                        <span>{product?.quantity}</span>
                                        <button className='border border-red-600 text-red-600 hover:bg-gray-600 hover:text-white w-6 h-6 flex justify-center items-center rounded ' onClick={()=>increaseQty(product?._id,product?.quantity)}>+</button>
                                    </div>
                                </div>    
                            </div>
                           )
                          })
                        )
                    }
                </div>


                {/***summary  */}
                <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                        <div className='h-36 bg-white'>
                            <h2 className='text-white bg-black  px-4 py-1'>Summary</h2>
                            <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                <p>Quantity</p>
                                <p>{totalQty}</p>
                            </div>

                            <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                <p>Total Price</p>
                                <p>{displayINRCurrency(totalPrice)}</p>    
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className='bg-white p-4 mt-4 rounded shadow'>
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
                            {
                                loading ? (
                                    <p>Loading addresses...</p>
                                ) : userAddresses.length === 0 ? (
                                    <p>No addresses saved yet.</p>
                                ) : (
                                    <div className='space-y-2'>
                                        {userAddresses.map((address, index) => (
                                            <div key={index} className='border p-3 rounded-md bg-gray-50'>
                                                <p>{address.street}, {address.city}, {address.state} - {address.zipCode}</p>
                                                <p>{address.country}</p>
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                        </div>

                        <button className='bg-blue-600 p-2 text-white w-full mt-2'>Payment</button>

                </div>
        </div>
    </div>
  )
}

export default Cart