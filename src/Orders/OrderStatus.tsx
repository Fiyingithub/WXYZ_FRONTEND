import { Link } from 'react-router-dom';
import watch from '../Asset/ProductImages/watch.jpg'

const OrderStatus = () => {
  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl"> 

        <div className="w-40 h-40 border-2 border-gray-300 rounded overflow-hidden flex items-center justify-center">
          <img src={watch} className="w-20 h-20" alt="Product" />
        </div>

        <h2 className="text-4xl font-semibold mt-6">Order #5913</h2>

        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium">Item</h2>
            <p className="text-md md:text-xl font-semibold">Apple Watch Series 8 GPS</p>
          </div>
          <span className="bg-yellow-100 text-yellow-800 text-md md:text-lg font-medium px-4 py-1 rounded-full mt-[-5px]">In progress</span>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 text-md">Carrier: UPSR Gosling</p>
          <p className="text-gray-600 text-md">Address: 4517 Washington Ave, Manchester, Kentucky</p>
        </div>

        <div className="flex space-x-4 mb-6">
          <button className="bg-blue-500 text-white px-4 py-2 text-sm rounded-md hover:bg-blue-600">Export Details</button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 text-sm rounded-md hover:bg-gray-300">Request Confirmation</button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">...</button>
        </div>

        <div className="border-b border-gray-400 mb-6">
          <nav className="flex space-x-4" aria-label="Tabs">
            <Link to="#" className="text-blue-600 font-medium px-3 py-2 border-b-2 border-blue-500">Order History</Link>
            <Link to="#" className="text-gray-500 hover:text-gray-700 px-3 py-2">Item Details</Link>
            <Link to="#" className="text-gray-500 hover:text-gray-700 px-3 py-2">Courier</Link>
            <Link to="#" className="text-gray-500 hover:text-gray-700 px-3 py-2">Receiver</Link>
          </nav>
        </div>

        <div>
          <div className="space-y-4">

            <div className="flex items-start">
              <div className="h-8 w-8 bg-blue-500 text-white flex items-center justify-center rounded-full">&#10004;</div>
              <div className="ml-4">
                <p className="font-semibold">Product Shipped</p>
                <p className="text-gray-500 text-sm">13/09/2023 5:23 pm</p>
                <p className="text-sm text-gray-600">Courier Service: UPS, R. Gosling</p>
                <p className="text-sm text-gray-600">Estimated Delivery Date: 15/09/2023</p>
                <Link to="#" className="text-blue-500 text-sm hover:underline">See Details</Link>
              </div>
            </div>

            <div className="flex items-start">
              <div className="h-8 w-8 bg-blue-500 text-white flex items-center justify-center rounded-full">&#10004;</div>
              <div className="ml-4">
                <p className="font-semibold">Product Packaging</p>
                <p className="text-gray-500 text-sm">13/09/2023 4:13 pm</p>
                <p className="text-sm text-gray-600">Tracking number: 3409-4934-4253</p>
                <p className="text-sm text-gray-600">Warehouse: Apple Spot 13b</p>
                <Link to="#" className="text-blue-500 text-sm hover:underline">See Details</Link>
              </div>
            </div>

            <div className="flex items-start">
              <div className="h-8 w-8 bg-blue-500 text-white flex items-center justify-center rounded-full">&#10004;</div>
              <div className="ml-4">
                <p className="font-semibold">Order Confirmed</p>
                <p className="text-gray-500 text-sm">13/09/2023 3:53 pm</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="h-8 w-8 bg-blue-500 text-white flex items-center justify-center rounded-full">&#10004;</div>
              <div className="ml-4">
                <p className="font-semibold">Order Placed</p>
                <p className="text-gray-500 text-sm">13/09/2023 3:43 pm</p>
              </div>
            </div>

          </div>
        </div>

        <div className="border-b border-gray-400 mb-6 mt-10"></div>

        <div className="mt-6 flex justify-between">
          <p className="text-gray-500 text-md">Order 1 of 13</p>
          <button className="text-blue-500 text-md ml-4 hover:underline mr-[20px]">Next order <span className="text-gray-600 text-2xl">&#8594;</span></button>
        </div>
      </div>
    </div>
  );
};

export default OrderStatus;