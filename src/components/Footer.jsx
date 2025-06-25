const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Copyright Text */}
          <div className="text-center">
            <p className="text-blue-100 font-medium text-base">
              © {currentYear} Boost Elix. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;