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