import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is the purpose of SMM panels?",
    answer: "SMM panel is an online shop where you can find various SMM services.",
  },
  {
    question: "What types of SMM services do you offer here?",
    answer: "On our panel you can find different types of SMM services, such as views, followers, likes, etc.",
  },
  {
    question: "Is it safe to buy your SMM services?",
    answer: "Yes, of course, It is safe to buy our SMM services, your accounts won't be banned.",
  },
  {
    question: "What are mass orders for?",
    answer: "The mass order option makes it easy to place several orders with different links at the same time.",
  },
  {
    question: 'What does "Drip-feed" mean?',
    answer: 'Drip-feed allows you to build engagement on your account at your preferred speed. For example, instead of receiving 1000 likes instantly, you can get 100/day for 10 days.',
  },
  {
    question: "Mass orders — what are they?",
    answer: "A mass order is a feature that helps users place multiple orders with different links at the same time.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">Popular Questions</h2>
        <p className="text-gray-600 mb-10">
          See below to get answers to some of the most frequently asked questions on our panel.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg shadow-md cursor-pointer"
            onClick={() => toggleIndex(index)}
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-800">{faq.question}</p>
              {openIndex === index ? (
                <ChevronUp className="text-blue-600" />
              ) : (
                <ChevronDown className="text-blue-600" />
              )}
            </div>
            {openIndex === index && (
              <div className="mt-3 text-gray-600 text-sm">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
