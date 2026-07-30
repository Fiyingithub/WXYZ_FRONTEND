import { useState } from 'react';
import Sidebar from '../Sidebar'; 
import axios from 'axios';
import { useToast } from '../../Loaders/ToastContext';
import WaitingLoader from '../../Loaders/WaitingLoader';
import NavbarDashboard from '../NavbarDashboard';

function AddProduct() {
  const { notifySuccess, notifyError, startWaitingLoader, stopWaitingLoader } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    codeName: '',
    category: '',
    stockDate: ''
  })
  const [imageModal, setImageModal] = useState(false)
  const [productId, setProductId] = useState('')

  const addProduct = async (e) => {
    e.preventDefault()
    startWaitingLoader()

    try{
      const res = await axios.post('https://oneworld-fq81.onrender.com/api/Product/AddProduct', productData)
      // console.log(res.data)
      setProductId(res.data.productId)
      notifySuccess('Product Added Successfully')
      if(res.data){
        setImageModal(true)
        setProductData({
          name: '',
          description: '',
          price: '',
          stock: '',
          codeName: '',
          category: '',
          stockDate: ''
        })
      }
      stopWaitingLoader()
    } catch(err){
      console.log(err)
      notifyError('Error Adding Product')
      stopWaitingLoader()
    }
  }

  const [images, setImages] = useState([]);
  const uploadImages = async () => {
    startWaitingLoader()
    const urlsArray = [];
    const uploadPromises = Array.from(images).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'oneworld');
      formData.append('cloud_name', 'dcm8uhxyn');

      try {
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/dcm8uhxyn/image/upload`, formData
        );
        urlsArray.push(res.data.secure_url);
        // console.log(urlsArray);
        stopWaitingLoader()
      } catch (error) {
        console.error('Error uploading image:', error);
        stopWaitingLoader()
      }
    });

    await Promise.all(uploadPromises);
    const sendUrls = urlsArray.join(',');
    // console.log(sendUrls)

    try{
      const res = await axios.post(`https://oneworld-fq81.onrender.com/api/Product/AddImageUrl/${productId}`, {imageUrl: sendUrls})

      // console.log(res.data.data)
      notifySuccess(res.data.responseMessage)
      setImageModal(false)
      setImages([])
      stopWaitingLoader()
    } catch(err){
      // console.log(err.response)
      notifyError(err.response.data.responseMessage)
      stopWaitingLoader()
    }
  };

  const handleFilesChange = (event) => {
    const files = event.target.files;
    setImages(files);
  };

  return (
    <div className='flex'>
      <WaitingLoader/> 
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>

      <div className='w-full'>
        <NavbarDashboard toggleSidebar={toggleSidebar}/>

        <div className='p-6 space-y-4 w-[100%] lg:px-20 '>
          <h1 className='text-xl font-medium'>Add new product</h1>
          <form action="submit" className='grid gap-4' onSubmit={addProduct} >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <select name="category" defaultValue={"Select Category"} id="category" className='border p-2 rounded-md outline-primary'
                onChange={(e) => setProductData({...productData, category: e.target.value})}>
                <option value="Select Category" disabled>Select Category</option>
                <option value="Phones">Phones</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Buds">Buds</option>
                <option value="Chargers">Chargers</option>
                <option value="Phone parts">Phone parts</option>
                <option value="Powerbank">Powerbank</option>
              </select>

              <input type="text" placeholder='Product Name' className='border p-2 rounded-md outline-primary' 
                value={productData.name}
                onChange={(e) => setProductData({...productData, name: e.target.value})}/>
              <input type="text" placeholder='Product Description' className='border p-2 rounded-md outline-primary'
                value={productData.description}
                onChange={(e) => setProductData({...productData, description: e.target.value})}/>
              <input type="text" placeholder='Product Price' className='border p-2 rounded-md outline-primary'
                value={productData.price}
                onChange={(e) => setProductData({...productData, price: e.target.value})}/>
              <input type="number" placeholder='Product Quantity' className='border p-2 rounded-md outline-primary'
                value={productData.stock}
                onChange={(e) => setProductData({...productData, stock: e.target.value})}/>
              <input type="text" placeholder='Code Name' className='border p-2 rounded-md outline-primary'
                value={productData.codeName}
                onChange={(e) => setProductData({...productData, codeName: e.target.value})}/>
              <input type="date" className='border p-2 rounded-md outline-primary'
                value={productData.stockDate}
                onChange={(e) => setProductData({...productData, stockDate: e.target.value})}/>
            </div>
            <button type="submit" className='bg-primary hover:bg-hover text-white font-bold py-2 px-4 rounded transition-all duration-700 ease-in-out'>
                Submit
            </button>
          </form>

          {imageModal && (
            <div className='fixed top-0 left-0 w-full h-full bg-[#00000099] z-40 flex items-center justify-center'>
              <div className='bg-white py-20 px-4 lg:p-32 space-y-2 relative rounded-lg'>
                <input type="file" accept="image/*" multiple title="Image" className='flex flex-col border p-2 rounded-md outline-primary'
                  onChange={handleFilesChange}
                  />
                <button className='bg-primary px-8 py-2 rounded-lg hover:bg-gradient-to-tl from-primary to-blue-700 transition-colors duration-500 text-white font-medium ' onClick={uploadImages}>Upload</button>
                <button className='bg-red-500 hover:bg-red-400 absolute top-4 right-4 px-6 py-2 rounded-lg text-white ' onClick={() => setImageModal(false)}>Close</button>

                {images.length > 0 && (
                  <div className='flex flex-wrap gap-4 p-4'>
                    {Array.from(images).map((image, index) => (
                      <img key={index} src={URL.createObjectURL(image)} className='w-12 h-12 object-cover' alt='' />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddProduct