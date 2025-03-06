import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);
  const [customizedImages, setCustomizedImages] = useState({}); // Store customized images for products

  // Fetch user details
  const fetchUserDetails = async () => {
    const dataResponse = await fetch(SummaryApi.current_user.url, {
      method: SummaryApi.current_user.method,
      credentials: 'include',
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      dispatch(setUserDetails(dataApi.data));
    }
  };

  // Fetch user's cart product count
  const fetchUserAddToCart = async () => {
    const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
      method: SummaryApi.addToCartProductCount.method,
      credentials: 'include',
    });

    const dataApi = await dataResponse.json();

    setCartProductCount(dataApi?.data?.count);
  };

  // Save customized image for a product
  const saveCustomizedImage = (productId, imageData) => {
    setCustomizedImages((prev) => ({
      ...prev,
      [productId]: imageData, // Save the customized image for the product
    }));
  };

  // Get customized image for a product
  const getCustomizedImage = (productId) => {
    return customizedImages[productId] || null;
  };

  useEffect(() => {
    /** Fetch user details */
    fetchUserDetails();
    /** Fetch user's cart product count */
    fetchUserAddToCart();
  }, []);

  return (
    <>
      <Context.Provider
        value={{
          fetchUserDetails, // Fetch user details
          cartProductCount, // Current user's cart product count
          fetchUserAddToCart, // Fetch user's cart product count
          saveCustomizedImage, // Save customized image for a product
          getCustomizedImage, // Get customized image for a product
        }}
      >
        <ToastContainer position="top-center" />
        <Header />
        <main className="min-h-[calc(100vh-120px)] pt-16">
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
    </>
  );
}

export default App;