import { Sparkles } from 'lucide-react';
import LoginSection from "./LoginSection";
import Whyeffective from '../sections/why';
import HomeFeatures from '../sections/features';
import Reason from '../sections/reason';
import HowItWorks from '../sections/how';
import { Link } from 'react-router-dom';
import { Features } from 'tailwindcss';
import CustomerStories from '../sections/CustomerStories';
import FAQ from '../sections/Faq';
import BeginnerVideo from '../sections/BeginnerVideo';


const HomePage = () => {
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
            <h1 className="text-2xl md:text-6xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
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

        <LoginSection />
         {/* Beginner Video Guide */}
  
     
    {/* Features Block */}

     <BeginnerVideo/>
    <HomeFeatures/>

    {/* Get Started Call to Action */}
    <div className="mt-16 text-center bg-blue-50 p-10 rounded-lg shadow">
      <h4 className="text-blue-700 text-2xl font-bold mb-6">READY TO GET STARTED?</h4>
      <Link to ="/signup"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Get Started Now
      </Link>

      {/* WHY IS SOCIAL MEDIA MARKETING SO EFFECTIVE? */}
<Whyeffective/>

    </div>
  </div>

<Reason/>
<HowItWorks/>
<CustomerStories/>
<FAQ/>
  
      
    </section>
  );
};

export default HomePage;