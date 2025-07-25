import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMenu, IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Sign In", path: "/signin" },
  { name: "API", path: "/api" },
  { name: "Services", path: "/services" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#f0f9ff]/90 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold text-blue-900 tracking-tight"
        >
          Boostelix
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 ml-auto">
          {navLinks.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              className="text-gray-700 hover:text-blue-900 text-lg font-medium transition-colors duration-200"
            >
              {name}
            </Link>
          ))}
          <Link
            to="/signup"
            className="ml-4 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-950 transition duration-300 font-semibold text-sm"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-800 text-3xl focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <IoClose /> : <IoMenu />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#f0f9ff] px-6 py-6 space-y-4 shadow-lg"
          >
            {[...navLinks, { name: "Sign Up", path: "/signup" }].map(
              ({ name, path }) => (
                <Link
                  key={name}
                  to={path}
                  onClick={closeMenu}
                  className={`block text-base font-medium transition duration-200 ${
                    name === "Sign Up"
                      ? "bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-950"
                      : "text-gray-800 hover:text-blue-900"
                  }`}
                >
                  {name}
                </Link>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
