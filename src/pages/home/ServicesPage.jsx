import { useEffect, useState, useRef } from "react";
import { Search, Filter, Info, Sparkles, Eye, Clock } from "lucide-react";
import { fetchAllSmmServices, fetchCurrencies } from "../../services/services";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [symbols, setSymbols] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("NGN");
  const [loading, setLoading] = useState(true);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesRes, currencyRes] = await Promise.all([
          fetchAllSmmServices(),
          fetchCurrencies(),
        ]);

        if (servicesRes?.data?.success && Array.isArray(servicesRes.data.data)) {
          setServices(servicesRes.data.data);
          setFilteredServices(servicesRes.data.data);
        }

        if (currencyRes?.data?.success && Array.isArray(currencyRes.data.currencies)) {
          setCurrencies(currencyRes.data.currencies);
          const ratesObj = {};
          const symbolsObj = {};
          currencyRes.data.currencies.forEach((curr) => {
            ratesObj[curr.code] = curr.rate;
            symbolsObj[curr.code] = curr.symbol || ""; // Backend should return symbol
          });
          setExchangeRates(ratesObj);
          setSymbols(symbolsObj);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Debounce search
  useEffect(() => {
    if (!loading) {
      const handler = setTimeout(() => {
        const newFilteredServices = services.filter((service) =>
          service.service_title?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredServices(newFilteredServices);
      }, 500);

      return () => clearTimeout(handler);
    }
  }, [searchTerm, services, loading]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCurrencySelect = (code) => {
    setSelectedCurrency(code);
    setCurrencyDropdownOpen(false);
  };

  const getConvertedRate = (ratePer1000USD) => {
    if (!exchangeRates[selectedCurrency]) return ratePer1000USD;
    return (ratePer1000USD * exchangeRates[selectedCurrency]).toFixed(2);
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-200 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-300 rounded-full opacity-15 blur-3xl animate-bounce-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-blue-400 rounded-full opacity-10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/2 w-56 h-56 bg-blue-200 rounded-full opacity-10 blur-3xl animate-bounce"></div>
      </div>

      {/* Page header */}
      <div className="relative z-10 pt-16 pb-12 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-blue-900 w-7 h-7 animate-sparkle" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
              Our Services
            </h1>
          </div>
          <p className="text-base md:text-lg text-gray-700 font-medium max-w-3xl mx-auto">
            Get the social media presence you've always wanted. Increase your visibility and engagement with our top-tier services.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          {/* Filter button */}
          <div className="flex flex-col sm:flex-row gap-3 lg:contents">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center justify-center gap-2 bg-blue-900 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-950 transition-all font-semibold text-sm flex-1 sm:flex-initial"
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>

            {/* Currency selector */}
            <div className="relative flex-1 sm:flex-initial" ref={dropdownRef}>
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="w-full bg-blue-900 text-white px-5 py-3 pr-10 rounded-full font-semibold hover:bg-blue-950 transition-all shadow-lg text-left"
              >
                {selectedCurrency} {symbols[selectedCurrency] || ""}
              </button>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className={`w-4 h-4 text-white transform transition-transform ${currencyDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {currencyDropdownOpen && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto z-30">
                  {currencies.length > 0 ? (
                    currencies.map((currency) => (
                      <div
                        key={currency.code}
                        onClick={() => handleCurrencySelect(currency.code)}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 font-medium text-gray-800 text-sm"
                      >
                        {currency.code} {currency.symbol || ""}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-400 text-sm">Loading currencies...</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 pr-14 rounded-full border-2 border-gray-200 focus:border-blue-900 focus:ring-4 focus:ring-blue-900/20 font-medium text-sm shadow-lg"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-900 text-white p-2 rounded-full hover:bg-blue-950 shadow-lg">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Services table */}
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl mb-4">
              <div className="grid grid-cols-12 gap-4 px-4 py-3 font-bold text-xs">
                <div className="col-span-1">ID</div>
                <div className="col-span-3">Service</div>
                <div className="col-span-2">Rate Per 1000</div>
                <div className="col-span-1">Min Order</div>
                <div className="col-span-1">Max Order</div>
                <div className="col-span-2 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Avg Time
                  <Info className="w-3 h-3 opacity-70" />
                </div>
                <div className="col-span-2">Actions</div>
              </div>
            </div>

            {loading ? (
              <div className="text-center text-blue-900 font-semibold py-8">Loading services...</div>
            ) : (
              <div className="space-y-3">
                {filteredServices.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No services found.</div>
                ) : (
                  filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white border border-gray-200 rounded-xl hover:bg-blue-50 transition-all"
                    >
                      <div className="grid grid-cols-12 gap-4 px-4 py-4">
                        <div className="col-span-1 text-blue-900 font-bold">{service.id}</div>
                        <div className="col-span-3">
                          <div className="text-gray-800 font-semibold text-sm">{service.service_title}</div>
                          {service.featured && (
                            <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-xs font-medium">
                              ⚡ Featured
                            </span>
                          )}
                        </div>
                        <div className="col-span-2 text-blue-900 font-bold">
                          {symbols[selectedCurrency] || ""} {getConvertedRate(service.rate_per_1000)}
                        </div>
                        <div className="col-span-1 text-gray-700">{service.min_amount}</div>
                        <div className="col-span-1 text-gray-700">{service.max_amount}</div>
                        <div className="col-span-2 flex items-center gap-1 text-gray-700">
                          <Clock className="w-3 h-3 text-blue-900" />
                          {service.average_time}
                        </div>
                        <div className="col-span-2">
                          <button className="bg-gradient-to-r from-green-400 to-green-500 text-white px-4 py-2 rounded-full hover:from-green-500 hover:to-green-600 text-xs font-semibold flex items-center gap-1.5">
                            <Eye className="w-3 h-3" />
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

      {/* Animations */}
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
        .animate-sparkle { animation: sparkle 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default ServicesPage;
