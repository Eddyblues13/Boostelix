import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSection = () => {
  return (
    <div className="bg-white">
      {/* Payment Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-12 bg-[#f0f9ff]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-blue-900 text-lg font-semibold mb-2">We Accept</div>
          <h3 className="text-3xl font-bold text-blue-900 mb-4">Multiple Payment Methods</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            You can easily fund your account using any of our secure payment providers. From bank
            transfers to card payments and even cryptocurrency, we’ve got you covered wherever you are in
            the world.
          </p>
          <div className="mt-10">
            <img
              src="https://i.23robo.info/projects/smexploits/img/kora_payment.webp"
              alt="Payment Methods"
              className="mx-auto w-full max-w-4xl rounded-lg shadow-md"
            />
          </div>
        </div>
      </section>


    </div>
  );
};

export default PaymentSection;
