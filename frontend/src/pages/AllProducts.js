import React, { useEffect, useState } from 'react'
import UploadProduct from '../components/UploadProduct'
import SummaryApi from '../common'
import AdminProductCard from '../components/AdminProductCard'
import productCategory from '../helpers/productCategory';

const PRODUCTS_PER_PAGE = 12;

const AllProducts = () => {
  const [openUploadProduct,setOpenUploadProduct] = useState(false)
  const [allProduct,setAllProduct] = useState([])
  const [filterCategory, setFilterCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchAllProduct = async() =>{
    setLoading(true);
    let url = SummaryApi.allProduct.url;
    const response = await fetch(url);
    const dataResponse = await response.json();
    let products = dataResponse?.data || [];
    // Filter by category
    if (filterCategory) {
      products = products.filter(p => p.category === filterCategory);
    }
    // Filter by price
    products = products.filter(p => p.sellingPrice >= priceRange[0] && p.sellingPrice <= priceRange[1]);
    // Sort
    if (sortBy === 'asc') products = products.sort((a,b) => a.sellingPrice - b.sellingPrice);
    if (sortBy === 'dsc') products = products.sort((a,b) => b.sellingPrice - a.sellingPrice);
    if (sortBy === 'newest') products = products.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    setAllProduct(products);
    setLoading(false);
  }

  useEffect(() => {
    fetchAllProduct();
    setPage(1); // Reset to first page on filter/sort change
  }, [filterCategory, priceRange, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(allProduct.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = allProduct.slice((page-1)*PRODUCTS_PER_PAGE, page*PRODUCTS_PER_PAGE);

  return (
    <div className='container mx-auto max-w-7xl p-6 min-h-[70vh]'>
      <div className='bg-white py-4 px-6 flex flex-col md:flex-row md:justify-between md:items-center rounded-lg shadow mb-6 gap-4'>
        <h2 className='font-bold text-2xl'>All Products</h2>
        <button className='border-2 border-red-600 text-red-600 hover:bg-gray-600 hover:text-white transition-all py-2 px-5 rounded-full font-semibold' onClick={()=>setOpenUploadProduct(true)}>Upload Product</button>
      </div>
      {/* Filter & Sort Controls */}
      <div className='flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg shadow mb-6'>
        <div>
          <label className='font-medium mr-2'>Category:</label>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className='border rounded px-2 py-1'>
            <option value=''>All</option>
            {productCategory.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
          </select>
        </div>
        <div>
          <label className='font-medium mr-2'>Price:</label>
          <input type='number' value={priceRange[0]} min={0} max={priceRange[1]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])} className='w-20 border rounded px-2 py-1 mr-1' />
          -
          <input type='number' value={priceRange[1]} min={priceRange[0]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} className='w-20 border rounded px-2 py-1 ml-1' />
        </div>
        <div>
          <label className='font-medium mr-2'>Sort by:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className='border rounded px-2 py-1'>
            <option value=''>Default</option>
            <option value='asc'>Price: Low to High</option>
            <option value='dsc'>Price: High to Low</option>
            <option value='newest'>Newest</option>
          </select>
        </div>
      </div>
      {/* Product Grid */}
      {loading ? (
        <div className='flex justify-center items-center h-60'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
        </div>
      ) : paginatedProducts.length === 0 ? (
        <div className='flex flex-col items-center justify-center h-96'>
          <img src='https://illustrations.popsy.co/gray/empty-cart.svg' alt='No Products' className='w-48 mb-6'/>
          <div className='text-gray-500 text-lg mb-2'>No products found.</div>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
          {paginatedProducts.map((product,index)=>{
            return(
              <AdminProductCard data={product} key={index+"allProduct"} fetchdata={fetchAllProduct}/>
            )
          })}
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center mt-8 gap-2'>
          <button disabled={page === 1} onClick={()=>setPage(page-1)} className={`px-4 py-2 rounded ${page === 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>Prev</button>
          {[...Array(totalPages)].map((_, idx) => (
            <button key={idx} onClick={()=>setPage(idx+1)} className={`px-3 py-1 rounded ${page === idx+1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{idx+1}</button>
          ))}
          <button disabled={page === totalPages} onClick={()=>setPage(page+1)} className={`px-4 py-2 rounded ${page === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>Next</button>
        </div>
      )}
      {/* Upload Product Modal */}
      {openUploadProduct && (
        <UploadProduct onClose={()=>setOpenUploadProduct(false)} fetchData={fetchAllProduct}/>
      )}
    </div>
  )
}

export default AllProducts