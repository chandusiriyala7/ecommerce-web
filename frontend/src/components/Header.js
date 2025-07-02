import React, { useContext, useState } from 'react'
import Logo from './Logo'
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser, FaCamera } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify'
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';
import { FaSearch } from 'react-icons/fa';

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const [menuDisplay,setMenuDisplay] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()
  const searchInput = useLocation()
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll("q")
  const [search,setSearch] = useState(searchQuery)


  const handleLogout = async() => {
    const fetchData = await fetch(SummaryApi.logout_user.url,{
      method : SummaryApi.logout_user.method,
      credentials : 'include'
    })

    const data = await fetchData.json()

    if(data.success){
      toast.success(data.message)
      dispatch(setUserDetails(null))
      navigate("/")
    }
    

    if(data.error){
      toast.error(data.message)
    }

  }

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search) {
      navigate(`/search?q=${search}`);
    } else {
      navigate('/search');
    }
  };
console.log("User Details:", user)  // Debugging user details
 

  return (
    <header className='h-20 shadow-lg bg-cardBg fixed w-full z-40'>
      <div className='h-full container mx-auto flex items-center px-4 justify-between'>
            <div className='flex items-center gap-2'>
                <Link to={"/"}>
                     <img src="/bullcroc-logo.jpg" alt ="bullcroc" className='w-[120px] transition-transform duration-300 hover:scale-105'/>
                </Link>
            </div>

            <div className='hidden lg:flex items-center w-full justify-between max-w-md border border-cardBorder rounded-full focus-within:shadow-md overflow-hidden pl-4' onSubmit={handleSearchSubmit}>
                <input type='text' placeholder='Search for products...' className='w-full outline-none py-2 bg-cardBg text-primary placeholder-secondary' onChange={handleSearch} value={search}/>
                <button
                  type='submit'
                  className='text-xl min-w-[44px] h-full bg-primary flex items-center justify-center rounded-r-full text-white cursor-pointer hover:bg-accent transition-colors duration-300 px-3'
                  aria-label='Search'
                >
                  <FaSearch />
                </button>
            </div>


            <div className='flex items-center gap-7'>
                
                <div className='relative flex justify-center'>

                  {
                    user?._id && (
                      <div className='text-3xl cursor-pointer relative flex justify-center text-secondary hover:text-primary transition-colors duration-300' onClick={()=>setMenuDisplay(preve => !preve)}>
                        {
                          user?.profilePic ? (
                            <img src={user?.profilePic} className='w-10 h-10 rounded-full border border-cardBorder shadow-sm' alt={user?.name} />
                          ) : (
                            <FaRegCircleUser/>
                          )
                        }
                      </div>
                    )
                  }
                  
                  
                  {
                    menuDisplay && (
                      <div className='absolute bg-cardBg bottom-0 top-14 h-fit p-3 shadow-xl rounded-lg border border-cardBorder' >
                        <nav>
                          {
                            user?.role === ROLE.ADMIN && (
                              <Link to={"/admin-panel/all-products"} className='whitespace-nowrap hidden md:block hover:bg-background text-primary p-2 rounded block transition-colors duration-300' onClick={()=>setMenuDisplay(preve => !preve)}>Admin Panel</Link>
                            )
                          }
                          <Link to={'/profile'} className='whitespace-nowrap flex items-center gap-2 hover:bg-background text-primary p-2 rounded block transition-colors duration-300' onClick={()=>setMenuDisplay(preve => !preve)}>
                            <FaCamera className='text-lg' /> Edit Profile
                          </Link>
                        </nav>
                      </div>
                    )
                  }
                 
                </div>

                  {
                     user?._id && (
                      <Link to={"/cart"} className='text-3xl relative text-secondary hover:text-primary transition-colors duration-300'>
                          <span><FaShoppingCart/></span>
      
                          <div className='bg-accent text-white w-6 h-6 rounded-full flex items-center justify-center absolute -top-2 -right-3 text-sm font-semibold border-2 border-white'>
                              <p className='text-sm'>{context?.cartProductCount}</p>
                          </div>
                      </Link>
                      )
                  }
              


                <div>
                  {
                    user?._id  ? (
                      <button onClick={handleLogout} className='px-4 py-2 rounded-full text-white bg-primary hover:bg-accent transition-colors duration-300 shadow-md font-semibold'>Logout</button>
                    )
                    : (
                    <Link to={"/login"} className='px-4 py-2 rounded-full text-white bg-primary hover:bg-accent transition-colors duration-300 shadow-md font-semibold'>Login</Link>
                    )
                  }
                    
                </div>

            </div>

      </div>
    </header>
  )
}

export default Header