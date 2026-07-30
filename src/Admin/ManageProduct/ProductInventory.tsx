import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import NavbarDashboard from '../NavbarDashboard';
import { useToast } from '../../Loaders/ToastContext';

const ProductInventory = () => {
    const { formatDate, formatAmount, formatNumberWithCommas } = useToast()
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    const product = location.state
    console.log(product)
    const images = product.imageUrl !== null && product.imageUrl !== undefined ? product.imageUrl.split(",") : 'null'
    console.log(images)
    return (
        <div className='flex'>
            <Sidebar />

            <div className='w-full'>
                <div className='sticky top-0 z-50'>
                    <NavbarDashboard toggleSidebar={toggleSidebar} />
                </div>
                <div className='p-4 space-y-4'>
                    <h1 className='text-2xl'>Product Details and Inventory</h1>

                    <table className="w-full lg:w-[800px] border border-gray-200 rounded-lg ">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left font-semibold border-b border-gray-200">Key</th>
                                <th className="px-6 py-3 text-left font-semibold border-b border-gray-200">Value</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-800 font-medium border-r border-gray-200">Name</td>
                                <td className="px-6 py-4 text-gray-600">{product.name}</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-800 font-medium border-r border-gray-200">Product description</td>
                                <td className="px-6 py-4 text-gray-600">{product.description}</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-800 font-medium border-r border-gray-200">Price</td>
                                <td className="px-6 py-4 text-gray-600">₦ {formatAmount(product.price)}</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-800 font-medium border-r border-gray-200">Date Added</td>
                                <td className="px-6 py-4 text-gray-600">{formatDate(product.dateAdded)}</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-800 font-medium border-r border-gray-200">Quantity Added</td>
                                <td className="px-6 py-4 text-gray-600">{formatNumberWithCommas(product.quantity)}</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-800 font-medium border-r border-gray-200">Quantity Sold</td>
                                <td className="px-6 py-4 text-gray-600">5</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-800 font-medium border-r border-gray-200">Quantity Remaining</td>
                                <td className="px-6 py-4 text-gray-600">5</td>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <p className='text-2xl font-medium'>Product images</p>
                        <div className='flex flex-wrap p-y'>
                            {images.map((image, index) => (
                                <div key={index} className='border'>
                                    <img src={image} alt="productImage" width={200} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductInventory