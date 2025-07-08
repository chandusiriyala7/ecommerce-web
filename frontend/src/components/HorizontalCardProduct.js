import React, { useContext, useEffect, useRef, useState  } from 'react'
import { Link } from 'react-router-dom'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import displayINRCurrency from '../helpers/displayCurrency'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import { ToastContainer , toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import scrollTop from '../helpers/scrollTop';
import { fetchProductsByCategory } from '../services/productService';


const HorizontalCardProduct = ({category, heading}) => {
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
    <div className='w-[90vw] mx-auto px-4 my-6 relative'>

            <h2 className='text-2xl font-semibold py-4'>{heading}</h2>

                
           <div className='flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none transition-all relative' ref={scrollElement}>
            <button className='bg-white shadow-md rounded-full p-1 absolute top-2 left-2 text-lg z-10 hidden md:block' onClick={scrollLeft}><FaAngleLeft/></button>
            <button className='bg-white shadow-md rounded-full p-1 absolute top-2 right-2 text-lg z-10 hidden md:block' onClick={scrollRight}><FaAngleRight/></button>

           {   loading ? (
                loadingList.map((product,index)=>{
                    return(
                        <div className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-cardBg rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105'>
                            <div className='bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] animate-pulse flex items-center justify-center'>

                            </div>
                            <div className='p-4 grid w-full gap-2'>
                                <h2 className='font-bold text-base md:text-lg text-primary text-ellipsis line-clamp-1 bg-slate-200 animate-pulse p-1 rounded-full'></h2>
                                <p className='capitalize text-secondary p-1 bg-slate-200 animate-pulse rounded-full'></p>
                                <div className='flex gap-3 w-full'>
                                    <p className='text-accent font-semibold text-lg p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
                                    <p className='text-secondary line-through p-1 bg-slate-200 w-full animate-pulse rounded-full'></p>
                                </div>
                                <button className='text-sm text-white px-3 py-0.5 rounded-full w-full bg-accent animate-pulse'></button>
                            </div>
                        </div>
                    )
                })
           ) : (
            data.map((product,index)=>{
                return(
                    <Link to={"product/"+product?._id} className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-cardBg rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105'>
                        <div className='bg-cardBorder h-full p-4 min-w-[120px] md:min-w-[145px] flex items-center justify-center'>
                            <img src={product.productImage[0]} className='object-scale-down h-full mix-blend-multiply transition-transform duration-300 hover:scale-110'/>
                        </div>
                        <div className='p-4 grid'>
                            <h2 className='font-bold text-base md:text-lg text-primary text-ellipsis line-clamp-1'>{product?.productName}</h2>
                            <p className='capitalize text-secondary text-sm'>{product?.category}</p>
                            <div className='flex items-baseline gap-3 mt-1'>
                                <p className='text-accent font-semibold text-lg'>{ displayINRCurrency(product?.sellingPrice) }</p>
                                <p className='text-secondary line-through text-sm'>{ displayINRCurrency(product?.price)  }</p>
                            </div>
                            <button className='text-sm bg-primary hover:bg-accent text-white px-4 py-1 rounded-full transition-colors duration-300 mt-2' onClick={(e)=>handleAddToCart(e,product?._id)}>Add to Cart</button>
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

export default HorizontalCardProduct