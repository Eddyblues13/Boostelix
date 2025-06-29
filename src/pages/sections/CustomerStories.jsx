

const CustomerStories = () => {

   const testimonials = [
    {
      name: "Brian Delaney",
      quote:
        "When I just started my business, I didn't have a big budget and couldn't pay SMM agencies to work on my accounts. But finding this SMM panel solved this problem for good  now I can order any SMM services I want at such affordable prices!",
    },
    {
      name: "Maria Sousa",
      quote:
        "Hiring someone to manage my accounts wasn't something I could afford when I just started my business. But thankfully I found this panel and could order great services for cheap! Now I don't have to worry about finding ways to help my accounts grow.",
    },
    {
      name: "Deepak Puri",
      quote:
        "When I just started my business, I didn't have a big budget and couldn't pay SMM agencies to work on my accounts. But finding this SMM panel solved this problem for good  now I can order any SMM services I want at such affordable prices!",
    },
    {
      name: "David Romero",
      quote:
        "If you don't know how to get more exposure online while not spending a lot of money  you found the right place! These guys provide amazing SMM services that give super quick results and are incredibly cheap.",
    },
  ];

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl font-bold text-blue-700">Customer stories</h2>
          <p className="text-gray-600 mt-2">
            Check out some of our customers' success stories below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
              <p className="font-semibold text-blue-900">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



export default CustomerStories