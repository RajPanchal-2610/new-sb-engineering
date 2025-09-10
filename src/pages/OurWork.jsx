import { useState } from 'react';
import { X } from "lucide-react";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

function OurWork() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const projects = [
    { id: 1, category: "main-gate", image: "/images/gate-1.jpeg" },
    { id: 2, category: "main-gate", image: "/images/gate-2.jpeg" },
    { id: 3, category: "main-gate", image: "/images/gate-3.jpeg" },
    { id: 4, category: "main-gate", image: "/images/gate-4.jpeg" },
    { id: 5, category: "house-grills", image: "https://images.unsplash.com/photo-1555505019-8c3f1c4aba5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
    { id: 6, category: "house-grills", image: "https://images.unsplash.com/photo-1614159102522-43c67ece6f93?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
    { id: 7, category: "stair-railings", image: "https://images.unsplash.com/photo-1600567686527-6fb886090705?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
    { id: 8, category: "stair-railings", image: "https://images.unsplash.com/photo-1591005493328-11207150b390?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
    { id: 9, category: "swings", image: "/images/swing-1.jpeg" },
    { id: 10, category: "swings", image: "/images/swing-2.jpeg" },
    { id: 11, category: "swings", image: "/images/swing-3.jpeg" },
    { id: 12, category: "swings", image: "/images/swing-4.jpeg" },
    { id: 13, category: "swings", image: "/images/swing-5.jpeg" },
    { id: 14, category: "swings", image: "/images/swing-6.jpeg" },
    { id: 15, category: "swings", image: "/images/swing-7.jpeg" },
    { id: 16, category: "swings", image: "/images/swing-8.jpeg" },
    { id: 17, category: "balcony-railings", image: "/images/balcony-railing-1.jpeg" },
    { id: 18, category: "balcony-railings", image: "/images/balcony-railing-2.jpeg" },
    { id: 19, category: "balcony-railings", image: "/images/balcony-railing-3.jpeg" },
    { id: 20, category: "terrace-railings", image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
    { id: 21, category: "mandir-shikhar", image: "/images/mandir-shikhar-1.jpeg" },
    { id: 22, category: "mandir-shikhar", image: "/images/mandir-shikhar-2.jpeg" },
    { id: 23, category: "mandir-shikhar", image: "/images/mandir-shikhar-3.jpeg" },
    { id: 24, category: "shades", image: "/images/shade-1.jpeg" },
    { id: 25, category: "others", image: "/images/other-1.jpeg" },
    { id: 26, category: "others", image: "/images/other-2.jpeg" },
  ];

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'main-gate', label: 'Main Gates' },
    { id: 'house-grills', label: 'House Grills' },
    { id: 'stair-railings', label: 'Stair Railings' },
    { id: 'balcony-railings', label: 'Balcony Railings' },
    { id: 'terrace-railings', label: 'Terrace Railings' },
    { id: 'swings', label: 'Swings' },
    { id: 'mandir-shikhar', label: 'Mandir Shikhar' },
    { id: 'shades', label: 'Shades' },
    { id: 'others', label: 'Others' }
  ];

  return (
    <div className="w-full bg-gray-100 p-3 sm:p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Work</h1>

        {/* Filter buttons */}
        <div className="flex gap-3 mb-8 overflow-x-auto sm:overflow-x-visible whitespace-nowrap sm:flex-wrap scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900 hover:bg-accent hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid layout */} 
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-card overflow-hidden border border-border p-2 sm:p-5 mx-auto w-full max-w-[260px] lg:max-w-[350px] 
                        lg:max-h-[480px]"
            >
              {/* Image Wrapper */}
              <div className="aspect-[3/4] sm:aspect-auto sm:h-[300px] lg:h-[330px] overflow-hidden rounded-xl mb-3">
                <img
                  src={project.image}
                  alt={project.category}
                  className="w-full h-full rounded-xl object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Button */}
              <div>
                <button
                  className="w-full bg-gray-900 text-white py-2 sm:py-3 rounded-full text-sm hover:bg-accent transition"
                  onClick={() => openModal(project.image)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && ( 
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-white text-gray-900 rounded-xl p-4 w-[90%] max-w-xl relative shadow-2xl">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 bg-gray-900 text-white hover:bg-accent rounded-full w-9 h-9 flex items-center justify-center shadow-card"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Fixed size image */}
              <div className="flex justify-center items-center">
                <Zoom className="rounded-2xl">
                  <img
                    src={selectedImage}
                    alt="Full View"
                    className="object-contain w-[400px] h-[300px] sm:w-[500px] sm:h-[400px] rounded-2xl"
                  />
                </Zoom>
              </div>
            </div>
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center mt-20">
            <h3 className="text-xl text-gray-900 font-semibold mb-2">No projects found</h3>
            <p className="text-accent">Try another category or check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OurWork;