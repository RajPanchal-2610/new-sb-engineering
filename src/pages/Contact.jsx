function Contact() {
  return (
    <div className="w-full bg-light-blue p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-navy mb-4 page-title">Contact Us</h1>
        
        {/* Get In Touch Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold text-medium-blue mb-2">Get In Touch</h2>
          <p className="text-dark-blue mb-4">
            We'd love to hear from you. Please fill out the form below or use our contact information.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-medium-blue mb-2">Contact Information</h3>
              <p className="text-dark-blue mb-1">Phone: +1 (123) 456-7890</p>
              <p className="text-dark-blue mb-1">Email: info@sbengineering.com</p>
              <p className="text-dark-blue mb-4">Address: 123 Workshop Street, Engineering City</p>
              
              <h3 className="text-xl font-semibold text-medium-blue mb-2">Business Hours</h3>
              <p className="text-dark-blue mb-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p className="text-dark-blue mb-1">Saturday: 10:00 AM - 4:00 PM</p>
              <p className="text-dark-blue">Sunday: Closed</p>
            </div>
            
            {/* Contact Form */}
            <div>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-medium-blue mb-1">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full p-2 border border-medium-blue rounded-md focus:outline-none focus:ring-2 focus:ring-navy"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-medium-blue mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full p-2 border border-medium-blue rounded-md focus:outline-none focus:ring-2 focus:ring-navy"
                    placeholder="Your Email"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-medium-blue mb-1">Phone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full p-2 border border-medium-blue rounded-md focus:outline-none focus:ring-2 focus:ring-navy"
                    placeholder="Your Phone Number"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-medium-blue mb-1">Message</label>
                  <textarea 
                    id="message" 
                    rows="4" 
                    className="w-full p-2 border border-medium-blue rounded-md focus:outline-none focus:ring-2 focus:ring-navy"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="bg-navy hover:bg-medium-blue text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Map Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-bold text-medium-blue mb-4">Our Location</h2>
          <div className="w-full h-80 bg-light-blue rounded-lg overflow-hidden">
            {/* Replace with actual map or iframe */}
            <div className="w-full h-full flex items-center justify-center bg-medium-blue bg-opacity-20">
              <p className="text-navy font-semibold">
                Map will be displayed here. Replace with Google Maps iframe or other map service.
              </p>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-medium-blue mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-dark-blue mb-1">How long does a typical project take?</h3>
              <p className="text-medium-blue">
                Project timelines vary depending on complexity and scope. Simple installations may take 1-2 weeks, 
                while custom designs can take 3-6 weeks from consultation to installation.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-dark-blue mb-1">Do you offer warranties on your products?</h3>
              <p className="text-medium-blue">
                Yes, all our products come with a 5-year warranty on craftsmanship and materials. 
                We stand behind the quality of our work.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-dark-blue mb-1">Can you match existing designs or styles?</h3>
              <p className="text-medium-blue">
                Absolutely! Our team is skilled at creating designs that complement your existing architecture 
                and aesthetic. We can work from photos or on-site measurements.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-dark-blue mb-1">Do you provide installation services?</h3>
              <p className="text-medium-blue">
                Yes, we provide professional installation for all our products. Our installation team ensures 
                that everything is properly fitted and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
