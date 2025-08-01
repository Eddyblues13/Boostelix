import { Info } from "lucide-react"
import { CSS_COLORS } from "../../components/constant/colors"

function API() {
  const apiSections = [
    {
      title: "API",
      type: "overview",
      data: [
        { param: "HTTP Method", desc: "POST" },
        { param: "API URL", desc: "https://smexploits.com/api/v2" },
        { param: "API Key", desc: "Get an API key on the Account page" },
        { param: "Response format", desc: "JSON" },
      ],
    },
    {
      title: "Service list",
      type: "endpoint",
      parameters: [
        { param: "key", desc: "Your API key" },
        { param: "action", desc: "services" },
      ],
      exampleResponse: [
        {
          service: 1,
          name: "Followers",
          type: "Default",
          category: "First Category",
          rate: "0.90",
          min: "50",
          max: "10000",
          refill: true,
          cancel: true,
        },
        {
          service: 2,
          name: "Comments",
          type: "Custom Comments",
          category: "Second Category",
          min: "10",
          max: "1500",
          refill: false,
          cancel: true,
        },
      ],
    },
    {
      title: "Add",
      type: "endpoint",
      parameters: [
        { param: "key", desc: "Your API key" },
        { param: "action", desc: "add" },
        { param: "service", desc: "Service ID" },
        { param: "link", desc: "Link to page" },
        { param: "quantity", desc: "Needed quantity" },
        { param: "runs (optional)", desc: "Runs to deliver" },
        { param: "interval (optional)", desc: "Interval in minutes" },
      ],
      exampleResponse: {
        order: 23581,
      },
    },
    {
      title: "Order status",
      type: "endpoint",
      parameters: [
        { param: "key", desc: "Your API key" },
        { param: "action", desc: "status" },
        { param: "order", desc: "Order ID" },
      ],
      exampleResponse: {
        charge: "0.27819",
        start_count: "3572",
        status: "Partial",
        remains: "157",
        currency: "USD",
      },
    },
    {
      title: "Multiple orders status",
      type: "endpoint",
      parameters: [
        { param: "key", desc: "Your API key" },
        { param: "action", desc: "status" },
        { param: "orders", desc: "Order IDs (separated by a comma, up to 100 IDs)" },
      ],
      exampleResponse: {
        1: {
          charge: "0.27819",
          start_count: "3572",
          status: "Partial",
          remains: "157",
          currency: "USD",
        },
        10: {
          error: "Incorrect order ID",
        },
        100: {
          charge: "1.44219",
          start_count: "234",
          status: "In progress",
          remains: "10",
          currency: "USD",
        },
      },
    },
    {
      title: "Create refill",
      type: "endpoint",
      parameters: [
        { param: "key", desc: "Your API key" },
        { param: "action", desc: "refill" },
        { param: "order", desc: "Order ID" },
      ],
      exampleResponse: {
        refill: 12345,
      },
    },
    {
      title: "Balance",
      type: "endpoint",
      parameters: [
        { param: "key", desc: "Your API key" },
        { param: "action", desc: "balance" },
      ],
      exampleResponse: {
        balance: "100.84292",
        currency: "USD",
      },
    },
  ]

  const renderTable = (data) => (
    <div className="overflow-hidden border border-gray-200 rounded-2xl">
      <table className="w-full">
        <thead className="bg-background-muted">
          <tr>
            <th className="text-left py-4 px-6 font-semibold text-text-medium">Parameters</th>
            <th className="text-left py-4 px-6 font-semibold text-text-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.param}
              className={`border-t border-gray-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
            >
              <td className="py-4 px-6 font-medium text-text-DEFAULT">{item.param}</td>
              <td className="py-4 px-6 text-text-medium">{item.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderExampleResponse = (response) => (
    <div
      className="rounded-2xl p-6 shadow-sm border border-white/50 backdrop-blur-sm"
      style={{ backgroundColor: CSS_COLORS.background.card }}
    >
      <h3 className="text-lg font-semibold text-text-DEFAULT mb-4">Example response</h3>
      <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
        <code>{JSON.stringify(response, null, 2)}</code>
      </pre>
    </div>
  )

  return (
    <div className="w-full space-y-8">
      {apiSections.map((section, index) => (
        <div key={index} className="space-y-6">
          <h2 className="text-2xl font-semibold text-text-DEFAULT">{section.title}</h2>

          {section.type === "overview" && (
            <div
              className="rounded-2xl p-8 shadow-sm border border-white/50 backdrop-blur-sm"
              style={{ backgroundColor: CSS_COLORS.background.card }}
            >
              <div className="overflow-hidden border border-gray-200 rounded-2xl">
                <table className="w-full">
                  <tbody>
                    {section.data.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`border-t border-gray-200 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                      >
                        <td className="py-4 px-6 font-medium text-text-DEFAULT w-1/3">{item.param}</td>
                        <td className="py-4 px-6 text-text-medium w-2/3">{item.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section.type === "endpoint" && (
            <>
              <div
                className="rounded-2xl p-8 shadow-sm border border-white/50 backdrop-blur-sm"
                style={{ backgroundColor: CSS_COLORS.background.card }}
              >
                <h3 className="text-lg font-semibold text-text-DEFAULT mb-4">Parameters</h3>
                {renderTable(section.parameters)}
              </div>
              {section.exampleResponse && renderExampleResponse(section.exampleResponse)}
            </>
          )}
        </div>
      ))}
      {/* Footer Notice - Replicated from NewOrder component */}
      <div
        className="mt-8 p-4 lg:p-6 rounded-2xl lg:rounded-3xl text-white shadow-lg border border-white/20 backdrop-blur-sm"
        style={{ background: `linear-gradient(135deg, ${CSS_COLORS.primary}, ${CSS_COLORS.primaryDark})` }}
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-white/20 rounded-2xl flex-shrink-0">
            <Info className="w-5 h-5 lg:w-6 lg:h-6" />
          </div>
          <div>
            <h3 className="text-lg lg:text-xl font-bold mb-2">
              Service <span className="text-yellow-300">Updates</span>
            </h3>
            <div className="bg-white/10 rounded-2xl p-4">
              <h4 className="font-semibold mb-2 text-yellow-300">🚨 Important Notice</h4>
              <p className="text-sm lg:text-base text-white/90">
                For any non-delivered orders, please contact our support team for immediate assistance and refund
                processing.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright Footer */}
      <div className="text-center py-6">
        <p className="text-sm text-gray-500">© Copyright 2025 All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default API
