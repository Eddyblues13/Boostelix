import { useEffect, useState } from "react";
import { Search, Filter, Info, Sparkles, Eye, Clock } from "lucide-react";
import { fetchAllSmmServices } from "../../services/services";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetchAllSmmServices();
        if (response?.data?.success && Array.isArray(response.data.data)) {
          setServices(response.data.data);
        } else {
          console.warn("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Caught error in loadServices:", error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const filteredServices = services.filter((service) =>
    searchTerm
      ? service.service_title?.toLowerCase().includes(searchTerm.toLowerCase())
      : true
  );

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-200 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-300 rounded-full opacity-15 blur-3xl animate-bounce-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-blue-400 rounded-full opacity-10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/2 w-56 h-56 bg-blue-200 rounded-full opacity-10 blur-3xl animate-bounce"></div>
      </div>

      <div className="relative z-10 pt-20 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="text-blue-900 w-8 h-8 animate-sparkle" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
              Our Services
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-700 font-medium max-w-3xl mx-auto leading-relaxed">
            It is a long established fact that a reader will be distracted by the readable content page when looking at its layout. The point of using Lorem Ipsum is that it has a more less normal distribution of letters
          </p>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 lg:contents">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center justify-center gap-3 bg-blue-900 text-white px-6 py-4 rounded-full shadow-lg hover:bg-blue-950 transition-all duration-300 transform hover:scale-105 font-semibold min-w-0 flex-1 sm:flex-initial"
            >
              <Filter className="w-5 h-5" />
              Filter
            </button>

            <div className="relative flex-1 sm:flex-initial">
              <select 
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="appearance-none w-full bg-blue-900 text-white px-6 py-4 pr-12 rounded-full border-none outline-none font-semibold cursor-pointer hover:bg-blue-950 transition-all duration-300 shadow-lg"
              >
                <option value="NGN">NGN ₦</option>
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pr-16 rounded-full border-2 border-gray-200 focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/20 transition-all duration-300 font-medium shadow-lg"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-900 text-white p-3 rounded-full hover:bg-blue-950 transition-all duration-300 transform hover:scale-105 shadow-lg">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-2xl mb-6">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 font-bold text-sm">
                <div className="col-span-1 flex items-center">ID</div>
                <div className="col-span-3 flex items-center">Service</div>
                <div className="col-span-2 flex items-center">Rate Per 1000</div>
                <div className="col-span-1 flex items-center">Min Order</div>
                <div className="col-span-1 flex items-center">Max Order</div>
                <div className="col-span-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Average Time
                  <Info className="w-4 h-4 opacity-70" />
                </div>
                <div className="col-span-2 flex items-center">Actions</div>
              </div>
            </div>

            {loading ? (
              <div className="text-center text-blue-900 font-semibold py-10">
                Loading services...
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.length === 0 ? (
                  <div className="text-center text-gray-500 font-medium py-10">
                    No services found matching your search.
                  </div>
                ) : (
                  filteredServices.map((service) => (
                    <div 
                      key={service.id}
                      className="bg-white/80 border border-gray-200 rounded-2xl hover:bg-blue-50/50 transition-all duration-300"
                    >
                      <div className="grid grid-cols-12 gap-4 px-6 py-5">
                        <div className="col-span-1 flex items-center">
                          <span className="text-blue-900 font-bold text-lg">{service.id}</span>
                        </div>
                        <div className="col-span-3 flex flex-col justify-center">
                          <div className="text-gray-800 font-semibold text-sm leading-relaxed mb-1">
                            {service.service_title}
                          </div>
                          {service.featured && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                ⚡ Featured
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="col-span-2 flex items-center">
                          <span className="text-blue-900 font-bold text-lg">{service.rate_per_1000}</span>
                        </div>
                        <div className="col-span-1 flex items-center">
                          <span className="text-gray-700 font-medium">{service.min_amount}</span>
                        </div>
                        <div className="col-span-1 flex items-center">
                          <span className="text-gray-700 font-medium">{service.max_amount}</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-900 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">{service.average_time}</span>
                        </div>
                        <div className="col-span-2 flex items-center">
                          <button className="bg-gradient-to-r from-green-400 to-green-500 text-white px-6 py-3 rounded-full hover:from-green-500 hover:to-green-600 transition-all duration-300 font-semibold text-sm flex items-center gap-2 whitespace-nowrap">
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes sparkle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.1); }
          50% { transform: rotate(180deg) scale(1); }
          75% { transform: rotate(270deg) scale(1.1); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }

        .animate-sparkle {
          animation: sparkle 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default ServicesPage;
