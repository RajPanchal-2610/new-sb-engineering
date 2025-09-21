function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-4 text-center w-full">
      <div className="container mx-auto">
        <p>© {new Date().getFullYear()} New SB Engineering. All rights reserved.</p>
        <div className="mt-2 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
          <span className="hover:text-accent">📞 +91 98765 43210</span>
          <span className="hover:text-accent">📍 123 Industrial Area, Gujarat, India</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;