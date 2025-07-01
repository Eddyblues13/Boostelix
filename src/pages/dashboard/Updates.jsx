const Updates = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">📢 System Updates</h1>
      <ul className="space-y-4">
        <li className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">🆕 <strong>June 30:</strong> We launched a new feature to support instant orders.</p>
        </li>
        <li className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">🐞 <strong>June 25:</strong> Fixed a bug affecting transaction history on mobile devices.</p>
        </li>
        <li className="p-4 border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-600">⚙️ <strong>June 20:</strong> Improved dashboard speed and reliability.</p>
        </li>
      </ul>
    </div>
  );
};

export default Updates;
