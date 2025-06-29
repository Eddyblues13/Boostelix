

import { LogIn, CreditCard, User, ShoppingCart } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="bg-white py-14 px-4 sm:px-6 lg:px-8">
      <h3 className="text-3xl text-center font-bold mb-4">How our panel works</h3>
      <p className="text-center text-gray-600 mb-12">
        Follow these 4 simple steps to get started on our panel and grow your business.
      </p>

      <div className="max-w-5xl mx-auto grid gap-8 sm:gap-10 md:grid-cols-2">

        {/* Step 1 */}
        <div className="flex items-start space-x-5">
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 rounded-full border-4 border-blue-500 flex items-center justify-center text-blue-600 shrink-0">
              <LogIn size={25} />
            </div>
            <span className="absolute -top-3 -right-3 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold">1</span>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-1">Register & log in</h4>
            <p className="text-gray-600">Start with creating a panel account and log in.</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start space-x-5">
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center text-green-600 shrink-0">
              <CreditCard size={25} />
            </div>
            <span className="absolute -top-3 -right-3 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold">2</span>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-1">Make a deposit</h4>
            <p className="text-gray-600">
              Add funds through a payment option that works best for you.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start space-x-5">
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 rounded-full border-4 border-purple-500 flex items-center justify-center text-purple-600 shrink-0">
              <User size={25} />
            </div>
            <span className="absolute -top-3 -right-3 bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold">3</span>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-1">Choose services</h4>
            <p className="text-gray-600">
              Select SMM services to help your business receive more publicity.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex items-start space-x-5">
          <div className="relative w-16 h-16">
            <div className="w-16 h-16 rounded-full border-4 border-red-500 flex items-center justify-center text-red-600 shrink-0">
              <ShoppingCart size={25} />
            </div>
            <span className="absolute -top-3 -right-3 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold">4</span>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-1">Great results</h4>
            <p className="text-gray-600">
              You will be satisfied with our SMM services when your order is ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;

 

