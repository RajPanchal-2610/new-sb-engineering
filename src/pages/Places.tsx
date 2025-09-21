import React from "react";
import MasonryGallery from './MasonryGallery.js';

const imagesSet1 = [
    '/images/swing-1.jpeg',
    '/images/swing-2.jpeg',
    '/images/swing-3.jpeg',
    '/images/swing-4.jpeg',
  ];
  
  const imagesSet2 = [
    '/images/swing-5.jpeg',
    '/images/swing-6.jpeg',
    '/images/swing-7.jpeg',
    '/images/swing-8.jpeg',
  ];
  
  
  const Places = () => {
    return (
      <section className="max-w-7xl mx-auto px-4 py-12 space-y-24">
        
        {/* Section 1 - Images Left, Text Right */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2">
            <MasonryGallery images={imagesSet1} />
          </div>
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-navy mb-4">Our Presence</h2>
            <p className="text-lg text-gray-700">
              We work across multiple regions including Ahmedabad, Surat, Baroda, and surrounding areas.
              Our clients trust us for stainless steel gates, grills, swings, and customized fabrication.
            </p>
          </div>
        </div>
  
        {/* Section 2 - Text Left, Images Right */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-navy mb-4">Residential & Commercial Projects</h2>
            <p className="text-lg text-gray-700">
              From residential balconies to large commercial properties, our engineering solutions are trusted
              for durability and style. We tailor our work to the unique demands of each client.
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <MasonryGallery images={imagesSet2} />
          </div>
        </div>
  
      </section>
    );
  };
  
  export default Places;
  
  