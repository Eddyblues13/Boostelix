import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import Button from "../../components/Button";
import { loginSchema } from '../../utils/validation';

const LoginSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();

    try{
      await loginSchema.validate({ username, password }, { abortEarly: false });
      setIsLoading(true);

      //consume login endpoint here
    }
    catch(err){
      if(err.name === "ValidationError" && err.inner.length > 0){
        toast.error(err.inner[0].message);
      } else{
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <>
     {/* Login Card */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-gray-100">
            <form onSubmit={loginUser} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  onChange={(e)=>setUsername(e.target.value)}
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
                    onChange={(e)=>setPassword(e.target.value)}
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
              <Button type="submit" disabled={isLoading}>
                { isLoading ? "Processing..." : "Sign in" }
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
    </>

  )
}

export default LoginSection