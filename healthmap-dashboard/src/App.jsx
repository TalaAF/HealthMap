import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import PrioritiesPage from './pages/PrioritiesPage';
import SiteDetailPage from './pages/SiteDetailPage';
import HealthSignalsPage from './pages/HealthSignalsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/priorities" element={<PrioritiesPage />} />
            <Route path="/health-signals" element={<HealthSignalsPage />} />
            <Route path="/site/:id" element={<SiteDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
