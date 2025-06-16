import React, { useCallback, useContext, useEffect, useState } from 'react'
import  { useNavigate, useParams } from 'react-router-dom'
import SummaryApi from '../common'
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import displayINRCurrency from '../helpers/displayCurrency';
import VerticalCardProduct from '../components/VerticalCardProduct';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import Context from '../context';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const [data,setData] = useState({
    productName : "",
    brandName : "",
    category : "",
    productImage : [],
    description : "",
    price : "",
    sellingPrice : ""
  })
  const params = useParams()
  const [loading,setLoading] = useState(true)
  const productImageListLoading = new Array(4).fill(null)
  const [activeImage,setActiveImage] = useState("")
  const [customizedProductImage, setCustomizedProductImage] = useState(null);

  const [zoomImageCoordinate,setZoomImageCoordinate] = useState({
    x : 0,
    y : 0
  })
  const [zoomImage,setZoomImage] = useState(false)

  const { fetchUserAddToCart } = useContext(Context)
  const user = useSelector(state => state?.user?.user)

  const navigate = useNavigate()

  const [sellingPrice, setSellingPrice] = useState("");

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColour, setSelectedColour] = useState("");
  const [selectedFont, setSelectedFont] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [selectedMourningOption, setSelectedMourningOption] = useState("");
  const [lightOption, setLightOption] = useState("");

  const fetchProductDetails = async()=>{
    setLoading(true)
    const token = localStorage.getItem('authToken');  

    if (!token) {
        console.error("No auth token found");
        return;
    }
    const response = await fetch(SummaryApi.productDetails.url,{
      method : SummaryApi.productDetails.method,
      headers: {
        'Authorization': `Bearer ${token}`,   // Send the token in Authorization header
        'Content-Type': 'application/json'    // Specify content type
    },
      body : JSON.stringify({
        productId : params?.id
      })
    })
    setLoading(false)
    const dataReponse = await response.json()

    setData(dataReponse?.data)
    setActiveImage(dataReponse?.data?.productImage[0])

  }

  console.log("data",data)

  useEffect(()=>{
    fetchProductDetails()
    const savedCustomizedImage = localStorage.getItem(`customizedImage_${params?.id}`);
    if (savedCustomizedImage) {
      setCustomizedProductImage(savedCustomizedImage);
      setActiveImage(savedCustomizedImage); // Set customized image as active by default if it exists
    }
  },[params])

  const handleMouseEnterProduct = (imageURL)=>{
    setActiveImage(imageURL)
  }

  const handleZoomImage = useCallback((e) =>{
    setZoomImage(true)
    const { left , top, width , height } = e.target.getBoundingClientRect()
    console.log("coordinate", left, top , width , height)

    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height

    setZoomImageCoordinate({
      x,
      y
    })
  },[zoomImageCoordinate])

  const handleLeaveImageZoom = ()=>{
    setZoomImage(false)
  }

  const handleAddToCart = async (e, id, customizedImage) => {
    if(!user?.email){
      toast.error("Login please")
      navigate("/login")
      return
    }
    await addToCart(e, id, customizedImage); // Pass customized image to addToCart
    fetchUserAddToCart(); // Refresh the cart
  };

  const handleBuyProduct = async(e,id)=>{
    if(!user?.email){
      toast.error("Login please")
      navigate("/login")
      return
    }
    await addToCart(e,id)
    fetchUserAddToCart()
    navigate("/cart")
  }

  return (
    <div className='container mx-auto p-4'>

      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>
          {/***product Image */}
          <div className='h-96 flex flex-col lg:flex-row gap-4'>

              <div className='h-full'>
                  {
                    loading ? (
                      <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                        {
                          productImageListLoading.map((el,index) =>{
                            return(
                              <div className='h-20 w-20 bg-slate-200 rounded animate-pulse' key={"loadingImage"+index}>
                              </div>
                            )
                          })
                        }
                      </div>
                      
                    ) : (
                      <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                        {
                          data?.productImage?.[0] && (
                            <div className='h-20 w-20 bg-slate-200 rounded p-1' key={data.productImage[0]}>
                              <img src={data.productImage[0]} className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer' onMouseEnter={()=>handleMouseEnterProduct(data.productImage[0])}  onClick={()=>handleMouseEnterProduct(data.productImage[0])}/>
                            </div>
                          )
                        }
                        {
                          customizedProductImage && (
                            <div className='h-20 w-20 bg-slate-200 rounded p-1 border-2 border-blue-500' key="customizedImage">
                              <img src={customizedProductImage} className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer' onMouseEnter={()=>handleMouseEnterProduct(customizedProductImage)}  onClick={()=>handleMouseEnterProduct(customizedProductImage)}/>
                            </div>
                          )
                        }
                        {
                          data?.productImage?.slice(1).map((imgURL,index) =>{
                            return(
                              <div className='h-20 w-20 bg-slate-200 rounded p-1' key={imgURL}>
                                <img src={imgURL} className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer' onMouseEnter={()=>handleMouseEnterProduct(imgURL)}  onClick={()=>handleMouseEnterProduct(imgURL)}/>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  }
              </div>

              <div className='h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 relative p-2'>
                  <img src={activeImage} className='h-full w-full object-scale-down mix-blend-multiply' onMouseMove={handleZoomImage} onMouseLeave={handleLeaveImageZoom}/>

                    {/**product zoom */}
                    {
                      zoomImage && (
                        <div className='hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-200 p-1 -right-[510px] top-0'>
                          <div
                            className='w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150'
                            style={{
                              background : `url(${activeImage})`,
                              backgroundRepeat : 'no-repeat',
                              backgroundPosition : `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}% `
    
                            }}
                          >
    
                          </div>
                        </div>
                      )
                    }
                  
              </div>
          </div>

           {/***product details */}
           {
            loading ? (
              <div className='grid gap-1 w-full'>
                <p className='bg-slate-200 animate-pulse  h-6 lg:h-8 w-full rounded-full inline-block'></p>
                <h2 className='text-2xl lg:text-4xl font-medium h-6 lg:h-8  bg-slate-200 animate-pulse w-full'></h2>
                <p className='capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8  w-full'></p>

                <div className='text-red-600 bg-slate-200 h-6 lg:h-8  animate-pulse flex items-center gap-1 w-full'>
    
                </div>

                <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-6 lg:h-8  animate-pulse w-full'>
                  <p className='text-red-600 bg-slate-200 w-full'></p>
                  <p className='text-slate-400 line-through bg-slate-200 w-full'></p>
                </div>

                <div className='flex items-center gap-3 my-2 w-full'>
                  <button className='h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full'></button>
                  <button className='h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full'></button>
                </div>

                <div className='w-full'>
                  <p className='text-slate-600 font-medium my-1 h-6 lg:h-8   bg-slate-200 rounded animate-pulse w-full'></p>
                  <p className=' bg-slate-200 rounded animate-pulse h-10 lg:h-12  w-full'></p>
                </div>
              </div>
            ) : 
            (
              <div className='flex flex-col gap-1'>
                <p className='bg-red-200 text-red-600 px-2 rounded-full inline-block w-fit'>{data?.brandName}</p>
                <h2 className='text-2xl lg:text-4xl font-medium'>{data?.productName}</h2>
                <p className='capitalize text-slate-400'>{data?.category}</p>

                <div className='text-red-600 flex items-center gap-1'>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStar/>
                    <FaStarHalf/>
                </div>

                <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1'>
                  <p className='text-red-600'>{displayINRCurrency(data.sellingPrice)}</p>
                  <p className='text-slate-400 line-through'>{displayINRCurrency(data.price)}</p>
                </div>
                
                <div>
                  <p className='text-slate-600 font-medium my-1'>Description : </p>
                  <p>{data?.description}</p>
                </div>

                {/* New Options Section */}
                <div className='grid grid-cols-2 gap-4 my-2'>
                  {/* Size Options */}
                  <div>
                    <label htmlFor='sizeOptions' className='block text-sm font-medium text-gray-700'>Size Options</label>
                    <select id='sizeOptions' name='sizeOptions' value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'>
                      <option value="">Select Size</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  {/* Colour Options */}
                  <div>
                    <label htmlFor='colourOptions' className='block text-sm font-medium text-gray-700'>Colour Options</label>
                    <select id='colourOptions' name='colourOptions' value={selectedColour} onChange={(e) => setSelectedColour(e.target.value)} className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'>
                      <option value="">Select Colour</option>
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                    </select>
                  </div>

                  {/* Font Options */}
                  <div>
                    <label htmlFor='fontOptions' className='block text-sm font-medium text-gray-700'>Font Options</label>
                    <select id='fontOptions' name='fontOptions' value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)} className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'>
                      <option value="">Select Font</option>
                      <option value="arial">Arial</option>
                      <option value="timesNewRoman">Times New Roman</option>
                      <option value="roboto">Roboto</option>
                    </select>
                  </div>

                  {/* Symbol Options */}
                  <div>
                    <label htmlFor='symbolOptions' className='block text-sm font-medium text-gray-700'>Symbol Options</label>
                    <select id='symbolOptions' name='symbolOptions' value={selectedSymbol} onChange={(e) => setSelectedSymbol(e.target.value)} className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'>
                      <option value="">Select Symbol</option>
                      <option value="star">Star</option>
                      <option value="heart">Heart</option>
                      <option value="cross">Cross</option>
                    </select>
                  </div>

                  {/* Mourning Options */}
                  <div>
                    <label htmlFor='mourningOptions' className='block text-sm font-medium text-gray-700'>Mourning Options</label>
                    <select id='mourningOptions' name='mourningOptions' value={selectedMourningOption} onChange={(e) => setSelectedMourningOption(e.target.value)} className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm'>
                      <option value="">Select Option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {/* Light Yes or No */}
                  <div className='flex items-center gap-4'>
                    <span className='text-sm font-medium text-gray-700'>Light:</span>
                    <div className='flex items-center'>
                      <input type='radio' id='lightYes' name='lightOption' value='yes' checked={lightOption === 'yes'} onChange={(e) => setLightOption(e.target.value)} className='focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300' />
                      <label htmlFor='lightYes' className='ml-2 block text-sm text-gray-900'>Yes</label>
                    </div>
                    <div className='flex items-center'>
                      <input type='radio' id='lightNo' name='lightOption' value='no' checked={lightOption === 'no'} onChange={(e) => setLightOption(e.target.value)} className='focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300' />
                      <label htmlFor='lightNo' className='ml-2 block text-sm text-gray-900'>No</label>
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-3 my-2'>
                  <button className='border-2 border-red-600 rounded px-3 py-1 min-w-[120px] text-red-600 font-medium hover:bg-gray-600 hover:text-white' onClick={(e)=>handleBuyProduct(e,data?._id)}>Buy</button>
                  <button className='border-2 border-red-600 rounded px-3 py-1 min-w-[120px] font-medium text-white bg-black  hover:text-red-600 hover:bg-white' onClick={(e)=>handleAddToCart(e,data?._id, customizedProductImage)}>Add To Cart</button>
                  <button className='border-2 border-blue-600 rounded px-3 py-1 min-w-[120px] font-medium text-white bg-blue-600 hover:bg-blue-700' onClick={() => navigate(`/customize/${data?._id}`)}>Customize</button>
              </div>

              </div>
            )
           }

      </div>



      {
        data.category && (
          <CategroyWiseProductDisplay category={data?.category} heading={"Recommended Product"}/>
        )
      }
     



    </div>
  )
}

export default ProductDetails