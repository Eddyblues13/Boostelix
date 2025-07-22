import { Sparkles } from 'lucide-react';
import LoginSection from "./LoginSection"; // Optional

const HomePage = () => {
  return (
    <section className="relative min-h-screen pt-35 sm:pt-37 md:pt-36 lg:pt-40 overflow-hidden flex items-center justify-center py-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-200 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-300 rounded-full opacity-15 blur-3xl animate-bounce-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-blue-400 rounded-full opacity-10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/2 w-56 h-56 bg-blue-200 rounded-full opacity-10 blur-3xl animate-bounce"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Section: Text Content */}
        <div className="text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2 sm:mb-3 md:mb-6">
            <Sparkles className="text-blue-900 w-8 h-8 animate-sparkle shrink-0 hidden sm:block" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
              Increase Your Social Media Presence
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 font-medium mb-8 max-w-2xl mx-auto lg:mx-0">
            To grow your social media fast, quality service is key. Smexploits.com offers top services for platforms like YouTube, Instagram, TikTok, Facebook, Twitter, Telegram, Spotify, and more.
          </p>
          <div className="flex justify-center lg:justify-start">
            <button className="px-8 py-4 bg-blue-900 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-blue-950 transition-all duration-300 transform hover:scale-105 flex items-center">
              See All Services
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Section: Illustration Image */}
        <div className="relative flex justify-center items-center p-8">
          <img
            src="/social-home.svg"
            alt="Social Media Growth Illustration"
            className="max-w-full h-auto rounded-lg transform hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        </div>
      </div>

      {/* Optional login section */}
      {/* <LoginSection /> */}
    </section>
  );
};

export default HomePage;
