import { useState } from 'react';

function OurWork() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Sample project data - replace with your actual projects
  const projects = [
    {
      id: 1,
      title: "Modern Entrance Gate",
      category: "main-gate",
      image: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Custom-designed modern entrance gate with geometric patterns."
    },
    {
      id: 2,
      title: "Decorative Window Grill",
      category: "house-grills",
      image: "https://images.unsplash.com/photo-1555505019-8c3f1c4aba5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Elegant window grill with floral design elements."
    },
    {
      id: 3,
      title: "Spiral Staircase Railing",
      category: "stair-railings",
      image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Custom spiral staircase railing with intricate details."
    },
    {
      id: 4,
      title: "Garden Swing",
      category: "swings",
      image: "https://images.unsplash.com/photo-1597767411689-c38a3bf89ec0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Durable and comfortable garden swing with decorative elements."
    },
    {
      id: 5,
      title: "Balcony Railing",
      category: "balcony-railings",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Modern balcony railing with glass panels and metal frame."
    },
    {
      id: 6,
      title: "Terrace Safety Railing",
      category: "terrace-railings",
      image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Stylish yet secure terrace railing with panoramic views."
    },
    {
      id: 7,
      title: "Coffee Table Frame",
      category: "furniture-frames",
      image: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Custom metal frame for a glass-top coffee table."
    },
    {
      id: 8,
      title: "Decorative Main Gate",
      category: "main-gate",
      image: "https://images.unsplash.com/photo-1545176120-2550fb027b13?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Ornate main gate with traditional design elements."
    },
    {
      id: 9,
      title: "Security Window Grill",
      category: "house-grills",
      image: "https://images.unsplash.com/photo-1614159102522-43c67ece6f93?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Secure window grill with modern aesthetic appeal."
    },
    {
      id: 10,
      title: "Indoor Swing",
      category: "swings",
      image: "https://images.unsplash.com/photo-1596900779744-2bdc4a90509a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Elegant indoor swing for living room or covered patio."
    },
    {
      id: 11,
      title: "Dining Table Frame",
      category: "furniture-frames",
      image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Sturdy metal frame for a large dining table."
    },
    {
      id: 12,
      title: "Curved Staircase Railing",
      category: "stair-railings",
      image: "https://images.unsplash.com/photo-1591005493328-11207150b390?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      description: "Elegant curved railing for a grand staircase."
    }
  ];
  
  // Filter projects based on active category
  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);
  
  // Categories for filter buttons
  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'main-gate', label: 'Main Gates' },
    { id: 'house-grills', label: 'House Grills' },
    { id: 'stair-railings', label: 'Stair Railings' },
    { id: 'balcony-railings', label: 'Balcony Railings' },
    { id: 'terrace-railings', label: 'Terrace Railings' },
    { id: 'swings', label: 'Swings' },
    { id: 'furniture-frames', label: 'Furniture Frames' }
  ];

  return (
    <div className="w-full bg-light-blue p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-navy mb-4 page-title">Our Work</h1>
        <p className="text-lg text-dark-blue mb-8">
          Browse through our portfolio of custom metal fabrication projects. 
          Use the filters below to view specific categories of our work.
        </p>
        
        {/* Category Filter Buttons */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors duration-300 ${
                  activeCategory === category.id
                    ? 'bg-navy text-white'
                    : 'bg-white text-navy hover:bg-medium-blue hover:text-white'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div 
              key={project.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 bg-navy bg-opacity-80 text-white px-3 py-1 text-sm">
                  {categories.find(cat => cat.id === project.category)?.label}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-dark-blue mb-2">{project.title}</h3>
                <p className="text-medium-blue">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* No Results Message */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-bold text-navy mb-2">No projects found</h3>
            <p className="text-medium-blue">
              We don't have any projects in this category yet. Please check back later or select another category.
            </p>
          </div>
        )}
        
        {/* Call to Action */}
        <div className="mt-12 bg-navy text-white p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Have a project in mind?</h2>
          <p className="text-light-blue mb-4">
            Contact us today to discuss your custom fabrication needs. We'll help bring your vision to life.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-medium-blue hover:bg-light-blue hover:text-navy text-white font-bold py-2 px-6 rounded-md transition-colors duration-300"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </div>
  );
}

export default OurWork;