import { useState } from 'react';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import Button from "../../components/Button";

const HomePage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-blue-400 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full opacity-10 blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        {/* Hero Title */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="text-blue-600 w-8 h-8 mr-3 animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
              BOOST YOUR SOCIAL MEDIA MARKETING!
            </h1>
            <Sparkles className="text-blue-600 w-8 h-8 ml-3 animate-pulse" />
          </div>
          <p className="text-xl md:text-2xl text-gray-700 font-medium mb-8 max-w-4xl mx-auto">
            The most powerful social media marketing tool you can find.
          </p>
        </div>

        {/* Service Description */}
        <div className="mb-12 max-w-5xl mx-auto">
          <p className="text-blue-700 font-semibold text-lg mb-4">
            Boost Elix is a Cheap SMM and SEO service Provider.
          </p>
          <p className="text-gray-600 text-base leading-relaxed">
            Fast, Reliable and Secure, offering World Best Quality and Cheapest Automatic Social Media Services 
            which is specially developed for Resellers with High Speed order completion and amazingly cheap prices!
          </p>
        </div>

        {/* Login Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-gray-100">
            <form className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter your username"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <Button type="submit">
                Sign in
              </Button>

              {/* Sign Up Link */}
              <div className="text-center">
                <span className="text-gray-600">Do not have an account? </span>
                <a href="/signup" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
                  Sign up
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;