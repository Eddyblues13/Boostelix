import React, { useState } from 'react';
import { Headphones, Award, DollarSign } from 'lucide-react';

const FeaturesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const features = [
    {
      icon: Headphones,
      title: "Dedicated Support",
      description: "Our top priority is customer satisfaction. That's why our support team is available Monday to Friday, 9 AM to 5 PM, to assist you with any questions or concerns. From technical issues to service inquiries, we're always here to help you stay on track."
    },
    {
      icon: Award,
      title: "High Quality Services",
      description: "We maintain a high standard across all our services thanks to our dedicated and experienced SMM Panel team. For services with a refill option, we offer timely refills in case of drops or interruptions. Our goal is to ensure consistent quality and lasting results for your social media growth."
    },
    {
      icon: DollarSign,
      title: "Low Price Guarantee",
      description: "smexploits.com is committed to offering the most affordable SMM services without compromising quality. Our Panel Pricing starts from a minimal amount, making us the cheapest SMM panel available."
    },
    {
      icon: Headphones,
      title: "24/7 Customer Care",
      description: "Round-the-clock customer support to ensure your business never stops growing. Our dedicated team is always ready to assist you with any challenges you might face."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.slice(currentSlide, currentSlide + 3).map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={currentSlide + index} className="bg-white rounded-3xl p-8 shadow-lg">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-blue-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
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