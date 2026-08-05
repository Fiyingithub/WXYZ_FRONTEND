// import { MdAddCall } from "react-icons/md";
// import { FaWhatsapp } from "react-icons/fa";
// FaGripLinesVertical

const TopNav = () => {
  return (
    <div>
      <div className='w-full text-white text-sm h-8 bg-linear-to-br from-[#f2592b] to-[orange] flex items-center justify-center px-4'>
        <div className='flex items-center gap-2'>
          {/* <p className='flex items-center'><MdAddCall/> +234-7033360836</p> */}
          {/* <p className='flex items-center'><FaWhatsapp/> +234-8139318929</p> */}
        </div>
        <div className='lg:flex hidden items-center gap-2'>
          {/* <p>free shipping on all orders over $100</p> */}
          {/* <FaGripLinesVertical/> */}
          <p>Shop Now</p>
        </div>
        {/* <p >Location: Not a barrier </p> */}
      </div>
    </div>
  )
}

export default TopNav







// // ============================================
// // Components/TopNav.tsx
// // ============================================
// import { useState, useEffect } from 'react';
// import { FaTimes, FaTruck, FaHeadset, FaTag } from 'react-icons/fa';

// const TopNav = () => {
//   const [isVisible, setIsVisible] = useState(true);
//   const [currentMessage, setCurrentMessage] = useState(0);

//   const messages = [
//     { icon: FaTruck, text: 'Free delivery on orders over ₦50,000' },
//     { icon: FaTag, text: 'Summer Sale - Up to 50% off' },
//     { icon: FaHeadset, text: '24/7 Customer Support Available' },
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentMessage((prev) => (prev + 1) % messages.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [messages.length]);

//   if (!isVisible) return null;

//   return (
//     <div className="relative bg-[#1a1a2e] text-white text-sm overflow-hidden">
//       <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
//         {/* Left side - Rotating Messages */}
//         <div className="flex items-center gap-3 flex-1 min-w-0">
//           <div className="flex items-center gap-2 animate-slide-in">
//             {messages[currentMessage] && (
//               <>
//                 {/* <messages[currentMessage].icon className="text-[#f2592b] text-xs sm:text-sm flex-shrink-0" /> */}
//                 <span className="text-xs sm:text-sm truncate">
//                   {messages[currentMessage].text}
//                 </span>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Right side - Additional Info */}
//         <div className="hidden md:flex items-center gap-6 text-xs">
//           <a href="/contact" className="hover:text-[#f2592b] transition-colors">
//             Help
//           </a>
//           <a href="/orders" className="hover:text-[#f2592b] transition-colors">
//             Track Order
//           </a>
//           <span className="text-gray-400">|</span>
//           <span>🇳🇬 Nigeria</span>
//         </div>

//         {/* Close Button */}
//         <button
//           onClick={() => setIsVisible(false)}
//           className="ml-2 text-gray-400 hover:text-white transition-colors flex-shrink-0"
//           aria-label="Close announcement"
//         >
//           <FaTimes className="text-sm" />
//         </button>
//       </div>

//       {/* Add animation styles */}
//       <style>{`
//         @keyframes slideIn {
//           from {
//             opacity: 0;
//             transform: translateX(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
//         .animate-slide-in {
//           animation: slideIn 0.5s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default TopNav;