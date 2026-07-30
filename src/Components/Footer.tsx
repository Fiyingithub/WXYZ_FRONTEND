import { Link } from 'react-router-dom';
import logo from '../Asset/images/wxyz_logo.png'

function Footer() {
  return (
    <div>
      <footer className="bg-[#feefec] text-[#f2592b] py-6 hidden lg:block">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left">
            <div className="flex items-center cursor-pointer">
            <img src={logo} alt="logo" className="w-17.5" />
            {/* <h1>oneWorld</h1> */}
          </div>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/" className="hover:text-gray-400">Home</Link>              
            <Link to="#" className="hover:text-gray-400">Privacy Policy</Link>
            <Link to="#" className="hover:text-gray-400">Terms of Service</Link>
            <Link to="#" className="hover:text-gray-400">Contact Us</Link>
          </div>
          </div>
        </div>
      </footer>

      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">

          <div>
            <h2 className="text-white text-lg font-semibold mb-4">About Us</h2>
            <p className="text-gray-400">
            We are a leading e-commerce platform providing the best products at unbeatable prices. Shop with us for a wide selection and secure payments.
            </p>
          </div>

          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Customer Service</h2>
            <ul>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Help Center</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Returns & Refunds</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Shipping Information</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">FAQs</Link></li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Shop</h2>
            <ul>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Men's Fashion</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Women's Fashion</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Electronics</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-white text-lg font-semibold mb-4">Stay Connected</h2>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <form className="flex mb-4">
              <input type="email" placeholder="Email address" className="px-4 py-2 w-full bg-gray-800 text-white rounded-l-lg focus:outline-none"/>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-r-lg">Subscribe</button>
            </form>
            <div className="flex space-x-4 mt-4">
              <Link to="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-facebook-f"></i></Link>
              <Link to="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-twitter"></i></Link>
              <Link to="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-instagram"></i></Link>
              <Link to="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-linkedin"></i></Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>&copy; 2024 E-commerce Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Footer