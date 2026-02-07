function RiskBadge({ priority, size = 'md' }) {
  const colors = {
    CRITICAL: 'bg-red-600 text-white',
    HIGH: 'bg-orange-500 text-white',
    MEDIUM: 'bg-yellow-500 text-black',
    LOW: 'bg-green-500 text-white',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`inline-block rounded-full font-semibold ${colors[priority] || 'bg-gray-400'} ${sizes[size]}`}
    >
      {priority}
    </span>
  );
}

export default RiskBadge;
