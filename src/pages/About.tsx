import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}</span>;
}

function About() {
  return (
    <>
      <Helmet>
        <title>About Us - New SB Engineering | 20+ Years of Metal Fabrication Excellence</title>
        <meta name="description" content="Learn about New SB Engineering's 20+ years of experience in custom metal fabrication. Our story, mission, values, and commitment to quality craftsmanship." />
        <meta name="keywords" content="about New SB Engineering, metal fabrication company, engineering experience, quality craftsmanship, company history, mission values" />
        <meta property="og:title" content="About Us - New SB Engineering | 20+ Years of Excellence" />
        <meta property="og:description" content="Discover our story, mission, and 20+ years of experience in custom metal fabrication and engineering solutions." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://newsbengineering.netlify.app/about" />
      </Helmet>
      
      <div className="w-full bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold text-gray-900 text-center py-5"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About Us
        </motion.h1>
        
        {/* Our Story Section */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-card mb-6"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Our Story</h2>
          <p className="text-gray-900 mb-4">
            New SB Engineering was founded in 2010 with a vision to provide high-quality 
            fabrication services. Over the years, we have grown to become a trusted name 
            in the industry, known for our commitment to excellence and customer satisfaction.
          </p>
          <p className="text-gray-900">
            Our team of experienced engineers and craftsmen work together to deliver 
            products that not only meet but exceed our customers' expectations.
          </p>
        </motion.div>
        
        {/* Our Mission Section */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-card mb-6"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Our Mission</h2>
          <p className="text-gray-900">
            To provide innovative and high-quality fabrication solutions that enhance 
            the security and aesthetics of our customers' properties while maintaining 
            the highest standards of craftsmanship and customer service.
          </p>
        </motion.div>
        
        {/* Our Team Section */}
        {/* <div className="bg-white p-6 rounded-lg shadow-card mb-6">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="text-center">
              <img 
                src="https://randomuser.me/api/portraits/men/75.jpg" 
                alt="Team Member" 
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-600"
              />
              <h3 className="text-xl font-bold text-gray-900">Robert Johnson</h3>
              <p className="text-gray-600">Founder & CEO</p>
              <p className="text-gray-900 mt-2">
                With over 20 years of experience in metal fabrication, Robert leads our team with passion and expertise.
              </p>
            </div>
            <div className="text-center">
              <img 
                src="https://randomuser.me/api/portraits/women/65.jpg" 
                alt="Team Member" 
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-600"
              />
              <h3 className="text-xl font-bold text-gray-900">Emily Chen</h3>
              <p className="text-gray-600">Lead Designer</p>
              <p className="text-gray-900 mt-2">
                Emily brings creativity and technical expertise to every design, ensuring both beauty and functionality.
              </p>
            </div>
            <div className="text-center">
              <img 
                src="https://randomuser.me/api/portraits/men/36.jpg" 
                alt="Team Member" 
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-600"
              />
              <h3 className="text-xl font-bold text-gray-900">Michael Torres</h3>
              <p className="text-gray-600">Production Manager</p>
              <p className="text-gray-900 mt-2">
                Michael oversees our production process, ensuring quality and timely delivery of all projects.
              </p>
            </div>
          </div>
        </div> */}
        
        {/* Our Values Section */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-card mb-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <motion.div 
              className="flex items-start"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-600 rounded-full p-2 mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Quality</h3>
                <p className="text-gray-900">
                  We never compromise on quality. Every product we create is built to last, using the finest materials and craftsmanship.
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-start"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-600 rounded-full p-2 mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Innovation</h3>
                <p className="text-gray-900">
                  We constantly seek new techniques and designs to provide our customers with cutting-edge solutions.
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-start"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-600 rounded-full p-2 mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Integrity</h3>
                <p className="text-gray-900">
                  We conduct our business with honesty and transparency, building trust with our customers and partners.
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="flex items-start"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-600 rounded-full p-2 mr-4 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Customer Focus</h3>
                <p className="text-gray-900">
                  Our customers' satisfaction is our priority. We listen to their needs and work to exceed their expectations.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Our Achievements Section */}
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-card"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Our Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={500} />+
              </div>
              <p className="text-gray-900">Projects Completed</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={95} />%
              </div>
              <p className="text-gray-900">Customer Satisfaction</p>
            </motion.div>
            {/* <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={12} />
              </div>
              <p className="text-gray-900">Industry Awards</p>
            </motion.div> */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl font-bold text-gray-900 mb-2">
                <AnimatedCounter end={20} />+
              </div>
              <p className="text-gray-900">Years of Experience</p>
            </motion.div>
          </div>
        </motion.div>
        </div>
      </div>
    </>
  );
}

export default About;