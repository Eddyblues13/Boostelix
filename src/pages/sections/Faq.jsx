import React, { useState } from 'react';

const faqData = [
  {
    question: 'What is Boostelix.com?',
    answer:
      'Boostelix.com is a social media marketing (SMM) panel where you can buy real engagement services like followers, likes, views, and more for platforms like Instagram, TikTok, YouTube, and others.',
  },
  {
    question: 'How does SMM panel works?',
    answer:
      'An SMM panel connects you to automated marketing services. You select a service (e.g., Instagram followers), enter details, and the panel delivers it using APIs from service providers.',
  },
  {
    question: 'How to find a best SMM panel?',
    answer:
      'Look for a panel that is fast, affordable, has reliable support, real user reviews, and offers regular updates, like Smexploits.',
  },
  {
    question: 'How to earn money from a panel?',
    answer:
      'You can resell SMM services by creating your own panel (or child panel), setting your own prices, and keeping the profit margin.',
  },
  {
    question: 'What is a child panel?',
    answer:
      'A child panel is a mini version of a main SMM panel. It’s fully branded with your own name and pricing but powered by the main provider’s services.',
  },
  {
    question: 'How does a child panel work?',
    answer:
      'You buy a child panel from a main provider, set your pricing, and resell their services under your own brand. You manage users and payments while the main panel handles order delivery.',
  },
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="bg-[#f0f9ff] py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <h4 className="text-3xl font-bold text-center text-blue-900 mb-10">
          Frequently Asked Questions
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-blue-100 rounded-lg shadow-sm hover:shadow-md transition duration-300"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
              >
                <span className="text-blue-900 font-semibold">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-blue-900 transition-transform duration-300 ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeIndex === index && (
                <div className="px-6 pb-4 text-gray-700 text-sm">
                  <span className="font-bold text-blue-900">Ans:</span> {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
