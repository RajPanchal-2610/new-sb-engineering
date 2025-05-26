function Footer() {
  return (
    <footer className="bg-dark-blue text-white p-4 text-center w-full">
      <div className="container mx-auto">
        <p>© {new Date().getFullYear()} New SB Engineering. All rights reserved.</p>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="#" className="hover:text-light-blue">Privacy Policy</a>
          <a href="#" className="hover:text-light-blue">Terms of Service</a>
          <a href="#" className="hover:text-light-blue">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

