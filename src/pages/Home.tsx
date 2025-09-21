import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ReactLenis from 'lenis/react';
import { StickyCard_001 } from '../components/ui/skiper-ui/skiper16';

function Home() {
  // Create refs for sections that will be animated on scroll
  const highlightsRef = useRef(null);
  const servicesRef = useRef(null);
  const projectsRef = useRef(null);
  const processRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
const stickyContainer = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stickyContainer,
    offset: ["start start", "end end"],
  });

  const projects = [
    { title: "Swing", src: "/images/best-project-1.jpeg" },
    { title: "Gate", src: "/images/swing-1.jpeg" },
    { title: "Mandir", src: "/images/best-project-3.jpeg" },
    { title: "Mandir", src: "/images/best-project-4.jpeg" },
    // { title: "Mandir", src: "/images/mandir-shikhar-1.jpeg" },
    { title: "Mandir", src: "/images/gate-3.jpeg" },
  ];

  useEffect(() => {
    // Observer callback function
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          observer.unobserve(entry.target);
        }
      });
    };
  
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });
  
    if (highlightsRef.current) observer.observe(highlightsRef.current);
    if (servicesRef.current) observer.observe(servicesRef.current);
    if (projectsRef.current) observer.observe(projectsRef.current);
    if (processRef.current) observer.observe(processRef.current);
    if (testimonialsRef.current) observer.observe(testimonialsRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);
  
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
    <ReactLenis root>
      <div className="w-full">
      {/* Hero Section with Owner */}
      <motion.section 
        className="w-full py-16 px-4 sm:px-6 bg-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center justify-between gap-10">
          
          <motion.div 
            className="w-full md:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="group w-[300px] sm:w-[340px] md:w-[420px] h-[380px] sm:h-[440px] md:h-[520px] flex items-center justify-center overflow-hidden transform perspective-1000 relative">
              <img
                src="/images/owner-2.png"
                alt="Nilesh Panchal - Owner"
                className="w-full h-full object-cover object-top transition-transform duration-500 ease-in-out group-hover:-translate-z-20"
              />
            </div>
          </motion.div>

          <motion.div 
            className="w-full md:w-1/2 space-y-5 text-center md:text-left"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              New SB Engineering
            </motion.h1>
            <motion.h2 
              className="text-xl sm:text-2xl font-semibold text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Led by Nilesh R. Panchal
            </motion.h2>
            <motion.p 
              className="text-base sm:text-lg text-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              With over 20 years of experience, Nilesh Panchal and his team create custom metal fabrications
              that combine security, durability, and aesthetic appeal.
            </motion.p>
            <motion.p 
              className="italic text-gray-600 text-base sm:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              "My passion has always been creating functional art through metalwork. Every piece we create
              is designed to not only serve its purpose but to enhance the beauty of your home or business."
            </motion.p>
            <motion.div 
              className="flex flex-wrap justify-center md:justify-start gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <a
                href="/our-work"
                className="inline-block bg-black text-white hover:bg-gray-800 font-bold py-3 px-6 sm:px-8 rounded-full transition-colors duration-300 shadow-md"
              >
                View Our Work
              </a>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="w-full"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div ref={stickyContainer} className="relative bg-gray-100 flex w-full flex-col items-center justify-center pb-[100vh]">
          <div>
        <h2 className="text-3xl font-bold text-black text-center pt-10 -mb-20">Our Popular Projects</h2>

            {projects.map((project, i) => {
              const targetScale = Math.max(0.5, 1 - (projects.length - i - 1) * 0.1);
              return (
                <StickyCard_001
                  key={`p_${i}`}
                  i={i}
                  {...project}
                  progress={scrollYProgress}
                  range={[i * 0.25, 1]}
                  targetScale={targetScale}
                />
              );
            })}
          </div>
        </div>
      </motion.section>


      {/* Our Expertise Section */}
      <motion.section 
        className="w-full py-16 px-6 -mt-140 lg:-mt-100 bg-white relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-6xl mx-auto overflow-hidden">
          <motion.h2 
            className="text-3xl font-bold text-black mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Our Expertise
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-gray-100 p-8 rounded-lg shadow-card hover:shadow-hover transition-all duration-300 text-center group"
              initial={{ opacity: 0, x: -50, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="w-20 h-20 mx-auto mb-4 bg-black rounded-full flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </motion.div>
              <motion.h3 
                className="text-xl font-bold text-black mb-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                viewport={{ once: true }}
              >
                Custom Gates
              </motion.h3>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                viewport={{ once: true }}
              >
                Secure and elegant entrance gates designed to enhance your property's appearance while providing security.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-100 p-8 rounded-lg shadow-card hover:shadow-hover transition-all duration-300 text-center group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="w-20 h-20 mx-auto mb-4 bg-black rounded-full flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </motion.div>
              <motion.h3 
                className="text-xl font-bold text-black mb-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 }}
                viewport={{ once: true }}
              >
                Window Grills
              </motion.h3>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.0 }}
                viewport={{ once: true }}
              >
                Decorative and protective window grills that add character to your home while ensuring safety.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-100 p-8 rounded-lg shadow-card hover:shadow-hover transition-all duration-300 text-center group"
              initial={{ opacity: 0, x: 50, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="w-20 h-20 mx-auto mb-4 bg-black rounded-full flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </motion.div>
              <motion.h3 
                className="text-xl font-bold text-black mb-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.1 }}
                viewport={{ once: true }}
              >
                Railings
              </motion.h3>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.2 }}
                viewport={{ once: true }}
              >
                Stylish and sturdy railings for staircases, balconies, and terraces that combine safety with elegance.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Projects - with scroll animation */}
      {/* <section ref={projectsRef} className="w-full py-16 px-6 bg-gray-100 translate-y-10 transition-all duration-1000 ease-in-out-expo">
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
      </section> */}

<motion.section
        ref={highlightsRef}
        className="w-full py-16 bg-white overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-6xl mx-auto px-4 overflow-hidden">
          <h2 className="text-3xl font-bold text-center text-black mb-8">
            Highlights of Our Creations
          </h2>

          <div className="relative w-full overflow-hidden">
            <div className="flex animate-marquee space-x-8 w-max">
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
      </motion.section>

      {/* Process Section - with scroll animation */}
      <motion.section 
        ref={processRef} 
        className="w-full py-16 px-6 bg-white"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-black mb-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Our Process
          </motion.h2>
          <div className="relative overflow-hidden">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-400 transform -translate-x-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:text-right">
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="hidden md:block absolute right-0 top-6 w-6 h-6 rounded-full bg-black border-4 border-gray-200 transform translate-x-1/2"></div>
                  <div className="bg-gray-100 p-6 rounded-lg shadow-card">
                    <h3 className="text-xl font-bold text-black mb-2">1. Consultation</h3>
                    <p className="text-gray-600">
                      We begin with a detailed consultation to understand your needs, preferences, and the specific requirements of your project.
                    </p>
                  </div>
                </motion.div>
              </div>
              
              <div className="md:mt-32">
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="hidden md:block absolute left-0 top-6 w-6 h-6 rounded-full bg-black border-4 border-gray-200 transform -translate-x-1/2"></div>
                  <div className="bg-gray-100 p-6 rounded-lg shadow-card">
                    <h3 className="text-xl font-bold text-black mb-2">2. Design</h3>
                    <p className="text-gray-600">
                      Our designers create detailed plans and sketches, working closely with you to refine the design until it perfectly matches your vision.
                    </p>
                  </div>
                </motion.div>
              </div>
              
              <div className="md:text-right">
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  viewport={{ once: true }}
                >
                  <div className="hidden md:block absolute right-0 top-6 w-6 h-6 rounded-full bg-black border-4 border-gray-200 transform translate-x-1/2"></div>
                  <div className="bg-gray-100 p-6 rounded-lg shadow-card">
                    <h3 className="text-xl font-bold text-black mb-2">3. Fabrication</h3>
                    <p className="text-gray-600">
                      Our skilled craftsmen bring the designs to life in our workshop, using high-quality materials and precise techniques.
                    </p>
                  </div>
                </motion.div>
              </div>
              
              <div className="md:mt-32">
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  viewport={{ once: true }}
                >
                  <div className="hidden md:block absolute left-0 top-6 w-6 h-6 rounded-full bg-black border-4 border-gray-200 transform -translate-x-1/2"></div>
                  <div className="bg-gray-100 p-6 rounded-lg shadow-card">
                    <h3 className="text-xl font-bold text-black mb-2">4. Installation</h3>
                    <p className="text-gray-600">
                      Our professional team handles the installation with care and precision, ensuring a perfect fit and finish.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials - with scroll animation */}
      {/* <section ref={testimonialsRef} className="w-full py-16 px-6 bg-gray-100 opacity-0 translate-y-10 transition-all duration-1000 ease-in-out-expo">
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
      </section> */}

      {/* StickyCard Section */}
      {/* <section className="w-full">
        <div ref={stickyContainer} className="relative bg-gray-100 flex w-full flex-col items-center justify-center pb-[100vh]">
          <div>
        <h2 className="text-3xl font-bold text-black text-center pt-10 -mb-20">Our Featured Work</h2>

            {projects.map((project, i) => {
              const targetScale = Math.max(0.5, 1 - (projects.length - i - 1) * 0.1);
              return (
                <StickyCard_001
                  key={`p_${i}`}
                  i={i}
                  {...project}
                  progress={scrollYProgress}
                  range={[i * 0.25, 1]}
                  targetScale={targetScale}
                />
              );
            })}
          </div>
        </div>
      </section> */}

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
    </ReactLenis>
  );
}

export default Home;