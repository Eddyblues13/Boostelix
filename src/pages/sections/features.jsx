import React, { useState } from 'react';
import { Headphones, Award, DollarSign, MessageCircle } from 'lucide-react';

const FeaturesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const features = [
    {
      icon: "headphones",
      title: "Dedicated Support",
      description: "Our top priority is customer satisfaction. That's why our support team is available Monday to Friday, 9 AM to 5 PM, to assist you with any questions or concerns. From technical issues to service inquiries, we're always here to help you stay on track."
    },
    {
      icon: "certificate",
      title: "High Quality Services",
      description: "We maintain a high standard across all our services thanks to our dedicated and experienced SMM Panel team. For services with a refill option, we offer timely refills in case of drops or interruptions. Our goal is to ensure consistent quality and lasting results for your social media growth."
    },
    {
      icon: "coins",
      title: "Low Price Guarantee",
      description: "Boostelix is committed to offering the most affordable SMM services without compromising quality. Our Panel Pricing starts from a minimal amount, making us the cheapest SMM panel available."
    },
    {
      icon: "support",
      title: "24/7 Customer Care",
      description: "Round-the-clock customer support to ensure your business never stops growing. Our dedicated team is always ready to assist you with any challenges you might face."
    }
  ];

  const renderIcon = (iconType) => {
    switch(iconType) {
      case "headphones":
        return (
          <svg className="w-10 h-10 text-white" viewBox="0 0 64 64" fill="currentColor">
            <path d="M32 8C20.954 8 12 16.954 12 28v8c0 4.418 3.582 8 8 8h4c2.209 0 4-1.791 4-4V28c0-2.209-1.791-4-4-4h-4c-1.105 0-2 .895-2 2v10c0 .553.447 1 1 1s1-.447 1-1V26h4c1.105 0 2 .895 2 2v12c0 1.105-.895 2-2 2h-4c-3.314 0-6-2.686-6-6v-8c0-9.941 8.059-18 18-18s18 8.059 18 18v8c0 3.314-2.686 6-6 6h-4c-1.105 0-2-.895-2-2V28c0-1.105.895-2 2-2h4c.553 0 1-.447 1-1s-.447-1-1-1h-4c-2.209 0-4 1.791-4 4v12c0 2.209 1.791 4 4 4h4c4.418 0 8-3.582 8-8v-8c0-11.046-8.954-20-20-20z"/>
          </svg>
        );
      case "certificate":
        return (
          <svg className="w-10 h-10 text-white" viewBox="0 0 64 64" fill="currentColor">
            <path d="M50 14H14c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h12l6 8 6-8h12c2.21 0 4-1.79 4-4V18c0-2.21-1.79-4-4-4zm0 28H36l-4 5.33L28 42H14V18h36v24z"/>
            <circle cx="32" cy="30" r="8"/>
            <path d="M32 26l2.4 4.8 5.6.8-4 3.9.9 5.5-5-2.6-5 2.6.9-5.5-4-3.9 5.6-.8z"/>
          </svg>
        );
      case "coins":
        return (
          <svg className="w-10 h-10 text-white" viewBox="0 0 64 64" fill="currentColor">
            <circle cx="24" cy="24" r="12" opacity="0.8"/>
            <circle cx="40" cy="32" r="12"/>
            <path d="M40 26v12m-6-6h12"/>
            <path d="M24 18v12m-6-6h12" opacity="0.8"/>
          </svg>
        );
      case "support":
        return (
          <svg className="w-10 h-10 text-white" viewBox="0 0 64 64" fill="currentColor">
            <circle cx="32" cy="20" r="8"/>
            <path d="M16 52c0-8.837 7.163-16 16-16s16 7.163 16 16"/>
            <path d="M32 36v8"/>
            <circle cx="32" cy="48" r="2"/>
          </svg>
        );
      default:
        return <MessageCircle className="w-10 h-10 text-white" />;
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="bg-gradient-to-b from-[#f0f9ff] to-white text-center px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-12">
          With Our Features You Can Get:
        </h2>
        
        {/* Slider Container */}
        <div className="relative overflow-hidden">
          {/* Mobile View - One card per slide */}
          <div className="md:hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {features.map((feature, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-3xl p-6 shadow-lg max-w-sm mx-auto">
                    <div className="mb-6">
                      <div className="w-16 h-16 mx-auto bg-blue-900 rounded-full flex items-center justify-center mb-4">
                        {renderIcon(feature.icon)}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-blue-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop View - Three cards per slide */}
          <div className="hidden md:block">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {features.map((feature, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-3 gap-8 px-4">
                    {/* Show 3 cards per slide, cycling through features */}
                    {[0, 1, 2].map((offset) => {
                      const featureIndex = (index + offset) % features.length;
                      const currentFeature = features[featureIndex];
                      return (
                        <div key={featureIndex} className="bg-white rounded-3xl p-8 shadow-lg">
                          <div className="mb-6">
                            <div className="w-20 h-20 mx-auto bg-blue-900 rounded-full flex items-center justify-center mb-4">
                              {renderIcon(currentFeature.icon)}
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-blue-900 mb-4">
                            {currentFeature.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {currentFeature.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-12 space-x-3">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentSlide ? 'bg-blue-900' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>

    
  );
};

export default FeaturesSection;