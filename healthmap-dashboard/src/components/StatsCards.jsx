function StatsCards({ stats }) {
  const cards = [
    {
      label: 'Total Sites',
      value: stats?.totalAssessments || 0,
      icon: '📍',
      color: 'bg-blue-500',
    },
    {
      label: 'Critical',
      value: stats?.criticalCount || 0,
      icon: '🚨',
      color: 'bg-red-600',
    },
    {
      label: 'High Risk',
      value: stats?.highCount || 0,
      icon: '⚠️',
      color: 'bg-orange-500',
    },
    {
      label: 'Medium/Low',
      value: (stats?.mediumCount || 0) + (stats?.lowCount || 0),
      icon: '✓',
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4"
        >
          <div className={`${card.color} text-white p-3 rounded-lg text-2xl`}>
            {card.icon}
          </div>
          <div>
            <p className="text-gray-500 text-sm">{card.label}</p>
            <p className="text-3xl font-bold text-gray-800">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;
