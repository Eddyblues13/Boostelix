import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import Button from "../../components/Button";
import { signupSchema } from '../../utils/validation';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const APP_URL = import.meta.env.VITE_APP_BASE_URL;

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      // Validate form inputs
      await signupSchema.validate({ 
        username, 
        email, 
        firstname, 
        lastname, 
        password, 
        confirmPassword 
      }, { abortEarly: false });

      setIsLoading(true);

      // API request using Axios
      const response = await axios.post(`${APP_URL}/register`, {
        username: username.trim(),
        email: email.trim(),
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        password,
        password_confirmation: confirmPassword // Laravel expects this naming
      });
      console.log(response);

      // Handle successful registration
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));

      toast.success('Account created successfully!');
      navigate('/dashboard'); // Redirect to protected route

    } catch (err) {
      // Handle validation errors
      if (err.name === "ValidationError") {
        toast.error(err.inner[0].message);
      } 
      // Handle API errors
      else if (err.response) {
        const errorData = err.response.data;
        const errorMsg = errorData.message || 
                         (errorData.errors ? Object.values(errorData.errors).flat().join(' ') : 'Registration failed');
        toast.error(errorMsg);
      } 
      // Handle network errors
      else {
        toast.error(err.message || "Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto my-12">
      <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-gray-100">
        <form onSubmit={registerUser} className="space-y-6">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              name="username"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter your username"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter your Email"
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          {/* First Name Field */}
          <div>
            <label htmlFor="first_name" className="block text-sm font-semibold text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              name="first_name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter your First Name"
              disabled={isLoading}
              autoComplete="given-name"
            />
          </div>

          {/* Last Name Field */}
          <div>
            <label htmlFor="last_name" className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              name="last_name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter your Last Name"
              disabled={isLoading}
              autoComplete="family-name"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                name="confirmPassword"
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Confirm your password"
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <Button 
            type="submit" 
            disabled={isLoading}
            className={`w-full ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            { isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </div>
            ) : "Sign Up" }
          </Button>

          {/* Sign In Link */}
          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;