import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/dashboard/Header";
import Sidebar from "../../components/dashboard/Sidebar";
import { getUserFromLocalStorage } from "../../utils/helpers";
import { CSS_COLORS } from "../../components/constant/colors";
import toast from "react-hot-toast";
import { fetchCurrencies } from "../../services/services";

// Currency utility functions
const convertAmount = (amount, fromRate, toRate) => {
  if (!amount || !fromRate || !toRate) return 0;
  const amountInUSD = amount / fromRate;
  return amountInUSD * toRate;
};

const formatCurrency = (amount, currency) => {
  if (!currency || amount === null || amount === undefined) return '0.00';
  const formattedAmount = parseFloat(amount).toFixed(2);
  return `${currency.symbol} ${formattedAmount}`;
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState({ 
    code: "NGN", 
    symbol: "₦", 
    rate: 1 
  });
  const [currencies, setCurrencies] = useState([]);

  const navigate = useNavigate();

  // Load currencies from backend
  useEffect(() => {
    const handleFetchCurrencies = async () => {
      try {
        const res = await fetchCurrencies();
        if (res?.data?.success && Array.isArray(res.data.currencies)) {
          setCurrencies(res.data.currencies);

          // Default to NGN if available
          const ngnCurrency = res.data.currencies.find(c => c.code === "NGN");
          if (ngnCurrency) setSelectedCurrency(ngnCurrency);
        }
      } catch (err) {
        console.error("Failed to load currencies", err);
      }
    };

    handleFetchCurrencies();
  }, []);

  // Currency conversion function
  const convertToSelectedCurrency = (amount, sourceCurrency = "NGN") => {
    if (!amount || !selectedCurrency?.rate) return 0;
    
    const sourceCurrencyObj = currencies.find(c => c.code === sourceCurrency) || { rate: 1 };
    const sourceRate = sourceCurrencyObj.rate || 1;
    const targetRate = selectedCurrency.rate || 1;
    
    return convertAmount(amount, sourceRate, targetRate);
  };

  // Load user data
  useEffect(() => {
    const userData = getUserFromLocalStorage();
    if (userData) setUser(userData);
    else handleLogout();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ background: CSS_COLORS.background.primary }}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden transition-opacity duration-300"
          style={{ backgroundColor: "rgba(15, 118, 110, 0.4)", backdropFilter: "blur(8px)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        currencies={currencies}
        user={user}
        onLogout={handleLogout}
        convertToSelectedCurrency={convertToSelectedCurrency}
        formatCurrency={formatCurrency}
      />

      <div className="flex flex-1">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedCurrency={selectedCurrency}
          convertToSelectedCurrency={convertToSelectedCurrency}
          formatCurrency={formatCurrency}
          user={user}
        />

        <main className="flex-1 pt-16 sm:pt-18 lg:pt-20 lg:ml-64 overflow-x-hidden">
          <div className="w-full min-h-[calc(100vh-4rem)] overflow-x-hidden">
            <div className="min-h-full p-2 sm:p-3 md:p-4 lg:p-6 w-full overflow-x-hidden" style={{ backgroundColor: CSS_COLORS.background.overlay }}>
              <Outlet context={{
                selectedCurrency,
                setSelectedCurrency,
                currencies,
                convertToSelectedCurrency,
                formatCurrency,
                user
              }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;