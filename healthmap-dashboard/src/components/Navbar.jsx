import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/map', label: 'Map' },
    { path: '/priorities', label: 'Priorities' },
    { path: '/health-signals', label: '🏥 Health Signals' },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" fill="white" />
              <path
                d="M50 20 L50 80 M20 50 L80 50"
                stroke="#2563eb"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle cx="50" cy="50" r="15" fill="none" stroke="#2563eb" strokeWidth="4" />
            </svg>
            <span className="text-xl font-bold">HealthMap AI</span>
          </Link>

          <div className="flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-500'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
