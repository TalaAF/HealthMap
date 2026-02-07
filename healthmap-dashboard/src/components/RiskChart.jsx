import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

function RiskChart({ distribution }) {
  const data = [
    { name: 'Critical', value: distribution?.CRITICAL || 0, color: '#dc2626' },
    { name: 'High', value: distribution?.HIGH || 0, color: '#ea580c' },
    { name: 'Medium', value: distribution?.MEDIUM || 0, color: '#ca8a04' },
    { name: 'Low', value: distribution?.LOW || 0, color: '#16a34a' },
  ].filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default RiskChart;
