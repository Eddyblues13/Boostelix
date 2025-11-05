import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import axios from 'axios';
import { loginSchema } from '../../utils/validation';
import ReCAPTCHA from 'react-google-recaptcha';

const LoginSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

  const navigate = useNavigate();
  const APP_URL = import.meta.env.VITE_APP_BASE_URL;
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Validate fields
      await loginSchema.validate({ login, password }, { abortEarly: false });

      // 2️⃣ Check captcha
      if (!captchaToken) {
        toast.error("Please complete the reCAPTCHA verification.");
        return;
      }

      setIsLoading(true);

      // 3️⃣ Send login + captcha token to Laravel backend
      const response = await axios.post(`${APP_URL}/login`, {
        login: login.trim(),
        password,
        "g-recaptcha-response": captchaToken,
      });

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      if (err.name === "ValidationError") {
        toast.error(err.inner[0].message);
      } else if (err.response) {
        const errorData = err.response.data;
        const errorMsg =
          errorData.message ||
          (errorData.errors ? Object.values(errorData.errors).flat().join(' ') : 'Login failed');
        toast.error(errorMsg);
      } else {
        toast.error(err.message || "Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="login-section" className="bg-[#f0f9ff] flex items-start justify-center pt-4 p-2">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md lg:max-w-6xl">
        <h1 className="text-2xl font-bold text-blue-900 mb-4 text-left">
          Login to your account
        </h1>

        <form onSubmit={loginUser} className="space-y-4">
          {/* Username and Password Fields */}
          <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
            <div className="relative flex-1">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
                <div className="bg-blue-900 rounded-full p-2 mr-3">
                  <User className="w-5 h-5 text-white" />
                </div>
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
                  placeholder="Username"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="relative flex-1">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
                <div className="bg-blue-900 rounded-full p-2 mr-3">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ✅ ReCAPTCHA here */}
          <div className="flex justify-center mt-4">
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={setCaptchaToken}
              onExpired={() => setCaptchaToken(null)}
            />
          </div>

          {/* Remember Me + Forgot Password + Sign In */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
            <div className="flex items-center justify-between text-sm lg:flex-1">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setRememberMe(!rememberMe)}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-500 mr-2"
                  disabled={isLoading}
                />
                <span className="text-gray-700">Remember me</span>
              </div>

              <button
                type="button"
                className="text-blue-900 hover:text-blue-950 font-medium"
                onClick={() => console.log('Forgot password clicked')}
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full lg:w-auto lg:px-8 bg-blue-900 hover:bg-blue-950 text-white font-semibold py-4 px-6 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Sign Up */}
          <div className="text-center text-sm">
            <span className="text-gray-600">Do not have an account? </span>
            <Link to="/signup" className="text-blue-900 hover:text-blue-950 font-semibold">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginSection;
