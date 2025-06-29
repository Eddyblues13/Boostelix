import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Button from "../../components/Button";
import { loginSchema } from '../../utils/validation';

const LoginSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const APP_URL = import.meta.env.VITE_APP_BASE_URL;

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      // Validate form inputs
      await loginSchema.validate({ login, password }, { abortEarly: false });
      setIsLoading(true);

      // API request using Axios
      const response = await axios.post(`${APP_URL}/api/login`, {
        login: login.trim(),
        password
      });

      // Store token and user data
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));

      toast.success('Login successful!');
      navigate('/dashboard');

    } catch (err) {
      // Handle validation errors
      if (err.name === "ValidationError") {
        toast.error(err.inner[0].message);
      } 
      // Handle API errors
      else if (err.response) {
        const errorData = err.response.data;
        const errorMsg = errorData.message || 
                         (errorData.errors ? Object.values(errorData.errors).flat().join(' ') : 'Login failed');
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
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-gray-100">
        <form onSubmit={loginUser} className="space-y-6">
          {/* Login Field (email or username) */}
          <div>
            <label htmlFor="login" className="block text-sm font-semibold text-gray-700 mb-2">
              Email or Username
            </label>
            <input
              type="text"
              id="login"
              name="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
              placeholder="Enter your email or username"
              disabled={isLoading}
              autoComplete="username"
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
                autoComplete="current-password"
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
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
                Processing...
              </div>
            ) : "Sign in" }
          </Button>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-gray-600">Do not have an account? </span>
            <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginSection;