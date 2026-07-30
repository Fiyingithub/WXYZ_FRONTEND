import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import TopNav from '../Components/TopNav';
import Navbar from '../Components/Navbar';

import '../Styles/customScrollbar.css';

// Images
import img1 from "../Asset/images/bag 3.png";
import img2 from "../Asset/images/bag2.png";
import img3 from "../Asset/images/brown bag.png";
import img4 from "../Asset/images/black backpack.png";
import img5 from "../Asset/images/download 1.jpg";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems] = useState([
    { id: 1, name: "Product 1", image: img1, description: "Description for the product 1", price: 20, quantity: 1, checked: false },
    { id: 2, name: "Product 2", image: img2, description: "Description for the product 2", price: 35, quantity: 1, checked: false },
    { id: 3, name: "Product 3", image: img3, description: "Description for the product 3", price: 50, quantity: 1, checked: false },
    { id: 4, name: "Product 4", image: img4, description: "Description for the product 4", price: 75, quantity: 1, checked: false },
    { id: 5, name: "Product 5", image: img5, description: "Description for the product 5", price: 100, quantity: 1, checked: false },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <TopNav />
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className='flex flex-col md:flex-row justify-between my-10 max-w-[1100px] mx-auto'>
        <div className='border lg:w-[700px] rounded-lg p-4 space-y-4 '>
          <div className='space-y-2'>
            <label htmlFor="state" className='font-semibold'>Shipping State</label>
            <select id="state" name="state" className='w-full p-2 border rounded-md'>
              <option value="Select State">Select State</option>
              <option value="Lagos">Lagos</option>
              <option value="Abia">Abia</option>
              <option value="Adamawa">Adamawa</option>
              <option value="Akwa Ibom">Akwa Ibom</option>
              <option value="Anambra">Anambra</option>
              <option value="Bauchi">Bauchi</option>
              <option value="Bayelsa">Bayelsa</option>
              <option value="Benue">Benue</option>
              <option value="Borno">Borno</option>
              <option value="Cross River">Cross River</option>
              <option value="Delta">Delta</option>
              <option value="Ebonyi">Ebonyi</option>
              <option value="Edo">Edo</option>
              <option value="Ekiti">Ekiti</option>
              <option value="Enugu">Enugu</option>
              <option value="Gombe">Gombe</option>
              <option value="Imo">Imo</option>
              <option value="Jigawa">Jigawa</option>
              <option value="Kaduna">Kaduna</option>
              <option value="Kano">Kano</option>
              <option value="Katsina">Katsina</option>
              <option value="Kebbi">Kebbi</option>
              <option value="Kogi">Kogi</option>
              <option value="Kwara">Kwara</option>
              <option value="Nasarawa">Nasarawa</option>
              <option value="Niger">Niger</option>
              <option value="Ogun">Ogun</option>
              <option value="Ondo">Ondo</option>
              <option value="Osun">Osun</option>
              <option value="Oyo">Oyo</option>
              <option value="Plateau">Plateau</option>
              <option value="Rivers">Rivers</option>
              <option value="Sokoto">Sokoto</option>
              <option value="Taraba">Taraba</option>
              <option value="Yobe">Yobe</option>
              <option value="Zamfara">Zamfara</option>
            </select>
          </div>
          <div className='space-y-4'>
            <h1 className='font-semibold'>Shipping Address</h1>
            <div className='space-y-2'>
              <label htmlFor="name">Full name<span className='text-red-400'>*</span></label>
              <input type="text" id='name' className='w-full p-2 border rounded-md' placeholder='Enter your full name' />
            </div>
            <div className='space-y-2'>
              <label htmlFor="email" >Email Address<span className='text-red-400'>*</span></label>
              <input type="email" id='email' className='w-full p-2 border rounded-md' placeholder='Enter your email address' />
              <input type="email" id='confirm-email' className='w-full p-2 border rounded-md' placeholder='Confirm your email address' />
            </div>
            <div className='space-y-2'>
              <label htmlFor="phone" >Phone number<span className='text-red-400'>*</span></label>
              <input type="text" id='phone' className='w-full p-2 border rounded-md' placeholder='Enter your phone number' />
            </div>
            <div className='space-y-2'>
              <label htmlFor="house" >House number and street name<span className='text-red-400'>*</span></label>
              <input type="text" id='house' className='w-full p-2 border rounded-md' placeholder='Enter your house number and street name' />
            </div>
            <div className='space-y-2'>
              <label htmlFor="city" >City<span className='text-red-400'>*</span></label>
              <input type="text" id='city' className='w-full p-2 border rounded-md' placeholder='City name' />
            </div>
            <div className='space-y-2'>
              <label htmlFor="post" >Postal Code<span className='text-red-400'>*</span></label>
              <input type="text" id='post' className='w-full p-2 border rounded-md' placeholder='Postal code' />
            </div>
          </div>
        </div>

        <div>
          <div className='customScrollbar border md:w-[370px] rounded-lg overflow-hidden'>
            <div className="bg-primary flex justify-between text-white h-10 items-center p-4">
              <h2>Order Summary</h2>
              <button onClick={() => navigate('/cart')} className='text-black bg-secondary p-1 rounded-md'>Modify</button>
            </div>
            <div className='h-[300px] overflow-y-scroll customScrollbar '>
              {cartItems.map(item => (
                <div key={item.id} className='flex justify-between border-b p-4'>
                  <img src={item.image} alt="" className='w-16 h-16' />
                  <div>
                    <h1 className='font-medium'>{item.name}</h1>
                    <p className='text-sm text-gray-400'>{item.description}</p>
                    <p className='text-sm text-gray-400'>x{item.quantity}</p> 
                  </div>
                  <h1>₦ {item.price.toFixed(2)}</h1>
                </div>
              ))}
            </div>

            <div>
              <div className='border-b space-y-4 p-4'>
                <div className='flex justify-between'>
                  <p className='text-gray-400'>Subtotal</p>
                  <p className='font-medium'>₦ 200,000.00</p>
                </div>
                <div className='flex justify-between text-gray-400'>
                  <p>Discount</p>
                  <p>₦ 20,000.00</p>
                </div>
                <div className='flex justify-between text-gray-400'>
                  <p>Shipment cost</p>
                  <p>₦ 4,000.00</p>
                </div>
              </div>
              <div className='p-4 flex justify-between'>
                <p>Ground Total</p>
                <p className='font-medium'>₦ 4,000.00</p>
              </div>
            </div>

            <div className='fixed bottom-0 md:static flex justify-center w-full'>
              <button className='bg-primary hover:bg-hover transition-all duration-400 w-full md:flex md:px-10 py-4 rounded-lg text-white justify-self-center md:m-4'>Continue to payment</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Checkout