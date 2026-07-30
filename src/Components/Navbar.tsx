import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Icons
// import { FaRegUser } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { TiThMenu } from "react-icons/ti";

import logo from '../Asset/images/wxyz_logo.png'

function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false)
  // const user = JSON.parse(sessionStorage.getItem('user'))
  return (
    <div className='flex items-center justify-center'>
      <nav className="text-black bg-white container items-center font-pop z-50 flex flex-col gap-2 py-1 justify-center w-full sticky top-0  ">
        <div className="flex items-center justify-between mx-auto container md:mx-6 lg:py-0 px-4 max-w-275 lg:rounded-lg">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="logo" className="w-17.5" />
            {/* <h1>oneWorld</h1> */}
          </div>
          <div className="space-x-5 items-center hidden lg:flex">
            <Link to="/" className='font-medium'>Home</Link>
            <Link to="about" className='font-medium'>Categories </Link>
            <button onClick={() => localStorage.removeItem('cartId')} className='hidden'>Clear cart</button>
          </div>

          <div className="flex text-black space-x-4 items-center ">
            <div className='hidden lg:flex items-center'><input type="text" placeholder='Search products' className='border border-gray-300 px-2 py-1 lg:w-75 rounded-xl outline-none ' /><IoSearch className='text-3xl bg-secondary p-1 rounded-full'/></div>
            {/* <span className='flex items-center gap-2 font-medium'><FaRegUser className='text-xl'/>{user.username}</span> */}
            <Link to='/cart' className='flex items-center gap-2'><MdOutlineShoppingCart className='text-xl'/>Cart</Link>
            <TiThMenu className='text-2xl lg:hidden ' onClick={() => setIsOpen(!isOpen)}/>
          </div>
        </div>
        {/* <div className='flex items-center justify-center w-full px-4 lg:hidden '>
          <input type="text" placeholder='Search products' className='border border-gray-300 px-2 py-1 w-full rounded-full outline-none ' />
          <IoSearch className='text-3xl bg-secondary p-1 rounded-full'/>
        </div> */}
      </nav>

      {isOpen && (
        <div className="space-x-5 items-center z-50 fixed shadow-lg top-230 bg-[white] w-full  px-20 py-10 flex justify-center">
          <div className='flex flex-col gap-6 w-full'>
            <Link className='border-b ' to="/">Home</Link>
            <Link className='border-b ' to="#">About </Link>
            <Link className='border-b ' to="../signup.html">Sign Up</Link>
            <Link className='border-b ' to="#">Sign In</Link>
            <Link className='border-b ' to="#">Contact Us</Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar