import { useEffect, useRef } from 'react';

function Home() {
  // Create refs for sections that will be animated on scroll
  const highlightsRef = useRef(null);
  const servicesRef = useRef(null);
  const projectsRef = useRef(null);
  const processRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Observer callback function
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        // Add 'animate' class when element enters viewport
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          // Unobserve after animation is triggered
          observer.unobserve(entry.target);
        }
      });
    };

    // Create Intersection Observer
    const observer = new IntersectionObserver(observerCallback, {
      root: null, // viewport
      threshold: 0.1, // trigger when 10% of the element is visible
      rootMargin: '0px 0px -50px 0px' // trigger slightly before element enters viewport
    });

    // Observe all section refs
    if (highlightsRef.current) observer.observe(highlightsRef.current);
    if (servicesRef.current) observer.observe(servicesRef.current);
    if (projectsRef.current) observer.observe(projectsRef.current);
    if (processRef.current) observer.observe(processRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    // Cleanup observer on component unmount
    return () => {
      if (highlightsRef.current) observer.unobserve(highlightsRef.current);
      if (servicesRef.current) observer.unobserve(servicesRef.current);
      if (projectsRef.current) observer.unobserve(projectsRef.current);
      if (processRef.current) observer.unobserve(processRef.current);
      if (testimonialsRef.current) observer.unobserve(testimonialsRef.current);
      if (ctaRef.current) observer.unobserve(ctaRef.current);
    };
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section with Owner - No scroll animation needed as it's visible on load */}
      <section className="w-full py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-10">
          
          {/* Image slides in from right */}
          <div className="w-full md:w-1/2 flex justify-center animate-slideInRight">
            <div className="group w-[300px] sm:w-[340px] md:w-[420px] h-[380px] sm:h-[440px] md:h-[520px] flex items-center justify-center overflow-hidden transform perspective-1000">
              <img
                src="/images/owner-2.png"
                alt="Nilesh Panchal - Owner"
                className="w-full h-full object-cover object-top transition-transform duration-500 ease-in-out group-hover:-translate-z-20"
              />
            </div>
          </div>

          {/* Text slides in from left */}
          <div className="w-full md:w-1/2 space-y-5 text-center md:text-left animate-slideInLeft">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              New SB Engineering
            </h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Led by Nilesh R. Panchal
            </h2>
            <p className="text-base sm:text-lg text-gray-700">
              With over 20 years of experience, Nilesh Panchal and his team create custom metal fabrications
              that combine security, durability, and aesthetic appeal.
            </p>
            <p className="italic text-gray-600 text-base sm:text-lg">
              "My passion has always been creating functional art through metalwork. Every piece we create
              is designed to not only serve its purpose but to enhance the beauty of your home or business."
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
              <a
                href="/our-work"
                className="inline-block bg-black text-white hover:bg-gray-800 font-bold py-3 px-6 sm:px-8 rounded-full transition-colors duration-300 shadow-md"
              >
                View Our Work
              </a>
              <a
                href="/contact"
                className="inline-block border-2 border-black text-black hover:bg-black hover:text-white font-bold py-3 px-6 sm:px-8 rounded-full transition-colors duration-300"
              >
                Get a Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={highlightsRef}
        className="w-full py-16 bg-white overflow-hidden opacity-0 translate-y-10 transition-all duration-1000 ease-in-out-expo"
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-black mb-8">
            Highlights of Our Creations
          </h2>

          <div className="relative w-full overflow-hidden">
            <div className="flex animate-marquee space-x-8">
              {/* Original Images */}
              {[
                '/images/swing-1.jpeg',
                '/images/swing-2.jpeg',
                '/images/swing-3.jpeg',
                '/images/swing-4.jpeg',
                '/images/swing-5.jpeg',
                '/images/swing-6.jpeg',
              ].map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Feature ${i + 1}`}
                  className="w-52 h-72 object-cover rounded-3xl shadow-md hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              ))}

              {/* Duplicate the same images for seamless loop */}
              {[
                '/images/swing-1.jpeg',
                '/images/swing-2.jpeg',
                '/images/swing-3.jpeg',
                '/images/swing-4.jpeg',
                '/images/swing-5.jpeg',
                '/images/swing-6.jpeg',
              ].map((img, i) => (
                <img
                  key={`dupe-${i}`}
                  src={img}
                  alt={`Feature D${i + 1}`}
                  className="w-52 h-72 object-cover rounded-3xl shadow-md hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview - with scroll animation */}
      <section ref={servicesRef} className="w-full py-16 px-6 bg-white opacity-0 translate-y-10 transition-all duration-1000 ease-in-out-expo relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Our Expertise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-8 rounded-lg shadow-card hover:shadow-hover transition-all duration-300 ease-in-out-expo text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Custom Gates</h3>
              <p className="text-gray-600">
                Secure and elegant entrance gates designed to enhance your property's appearance while providing security.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-card hover:shadow-hover transition-all duration-300 ease-in-out-expo text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Window Grills</h3>
              <p className="text-gray-600">
                Decorative and protective window grills that add character to your home while ensuring safety.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-card hover:shadow-hover transition-all duration-300 ease-in-out-expo text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Railings</h3>
              <p className="text-gray-600">
                Stylish and sturdy railings for staircases, balconies, and terraces that combine safety with elegance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects - with scroll animation */}
      <section ref={projectsRef} className="w-full py-16 px-6 bg-gray-100 translate-y-10 transition-all duration-1000 ease-in-out-expo">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-4 text-center">Featured Projects</h2>
          <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            Browse through some of our recent work. Each project is custom designed and crafted to meet our clients' specific needs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 ease-in-out-expo group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="/images/swing-1.jpeg" 
                  alt="Metal Swing" 
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out-expo group-hover:scale-110"
                />
                {/* <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-all duration-300 ease-in-out-expo"></div> */}

              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">Swing</h3>
                <p className="text-gray-600 mb-4">
                  Crafted for comfort and style, this swing is designed for both indoor and outdoor use, featuring rust-proof joints and elegant finishing.
                </p>
                <a href="/our-work" className="text-accent font-semibold hover:text-black transition-colors duration-300 ease-in-out-expo flex items-center">
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 ease-in-out-expo group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="/images/gate-1.jpeg" 
                  alt="Main Gate" 
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out-expo group-hover:scale-110"
                />
                {/* <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-all duration-300 ease-in-out-expo"></div> */}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">Main Gate</h3>
                <p className="text-gray-600 mb-4">
                  A heavy-duty designer gate crafted from premium-grade materials, offering both elegance and maximum security for your home entrance.
                </p>
                <a href="/our-work" className="text-accent font-semibold hover:text-black transition-colors duration-300 ease-in-out-expo flex items-center">
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 ease-in-out-expo group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src="/images/mandir-shikhar-1.jpeg" 
                  alt="Mandir Shikhar" 
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out-expo group-hover:scale-110"
                />
                {/* <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-all duration-300 ease-in-out-expo"></div> */}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">Mandir Shikhar</h3>
                <p className="text-gray-600 mb-4">
                  Intricately crafted Mandir Shikhar with traditional carvings, bringing sacred aesthetics and precision engineering together.
                </p>
                <a href="/our-work" className="text-accent font-semibold hover:text-black transition-colors duration-300 ease-in-out-expo flex items-center">
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <a 
              href="/our-work" 
              className="inline-block bg-black hover:bg-accent text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 ease-in-out-expo shadow-card hover:shadow-hover"
            >
              View All Projects
            </a>
          </div>
        </div>
      </section>

      {/* Process Section - with scroll animation */}
      <section ref={processRef} className="w-full py-16 px-6 bg-white opacity-0 translate-y-10 transition-all duration-1000 ease-in-out-expo">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Our Process</h2>
          <div className="relative">
            {/* Process Timeline Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-400 transform -translate-x-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:text-right">
                <div className="relative animate-[slideInFromLeft_0.5s_ease-out]">
                  <div className="hidden md:block absolute right-0 top-6 w-6 h-6 rounded-full bg-black border-4 border-gray-200 transform translate-x-1/2"></div>
                  <div className="bg-gray-100 p-6 rounded-lg shadow-card">
                    <h3 className="text-xl font-bold text-black mb-2">1. Consultation</h3>
                    <p className="text-gray-600">
                      We begin with a detailed consultation to understand your needs, preferences, and the specific requirements of your project.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="md:mt-32">
                <div className="relative animate-[slideInFromRight_0.7s_ease-out]">
                  <div className="hidden md:block absolute left-0 top-6 w-6 h-6 rounded-full bg-black border-4 border-gray-200 transform -translate-x-1/2"></div>
                  <div className="bg-gray-100 p-6 rounded-lg shadow-card">
                    <h3 className="text-xl font-bold text-black mb-2">2. Design</h3>
                    <p className="text-gray-600">
                      Our designers create detailed plans and sketches, working closely with you to refine the design until it perfectly matches your vision.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="md:text-right">
                <div className="relative animate-[slideInFromLeft_0.9s_ease-out]">
                  <div className="hidden md:block absolute right-0 top-6 w-6 h-6 rounded-full bg-black border-4 border-gray-200 transform translate-x-1/2"></div>
                  <div className="bg-gray-100 p-6 rounded-lg shadow-card">
                    <h3 className="text-xl font-bold text-black mb-2">3. Fabrication</h3>
                    <p className="text-gray-600">
                      Our skilled craftsmen bring the designs to life in our workshop, using high-quality materials and precise techniques.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="md:mt-32">
                <div className="relative animate-[slideInFromRight_1.1s_ease-out]">
                  <div className="hidden md:block absolute left-0 top-6 w-6 h-6 rounded-full bg-black border-4 border-gray-200 transform -translate-x-1/2"></div>
                  <div className="bg-gray-100 p-6 rounded-lg shadow-card">
                    <h3 className="text-xl font-bold text-black mb-2">4. Installation</h3>
                    <p className="text-gray-600">
                      Our professional team handles the installation with care and precision, ensuring a perfect fit and finish.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - with scroll animation */}
      <section ref={testimonialsRef} className="w-full py-16 px-6 bg-gray-100 opacity-0 translate-y-10 transition-all duration-1000 ease-in-out-expo">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">What Our Clients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-card">
              <div className="flex items-center mb-4">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Client" 
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-xl font-bold text-black">John Smith</h3>
                  <p className="text-gray-400">Homeowner</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The team at New SB Engineering created a beautiful custom gate for our home. 
                The craftsmanship is exceptional, and the installation was quick and professional."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-card">
              <div className="flex items-center mb-4">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="Client" 
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-xl font-bold text-black">Sarah Johnson</h3>
                  <p className="text-gray-400">Interior Designer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I've worked with New SB Engineering on multiple projects. Their attention to detail 
                and ability to bring creative designs to life is unmatched in the industry."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action - with scroll animation */}
      {/* <section ref={ctaRef} className="w-full py-16 px-6 bg-black text-white opacity-0 translate-y-10 transition-all duration-1000 ease-in-out-expo">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-gray-200 text-lg mb-8">
            Contact us today for a free consultation and quote. Let us help you create 
            the perfect custom solution for your home or business.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-gray-400 hover:bg-accent hover:text-white text-black font-bold py-3 px-8 rounded-lg transition-colors duration-300 ease-in-out-expo shadow-card hover:shadow-hover"
          >
            Get in Touch
          </a>
        </div>
      </section> */}
    </div>
  );
}

export default Home;