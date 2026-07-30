import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import type { Product } from '../../Types/Product';


type CategoryWithImage = {
  category: string;
  image: string;
};

const mockCategories: CategoryWithImage[] = [
  { category: 'Hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200' },
  { category: 'T-Shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200' },
  { category: 'Jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200' },
  { category: 'Jeans', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200' },
  { category: 'Sneakers', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' },
  { category: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' },
];

const AllCategories = () => {
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const res = await axios.get('https://oneworld-fq81.onrender.com/api/Product/GetAllProduct');
        setAllProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getAllProducts();
  }, []);

  const categoryMap = new Map<string, string>();

  // allProducts.forEach((product) => {
  //   if (product.category && product.imageUrl && !categoryMap.has(product.category)) {
  //     const firstImage = product.imageUrl.split(',')[0];
  //     categoryMap.set(product.category, firstImage);
  //   }
  // });


  mockCategories.forEach((product) => {
    if (product.category && product.image && !categoryMap.has(product.category)) {
      const firstImage = product.image;
      categoryMap.set(product.category, firstImage);
    }
  });
  

  const uniqueCategoriesWithImages: CategoryWithImage[] = Array.from(categoryMap).map(([category, image]) => ({
    category,
    image
  }));

  return (
    <div className='flex justify-center my-4'>
      <div className='flex flex-col lg:items-center rounded-sm w-full max-w-275 px-2'>
        <p className="text-xl font-semibold opacity-85">Browse by Categories</p>
        <div className="flex gap-4 space-x-4 overflow-x-scroll lg:overflow-x-hidden py-4 scrollbar-hide">
          {uniqueCategoriesWithImages?.map((item, index) => (
            <div
              className='cursor-pointer'
              key={index}
              onClick={() => navigate(`/products?category=${item.category}`)}
            >
              <div className='h-20 w-20 bg-secondary flex items-center justify-center'>
                <img src={item.image} alt={item.category} className='w-[80%] object-cover' />
              </div>
              <div className='h-6 w-20'>
                <p className='text-center text-sm font-medium'>{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCategories;
