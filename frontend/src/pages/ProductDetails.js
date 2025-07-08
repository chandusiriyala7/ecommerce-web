import React, { useCallback, useContext, useEffect, useState } from 'react'
import  { useNavigate, useParams } from 'react-router-dom'
import SummaryApi from '../common'
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
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
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

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

  useEffect(() => {
    // Track recently viewed products
    if (params?.id) {
      let viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      viewed = viewed.filter(pid => pid !== params.id);
      viewed.unshift(params.id);
      if (viewed.length > 12) viewed = viewed.slice(0, 12);
      localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
    }
  }, [params]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?._id) return;
      const token = localStorage.getItem('authToken');
      const res = await fetch(SummaryApi.getWishlist.url, {
        method: SummaryApi.getWishlist.method,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setWishlist(data.data.map(p => p._id));
    };
    fetchWishlist();
  }, [user]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setReviewLoading(true);
      const res = await fetch(`${SummaryApi.getProductReviews.url}?productId=${params.id}`);
      const data = await res.json();
      if (data.success) setReviews(data.data);
      setReviewLoading(false);
      // If user has already reviewed, set form state
      if (user?._id) {
        const existing = data.data.find(r => r.user?._id === user._id);
        if (existing) setUserReview({ rating: existing.rating, comment: existing.comment });
      }
    };
    fetchReviews();
  }, [params.id, user]);

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

  const handleWishlistToggle = async (productId) => {
    if (!user?._id) {
      toast.error('Please login to use wishlist');
      return;
    }
    const token = localStorage.getItem('authToken');
    if (wishlist.includes(productId)) {
      await fetch(SummaryApi.removeFromWishlist.url, {
        method: SummaryApi.removeFromWishlist.method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, productId })
      });
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      await fetch(SummaryApi.addToWishlist.url, {
        method: SummaryApi.addToWishlist.method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, productId })
      });
      setWishlist([...wishlist, productId]);
    }
  };

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error('Please login to review');
      return;
    }
    if (!userReview.rating) {
      toast.error('Please select a rating');
      return;
    }
    setSubmittingReview(true);
    const token = localStorage.getItem('authToken');
    const res = await fetch(SummaryApi.productReview.url, {
      method: SummaryApi.productReview.method,
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: params.id, ...userReview })
    });
    const data = await res.json();
    setSubmittingReview(false);
    if (data.success) {
      setReviews(data.data);
      toast.success('Review submitted!');
    } else {
      toast.error(data.message || 'Failed to submit review');
    }
  };

  // Calculate average rating
  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

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
                    <label htmlFor='sizeOptions' className='block text-sm font-medium text-primary mb-1'>Size Options</label>
                    <select id='sizeOptions' name='sizeOptions' value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className='mt-1 block w-full py-2 px-3 border border-cardBorder bg-cardBg rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm transition-all duration-300'>
                      <option value="">Select Size</option>
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>

                  {/* Colour Options */}
                  <div>
                    <label htmlFor='colourOptions' className='block text-sm font-medium text-primary mb-1'>Colour Options</label>
                    <select id='colourOptions' name='colourOptions' value={selectedColour} onChange={(e) => setSelectedColour(e.target.value)} className='mt-1 block w-full py-2 px-3 border border-cardBorder bg-cardBg rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm transition-all duration-300'>
                      <option value="">Select Colour</option>
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                    </select>
                  </div>

                  {/* Font Options */}
                  <div>
                    <label htmlFor='fontOptions' className='block text-sm font-medium text-primary mb-1'>Font Options</label>
                    <select id='fontOptions' name='fontOptions' value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)} className='mt-1 block w-full py-2 px-3 border border-cardBorder bg-cardBg rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm transition-all duration-300'>
                      <option value="">Select Font</option>
                      <option value="arial">Arial</option>
                      <option value="timesNewRoman">Times New Roman</option>
                      <option value="roboto">Roboto</option>
                    </select>
                  </div>

                  {/* Symbol Options */}
                  <div>
                    <label htmlFor='symbolOptions' className='block text-sm font-medium text-primary mb-1'>Symbol Options</label>
                    <select id='symbolOptions' name='symbolOptions' value={selectedSymbol} onChange={(e) => setSelectedSymbol(e.target.value)} className='mt-1 block w-full py-2 px-3 border border-cardBorder bg-cardBg rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm transition-all duration-300'>
                      <option value="">Select Symbol</option>
                      <option value="star">Star</option>
                      <option value="heart">Heart</option>
                      <option value="cross">Cross</option>
                    </select>
                  </div>

                  {/* Mourning Options */}
                  <div>
                    <label htmlFor='mourningOptions' className='block text-sm font-medium text-primary mb-1'>Mourning Options</label>
                    <select id='mourningOptions' name='mourningOptions' value={selectedMourningOption} onChange={(e) => setSelectedMourningOption(e.target.value)} className='mt-1 block w-full py-2 px-3 border border-cardBorder bg-cardBg rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm transition-all duration-300'>
                      <option value="">Select Option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>

                  {/* Light Yes or No */}
                  <div className='flex items-center gap-4 py-2'>
                    <span className='text-sm font-medium text-primary'>Light:</span>
                    <div className='flex items-center'>
                      <input type='radio' id='lightYes' name='lightOption' value='yes' checked={lightOption === 'yes'} onChange={(e) => setLightOption(e.target.value)} className='focus:ring-accent h-4 w-4 text-accent border-cardBorder transition-all duration-300' />
                      <label htmlFor='lightYes' className='ml-2 block text-sm text-primary'>Yes</label>
                    </div>
                    <div className='flex items-center'>
                      <input type='radio' id='lightNo' name='lightOption' value='no' checked={lightOption === 'no'} onChange={(e) => setLightOption(e.target.value)} className='focus:ring-accent h-4 w-4 text-accent border-cardBorder transition-all duration-300' />
                      <label htmlFor='lightNo' className='ml-2 block text-sm text-primary'>No</label>
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-3 my-2'>
                  <button className='border-2 border-accent rounded px-4 py-2 min-w-[140px] text-accent font-semibold hover:bg-accent hover:text-white transition-all duration-300 shadow-md' onClick={(e)=>handleBuyProduct(e,data?._id)}>Buy Now</button>
                  <button className='border-2 border-primary rounded px-4 py-2 min-w-[140px] font-semibold text-white bg-primary hover:bg-accent hover:text-white transition-all duration-300 shadow-md' onClick={(e)=>handleAddToCart(e,data?._id, customizedProductImage)}>Add To Cart</button>
                  <button className='border-2 border-primary rounded px-4 py-2 min-w-[140px] font-semibold text-white bg-primary hover:bg-accent hover:text-white transition-all duration-300 shadow-md' onClick={() => navigate(`/customize/${data?._id}`, { state: { product: data } })}>Customize</button>
                  <div className='flex items-center gap-4 mb-2'>
                    <button className='text-2xl' onClick={() => handleWishlistToggle(params.id)}>
                      {wishlist.includes(params.id) ? <FaHeart className='text-red-500' /> : <FaRegHeart className='text-gray-400' />}
                    </button>
                    <span>Add to Wishlist</span>
                  </div>
              </div>

              {/* Reviews & Ratings Section */}
              <div className='mt-8 bg-white rounded shadow p-4'>
                <h3 className='text-xl font-bold mb-2'>Reviews & Ratings</h3>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-2xl text-yellow-500'>{avgRating ? avgRating : '--'}</span>
                  <div className='flex'>
                    {[1,2,3,4,5].map(i => (
                      <FaStar key={i} className={avgRating && avgRating >= i ? 'text-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                  <span className='text-gray-600 ml-2'>({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                </div>
                {/* Review Form */}
                {user?._id && (
                  <form onSubmit={handleReviewSubmit} className='mb-4'>
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='font-medium'>Your Rating:</span>
                      {[1,2,3,4,5].map(i => (
                        <button type='button' key={i} onClick={() => setUserReview(r => ({ ...r, rating: i }))}>
                          <FaStar className={userReview.rating >= i ? 'text-yellow-400' : 'text-gray-300'} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      className='w-full border rounded px-3 py-2 mb-2'
                      rows={2}
                      placeholder='Write your review...'
                      value={userReview.comment}
                      onChange={e => setUserReview(r => ({ ...r, comment: e.target.value }))}
                    />
                    <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded' disabled={submittingReview}>{submittingReview ? 'Submitting...' : 'Submit Review'}</button>
                  </form>
                )}
                {/* Reviews List */}
                {reviewLoading ? (
                  <div>Loading reviews...</div>
                ) : reviews.length === 0 ? (
                  <div className='text-gray-500'>No reviews yet.</div>
                ) : (
                  <div className='space-y-4'>
                    {reviews.map((r, idx) => (
                      <div key={idx} className='border-b pb-2'>
                        <div className='flex items-center gap-2 mb-1'>
                          {r.user?.profilePic ? <img src={r.user.profilePic} alt={r.user.name} className='w-8 h-8 rounded-full' /> : <div className='w-8 h-8 rounded-full bg-gray-300'></div>}
                          <span className='font-semibold'>{r.user?.name || 'User'}</span>
                          <div className='flex ml-2'>
                            {[1,2,3,4,5].map(i => (
                              <FaStar key={i} className={r.rating >= i ? 'text-yellow-400' : 'text-gray-300'} />
                            ))}
                          </div>
                          <span className='text-xs text-gray-500 ml-2'>{new Date(r.date).toLocaleDateString()}</span>
                        </div>
                        <div className='ml-10 text-gray-800'>{r.comment}</div>
                      </div>
                    ))}
                  </div>
                )}
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