import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='bg-black text-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Contact Information */}
          <div className='text-center md:text-left'>
            <h3 className='text-xl font-bold mb-4'>Contact Us</h3>
            <p className='text-gray-400'>No.77, Moorthy Street, Avadi to Poovai Road, Chennai, Tamilnadu - 600071</p>
            <p className='text-gray-400 mt-2'>+91 73050 28841</p>
            <p className='text-gray-400'>+91 96000 40232</p>
            <p className='text-gray-400'>044-35078028</p>
          </div>

          {/* Product Categories */}
          <div className='text-center'>
            <h3 className='text-xl font-bold mb-4'>Our Products</h3>
            <ul className='space-y-2'>
              <li><a href='/neon-nameplates' className='text-gray-400 hover:text-white transition duration-300'>Neon Nameplates</a></li>
              <li><a href='/metal-nameplates' className='text-gray-400 hover:text-white transition duration-300'>Metal Nameplates</a></li>
              <li><a href='/custom-nameboards' className='text-gray-400 hover:text-white transition duration-300'>Custom Nameboards</a></li>
              <li><a href='/signage-solutions' className='text-gray-400 hover:text-white transition duration-300'>Signage Solutions</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className='text-center'>
            <h3 className='text-xl font-bold mb-4'>Quick Links</h3>
            <ul className='space-y-2'>
              <li><a href='/about' className='text-gray-400 hover:text-white transition duration-300'>About Us</a></li>
              <li><a href='/contact' className='text-gray-400 hover:text-white transition duration-300'>Contact</a></li>
              <li><a href='/customization' className='text-gray-400 hover:text-white transition duration-300'>Customization</a></li>
              <li><a href='/faq' className='text-gray-400 hover:text-white transition duration-300'>FAQ</a></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className='text-center md:text-right'>
            <h3 className='text-xl font-bold mb-4'>Subscribe</h3>
            <p className='text-gray-400 mb-4'>Get updates on our latest products and offers.</p>
            <form className='flex justify-center md:justify-end'>
              <input
                type='email'
                placeholder='Enter your email'
                className='p-2 rounded-l-lg bg-gray-800 text-white focus:outline-none'
              />
              <button
                type='submit'
                className='bg-white text-black p-2 rounded-r-lg hover:bg-gray-300 transition duration-300'
              >
                Subscribe
              </button>
            </form>
            <div className='mt-4 flex justify-center md:justify-end space-x-4'>
              <a href='https://facebook.com' className='text-gray-400 hover:text-white transition duration-300'><FaFacebook size={24} /></a>
              <a href='https://instagram.com' className='text-gray-400 hover:text-white transition duration-300'><FaInstagram size={24} /></a>
              <a href='https://twitter.com' className='text-gray-400 hover:text-white transition duration-300'><FaTwitter size={24} /></a>
              <a href='https://linkedin.com' className='text-gray-400 hover:text-white transition duration-300'><FaLinkedin size={24} /></a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-gray-700 my-8'></div>

        {/* Footer Bottom */}
        <div className='text-center'>
          <p className='text-gray-400'>
            Your trusted partner for <span className='text-white font-bold'>customized nameboards, neon nameplates, and metal nameplates</span>.
          </p>
          <p className='text-gray-400 mt-2'>
            Copyright © 2024 Adzon Signage. All Rights Reserved
          </p>
          <p className='text-gray-400 mt-2'>
            Powered By <a href='https://grexotix.com' className='hover:text-white transition duration-300'>Grexotix</a>
          </p>
          <p className='text-gray-400 mt-4'>
            Built By <a href='https://youtube.com/chandusiriyala' className='text-white hover:text-gray-300 transition duration-300'>Chandusiriyala :)</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;