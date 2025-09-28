import { useState, useEffect } from 'react';
import { X } from "lucide-react";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { supabase } from '../supabaseClient';

interface Category {
  id: string;
  name: string;
}

interface ImageItem {
  id: string;
  url: string;
  title: string;
  category_id: string;
}

function OurWork() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchCategories();
    fetchImages();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (!error && data) setCategories(data);
  };

  const fetchImages = async () => {
    const startTime = Date.now();
    const { data, error } = await supabase.from('images').select('*');
    if (!error && data) {
      setImages(data);
      const elapsedTime = Date.now() - startTime;
      const minLoadTime = 1500; // 1.5 seconds
      
      if (elapsedTime < minLoadTime) {
        setTimeout(() => setLoading(false), minLoadTime - elapsedTime);
      } else {
        setLoading(false);
      }
    }
  };

  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const filteredImages = activeCategory === 'all'
    ? images
    : images.filter(img => img.category_id === activeCategory);

  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedImages = filteredImages.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setCategoryLoading(true);
    setActiveCategory(categoryId);
    setTimeout(() => setCategoryLoading(false), 800);
  };

  const categoryOptions = [
    { id: 'all', name: 'All Projects' },
    ...categories
  ];

  if (loading) {
    return (
      <div className="w-full bg-gray-100 p-3 sm:p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 p-3 sm:p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center py-5">Our Work</h1>

        {/* Filter buttons */}
        <div className="flex gap-3 mb-8 overflow-x-auto sm:overflow-x-visible whitespace-nowrap sm:flex-wrap scrollbar-hide">
          {categoryOptions.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid layout */} 
        {categoryLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {paginatedImages.map(image => (
              <div
                key={image.id}
                className="bg-white rounded-2xl shadow-card overflow-hidden border border-border p-2 sm:p-5 mx-auto w-full max-w-[260px] lg:max-w-[350px] 
                          lg:max-h-[480px]"
              >
                {/* Image Wrapper */}
                <div className="aspect-[3/4] sm:aspect-auto sm:h-[300px] lg:h-[330px] overflow-hidden rounded-xl mb-3">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full rounded-xl object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Button */}
                <div>
                  <button
                    className="w-full bg-gray-900 text-white py-2 sm:py-3 rounded-full text-sm hover:bg-gray-700 transition"
                    onClick={() => openModal(image.url)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && ( 
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-white text-gray-900 rounded-xl p-4 w-[90%] max-w-xl relative shadow-2xl">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 bg-gray-900 text-white hover:bg-gray-700 rounded-full w-9 h-9 flex items-center justify-center shadow-card"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Fixed size image */}
              <div className="flex justify-center items-center">
                <div className="rounded-2xl">
                  <Zoom>
                    <img
                      src={selectedImage || ''}
                      alt="Full View"
                      className="object-contain w-[400px] h-[300px] sm:w-[500px] sm:h-[400px] rounded-2xl"
                    />
                  </Zoom>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 mb-8 gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white text-gray-900 hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentPage === page
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-900 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white text-gray-900 hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}

        {filteredImages.length === 0 && (
          <div className="text-center mt-20">
            <h3 className="text-xl text-gray-900 font-semibold mb-2">No projects found</h3>
            <p className="text-gray-600">Try another category or check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OurWork;