import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import { ToastContainer , toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import scrollTop from '../helpers/scrollTop';
import { fetchProductsByCategory } from '../services/productService';

const VerticalCardProduct = ({category, heading}) => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(true)
    const loadingList = new Array(13).fill(null)
    const user = useSelector(state => state?.user?.user)

    const [scroll,setScroll] = useState(0)
    const scrollElement = useRef()

    const { fetchUserAddToCart } = useContext(Context)

    const handleAddToCart = async(e,id)=>{
       if(user == null){
            toast.error("Please Login To add Cart")
        }else{
        await addToCart(e,id)
        fetchUserAddToCart()
        }
    }

    const fetchData = async() =>{
        setLoading(true)
        try {
            const categoryProduct = await fetchProductsByCategory(category)
            setData(categoryProduct)
        } catch (error) {
            console.error(`Error fetching products for ${category}:`, error)
        }
        setLoading(false)
    }

    useEffect(()=>{
        fetchData()
    },[category])

    const scrollRight = () =>{
        scrollElement.current.scrollLeft += 300
    }
    const scrollLeft = () =>{
        scrollElement.current.scrollLeft -= 300
    }


  return (
    <div className='container mx-auto px-4 my-6 relative'>

            <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

                
           <div className='flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none transition-all' ref={scrollElement}>

            <button  className='bg-white shadow-md rounded-full p-1 absolute left-0 text-lg hidden md:block' onClick={scrollLeft}><FaAngleLeft/></button>
            <button  className='bg-white shadow-md rounded-full p-1 absolute right-0 text-lg hidden md:block' onClick={scrollRight}><FaAngleRight/></button> 

           {

                loading ? (
                    loadingList.map((product,index)=>{
                        return(
                            <div className='w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-cardBg rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105'>
                                <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse'>
                                </div>
                                <div className='p-4 grid gap-3'>
                                    <h2 className='font-bold text-base md:text-lg text-primary text-ellipsis line-clamp-1 p-1 py-2 animate-pulse rounded-full bg-slate-200'></h2>
                                    <p className='capitalize text-secondary p-1 animate-pulse rounded-full bg-slate-200  py-2'></p>
                                    <div className='flex gap-3'>
                                        <p className='text-accent font-semibold p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2'>
                                        </p>
                                        <p className='text-secondary line-through p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2'></p>
                                    </div>
                                    <button className='text-sm  text-white px-3  rounded-full bg-slate-200  py-2 animate-pulse bg-accent w-full'>
                                    </button>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    data.map((product,index)=>{
                        return(
                            <Link to={"product/"+product?._id} className='w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-cardBg rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105' onClick={scrollTop}>
                                <div className='bg-cardBorder h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center'>
                                    <img src={product.productImage[0]} className='object-scale-down h-full mix-blend-multiply transition-transform duration-300 hover:scale-110'/>
                                </div>
                                <div className='p-4 grid gap-3'>
                                    <h2 className='font-bold text-base md:text-lg text-primary text-ellipsis line-clamp-1'>{product?.productName}</h2>
                                    <p className='capitalize text-secondary text-sm'>{product?.category}</p>
                                    <div className='flex items-baseline gap-3'>
                                        <p className='text-accent font-semibold text-lg'>{ displayINRCurrency(product?.sellingPrice) }</p>
                                        <p className='text-secondary line-through text-sm'>{ displayINRCurrency(product?.price)  }</p>
                                    </div>
                                    <button className='text-sm bg-primary  hover:bg-accent text-white px-4 py-1 rounded-full transition-colors duration-300' onClick={(e)=>handleAddToCart(e,product?._id)}>Add to Cart</button>
                                </div>
                            </Link>
                        )
                    })
                )
                
            }
           </div>
            

    </div>
  )
}

export default VerticalCardProduct