const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-white text-sm font-medium">
            © {currentYear} Boost Elix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
