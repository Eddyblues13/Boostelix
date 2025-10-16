import { useState, useEffect } from "react";
import { Info, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  generateApiKey,
  fetchSmmServices,
  placeApiOrder,
  checkOrderStatus,
  checkMultiOrderStatus,
  requestRefill,
  getApiBalance,
  fetchApiOrderHistory,
  fetchUserData
} from "../../services/APIService";
import { CSS_COLORS } from "../../components/constant/colors";

function API() {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState({
    initial: true,
    generateKey: false,
    test: false
  });
  const [services, setServices] = useState([]);
  const [copiedItem, setCopiedItem] = useState("");
  const [testConfig, setTestConfig] = useState({
    endpoint: "/services",
    params: JSON.stringify({ key: "", action: "services" }, null, 2),
    response: null
  });

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [userResponse, servicesResponse] = await Promise.all([
          fetchUserData(),
          fetchSmmServices()
        ]);

        const storedApiKey = localStorage.getItem('api_key');
        if (storedApiKey) {
          setApiKey(storedApiKey);
          // Update test config with the API key
          setTestConfig(prev => ({
            ...prev,
            params: JSON.stringify({ ...JSON.parse(prev.params), key: storedApiKey }, null, 2)
          }));
        }

        if (servicesResponse) {
          setServices(servicesResponse);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Failed to load API data");
      } finally {
        setLoading(prev => ({ ...prev, initial: false }));
      }
    };

    fetchInitialData();
  }, []);

  const handleGenerateApiKey = async () => {
    try {
      setLoading(prev => ({ ...prev, generateKey: true }));
      const response = await generateApiKey();
      setApiKey(response.api_key);
      localStorage.setItem('api_key', response.api_key);
      // Update test config with the new API key
      setTestConfig(prev => ({
        ...prev,
        params: JSON.stringify({ ...JSON.parse(prev.params), key: response.api_key }, null, 2)
      }));
      toast.success("API key generated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to generate API key");
    } finally {
      setLoading(prev => ({ ...prev, generateKey: false }));
    }
  };

  const copyToClipboard = (text, itemName) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemName);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedItem(""), 2000);
  };

  const testApiEndpoint = async () => {
    if (!apiKey) {
      toast.error("You need an API key to test endpoints");
      return;
    }

    setLoading(prev => ({ ...prev, test: true }));
    setTestConfig(prev => ({ ...prev, response: null }));

    try {
      const params = JSON.parse(testConfig.params);
      let response;

      switch(testConfig.endpoint) {
        case '/services':
          response = await fetchSmmServices(params);
          break;
        case '/orders':
          response = await placeApiOrder(params);
          break;
        case '/orders/status':
          response = await checkOrderStatus(params.order);
          break;
        case '/orders/multi-status':
          response = await checkMultiOrderStatus(params.orders.split(','));
          break;
        case '/refill':
          response = await requestRefill(params.order);
          break;
        case '/balance':
          response = await getApiBalance();
          break;
        default:
          throw new Error("Invalid endpoint");
      }

      setTestConfig(prev => ({ ...prev, response }));
    } catch (error) {
      setTestConfig(prev => ({
        ...prev,
        response: {
          error: error.message || "API request failed",
          details: error
        }
      }));
      toast.error("API test failed");
    } finally {
      setLoading(prev => ({ ...prev, test: false }));
    }
  };

  const apiSections = [
    {
      title: "API Overview",
      type: "overview",
      data: [
        { param: "HTTP Method", desc: "POST" },
        { param: "Base URL", desc: `${window.location.origin}/api/v2` },
        { param: "API Key", desc: apiKey || "Generate below", copyValue: apiKey },
        { param: "Response Format", desc: "JSON" },
      ],
    },
    {
      title: "Service List",
      type: "endpoint",
      endpoint: "/services",
      action: "services",
      parameters: [
        { param: "key", desc: "Your API key" },
        { param: "action", desc: "services" },
      ],
      exampleResponse: services.length > 0 ? services : [
        {
          service: 1,
          name: "Instagram Followers",
          type: "Default",
          category: "Instagram",
          rate: "0.90",
          min: "50",
          max: "10000",
          refill: true,
          cancel: true,
        }
      ],
    },
    {
      title: "Place Order",
      type: "endpoint",
      endpoint: "/orders",
      action: "add",
      parameters: [
        { param: "key", desc: "Your API key" },
        { param: "action", desc: "add" },
        { param: "service", desc: "Service ID" },
        { param: "link", desc: "Target URL" },
        { param: "quantity", desc: "Order quantity" },
        { param: "runs", desc: "Runs (optional)" },
        { param: "interval", desc: "Interval in minutes (optional)" },
      ],
      exampleResponse: {
        order: 12345,
        provider_order_id: "provider_123"
      },
    },
  ];

  const renderSection = (section) => {
    if (section.type === "overview") {
      return (
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">{section.title}</h3>
          <div className="space-y-2">
            {section.data.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row justify-between py-2 border-b">
                <span className="font-medium text-sm md:text-base">{item.param}</span>
                <div className="flex items-center mt-1 sm:mt-0">
                  <span className="mr-2 text-sm md:text-base">{item.desc}</span>
                  {item.copyValue && (
                    <button 
                      onClick={() => copyToClipboard(item.copyValue, item.param)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {copiedItem === item.param ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 md:space-y-6">
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 md:mb-4">
            <h3 className="text-lg md:text-xl font-semibold mb-2 sm:mb-0">{section.title}</h3>
            <span className="bg-gray-100 px-2 py-1 rounded text-xs md:text-sm">POST {section.endpoint}</span>
          </div>
          
          <h4 className="font-medium mb-2 text-sm md:text-base">Parameters</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">Parameter</th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {section.parameters.map((param, idx) => (
                  <tr key={idx}>
                    <td className="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-mono text-gray-900">{param.param}</td>
                    <td className="px-3 py-2 md:px-6 md:py-4 text-xs md:text-sm text-gray-500">{param.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex justify-between items-center mb-2 md:mb-3">
            <h4 className="font-medium text-sm md:text-base">Example Response</h4>
            <button
              onClick={() => copyToClipboard(JSON.stringify(section.exampleResponse, null, 2), section.title)}
              className="flex items-center text-xs md:text-sm text-blue-500 hover:text-blue-700"
            >
              {copiedItem === section.title ? <Check size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
              Copy
            </button>
          </div>
          <pre className="bg-gray-800 text-gray-100 p-3 md:p-4 rounded overflow-x-auto text-xs md:text-sm">
            <code>{JSON.stringify(section.exampleResponse, null, 2)}</code>
          </pre>
        </div>
      </div>
    );
  };

  if (loading.initial) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">API Documentation</h1>
      
      {!apiKey && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm md:text-base font-medium text-blue-800">API Key Required</h3>
              <div className="mt-2 text-sm md:text-base text-blue-700">
                <p>You need an API key to access our endpoints.</p>
              </div>
              <div className="mt-3 md:mt-4">
                <button
                  onClick={handleGenerateApiKey}
                  disabled={loading.generateKey}
                  className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 border border-transparent text-xs md:text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading.generateKey && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                  Generate API Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 md:space-y-8">
        {apiSections.map((section, index) => (
          <div key={index} className="space-y-4 md:space-y-6">
            {renderSection(section)}
          </div>
        ))}
      </div>

      {apiKey && (
        <div className="mt-8 md:mt-12 bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">API Test Console</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Endpoint</label>
              <select
                value={testConfig.endpoint}
                onChange={(e) => setTestConfig(prev => ({
                  ...prev,
                  endpoint: e.target.value,
                  params: JSON.stringify({ action: apiSections.find(s => s.endpoint === e.target.value)?.action }, null, 2)
                }))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-sm md:text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                {apiSections.filter(s => s.type === "endpoint").map((section, idx) => (
                  <option key={idx} value={section.endpoint}>{section.endpoint}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Parameters (JSON)</label>
              <textarea
                value={testConfig.params}
                onChange={(e) => setTestConfig(prev => ({ ...prev, params: e.target.value }))}
                rows={4}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full text-xs md:text-sm border border-gray-300 rounded-md font-mono"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={testApiEndpoint}
              disabled={loading.test}
              className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 border border-transparent text-xs md:text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading.test && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
              Test Endpoint
            </button>
          </div>

          {testConfig.response && (
            <div className="mt-4 md:mt-6">
              <div className="flex justify-between items-center mb-2 md:mb-3">
                <h3 className="text-base md:text-lg font-medium">Response</h3>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(testConfig.response, null, 2), "test-response")}
                  className="flex items-center text-xs md:text-sm text-blue-500 hover:text-blue-700"
                >
                  {copiedItem === "test-response" ? <Check size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
                  Copy
                </button>
              </div>
              <pre className="bg-gray-800 text-gray-100 p-3 md:p-4 rounded overflow-x-auto text-xs md:text-sm">
                <code>{JSON.stringify(testConfig.response, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 md:mt-12 pt-4 md:pt-6 border-t border-gray-200">
        <p className="text-center text-xs md:text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Your SMM Panel. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default API;