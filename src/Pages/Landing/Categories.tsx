import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userCategoryService } from '../../services/Users/product/userCategoryService';

interface CategoryImage {
  id: string;
  url: string;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  image: string;
  createdAt: string;
  images: CategoryImage[];
}

const Categories = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await userCategoryService.getAll();
        setCategories(res);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className='flex justify-center my-4'>
        <div className='flex flex-col lg:items-center rounded-sm w-full max-w-275 px-2'>
          <p className="text-xl font-semibold opacity-85">Browse by Categories</p>
          <div className="flex gap-4 space-x-4 py-4">
            <div className="text-gray-500">Loading categories...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex justify-center my-4'>
      <div className='flex flex-col lg:items-center rounded-sm w-full max-w-275 px-2'>
        <p className="text-xl font-semibold opacity-85">Browse by Categories</p>
        <div className="flex gap-4 space-x-4 overflow-x-scroll lg:overflow-x-hidden py-4 scrollbar-hide">
          {categories.map((category) => {
            const image = category.images?.[0]?.url;
            return (
              <div
                className='cursor-pointer'
                key={category.id}
                onClick={() => navigate(`/products?categoryId=${category.id}`)}
              >
                <div className='h-20 w-20 bg-secondary flex items-center justify-center rounded-full overflow-hidden'>
                  {image ? (
                    <img src={image} alt={category.name} className='w-full h-full object-cover' />
                  ) : (
                    <div className='w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs'>
                      No image
                    </div>
                  )}
                </div>
                <div className='h-6 w-20'>
                  <p className='text-center text-sm font-medium truncate'>{category.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;