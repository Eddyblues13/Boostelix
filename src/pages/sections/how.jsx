import React, { useState } from 'react';

const steps = [
  {
    number: '01',
    title: 'Register An Account',
    desc: 'To begin with, you need to create an account and log in.',
  },
  {
    number: '02',
    title: 'Add Funds',
    desc: 'Choose a preferred payment method and fund your wallet to start placing orders.',
  },
  {
    number: '03',
    title: 'Order a Service',
    desc: 'Choose the SMM services you want and easily place your orders.',
  },
  {
    number: '04',
    title: 'Enjoy Great Result',
    desc: "We'll inform you when your order is ready, then you can enjoy great results.",
  },
];

const HowItWorks = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
        {/* Left: Image + Intro */}
        <div>
          <h3 className="text-3xl font-bold text-blue-900 mb-4">How it works?</h3>
          <p className="text-gray-700 mb-6">
            Check out the step-by-step tutorial on how to get started on our SMM panel.
          </p>
          <div className="relative w-full max-w-md rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://i.23robo.info/projects/smexploits/img/how-work-img.webp"
              alt="How it works"
              className="w-full"
            />
            <button
              onClick={() => setShowModal(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition duration-300"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition transform">
                <svg className="w-6 h-6 text-blue-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Right: Steps in Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-[#f0f9ff] border border-blue-100 rounded-2xl p-6 shadow hover:shadow-md hover:scale-[1.02] transition duration-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-blue-900 text-white w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold">
                  {step.number}
                </div>
                <h5 className="text-lg font-semibold text-blue-900">{step.title}</h5>
              </div>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg overflow-hidden w-full max-w-3xl shadow-xl">
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/ggCXWAJ1gRA?autoplay=1"
                title="YouTube video"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
            <div className="text-right p-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-950 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HowItWorks;
