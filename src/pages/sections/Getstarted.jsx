import React from 'react';
import { Link } from 'react-router-dom';

const GetStarted = () => {
  return (
    <div className="bg-[#f0f9ff] py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center bg-white rounded-xl p-10 shadow-lg">
          <h4 className="text-3xl font-bold text-blue-900 mb-4">Ready To Grow Your Socials?</h4>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6">
            Boostelix.com gives you instant access to real social media growth.
            Whether you’re boosting a personal brand or running client campaigns, our panel offers fast, affordable services that get results with no stress and no guesswork.
          </p>
          <div className="flex justify-center">
            <Link
              to="/signup"
              className="bg-white text-blue-900 border border-blue-900 hover:bg-blue-900 hover:text-white transition-all duration-300 font-semibold px-6 py-3 rounded-full"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
