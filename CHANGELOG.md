# Changelog

All notable changes to HealthMap AI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-02-06

### Added - Health Signal Module (Public Health Early Warning System)

#### Backend
- **New Entity**: `HealthSignal` model with support for 3 signal types (Respiratory, Gastrointestinal, Skin)
- **New Repository**: `HealthSignalRepository` with custom queries for area-based and time-based filtering
- **New Service**: `HealthSignalService` with statistics and area summary calculations
- **New Controller**: `HealthSignalController` with full CRUD operations and stats endpoints
- **New DTOs**: 
  - `HealthSignalRequest` - API request model
  - `HealthSignalResponse` - API response model with display values
  - `HealthSignalStatsResponse` - Statistics and area summaries
- **Database Schema**: New `health_signals` table with spatial and temporal indexing
- **Sample Data**: 15+ health signals with realistic scenarios across Gaza areas

#### API Endpoints
- `POST /api/health-signals` - Create health signal
- `GET /api/health-signals` - List all health signals
- `GET /api/health-signals/recent?days=N` - Get recent signals
- `GET /api/health-signals/area/{areaId}` - Get signals by area
- `GET /api/health-signals/stats` - Get comprehensive statistics
- `GET /api/health-signals/{id}` - Get specific signal
- `DELETE /api/health-signals/{id}` - Delete signal

#### Frontend Dashboard
- **New Page**: `HealthSignalsPage.jsx` - Main health signals management interface
- **New Component**: `HealthSignalEntry.jsx` - Quick entry form (< 30 seconds)
- **New Component**: `HealthSignalWidget.jsx` - Area summary widget with risk indicators
- **Updated Navigation**: Added "🏥 Health Signals" tab to main navbar
- **Updated API Service**: Extended API client with health signal methods
- **Features**:
  - Statistics dashboard (total, elevated, normal signals)
  - Area-based health signal summaries
  - Environmental correlation indicators
  - Time-based filtering (1, 7, 14, 30 days)
  - Level filtering (all, elevated, normal)
  - Color-coded visual indicators
  - Action recommendations based on signal patterns

#### Mobile App
- **New Tab**: `health-signals.tsx` - Dedicated health signals screen in bottom navigation
- **New Screen**: `health-signal/new.tsx` - Mobile-optimized entry form
- **New API Client**: `healthSignals.ts` - TypeScript API methods
- **Updated Tab Layout**: Added "🏥 Health" tab with icon
- **Features**:
  - Pull-to-refresh for real-time data
  - Auto-location capture
  - Quick signal type selection
  - Area statistics view
  - Responsive mobile design
  - Filter by signal level

#### Documentation
- **New File**: `HEALTH_SIGNALS_MODULE.md` - Comprehensive feature documentation
- **Updated**: `README.md` with Health Signal Module overview
- **Added**: API examples for health signal endpoints
- **Added**: Use cases and workflow guides
- **Added**: Privacy and ethics guidelines

### Features

#### Core Functionality
- **3 Signal Types**: Respiratory (🔴), Gastrointestinal (🟠), Skin (🟡)
- **2 Signal Levels**: Normal (🟢), Elevated (🔴)
- **4 Data Sources**: Clinic, Field Team, Mobile Unit, Organization
- **Geographic Tracking**: Latitude/longitude for spatial analysis
- **Temporal Analysis**: Date-based tracking and trend monitoring
- **Area Summaries**: Automatic grouping and risk calculation by area

#### Intelligence & Correlation
- **Environmental Correlation**: Links health signals to nearby debris/water risks
- **Risk Detection**: Automatic identification of areas with elevated signals
- **Pattern Recognition**: Detects unusual health patterns by area and type
- **Action Recommendations**: Context-aware suggestions based on signal patterns

#### User Experience
- **Quick Entry**: < 30 second data submission
- **Visual Indicators**: Color-coded badges and icons
- **Real-time Stats**: Dynamic statistics and summaries
- **Mobile-First Design**: Optimized for field use
- **Privacy by Design**: No personal health data, community-level only

### Changed
- **README.md**: Updated with Health Signal Module information
- **API Service**: Extended with health signal endpoints
- **Navigation**: Added health signals to both web and mobile navigation
- **Database Schema**: Added health_signals table

### Technical Details

#### Backend Stack
- Spring Boot 3.2
- JPA/Hibernate for ORM
- H2 Database (development)
- Lombok for boilerplate reduction

#### Frontend Stack
- React 18 with Hooks
- Vite for build tooling
- Tailwind CSS for styling
- Axios for API communication

#### Mobile Stack
- React Native with Expo
- TypeScript for type safety
- Expo Router for navigation
- Native location services integration

### Privacy & Compliance
- ✅ No personally identifiable information (PII)
- ✅ Community-level aggregation only
- ✅ Public health signals, not diagnoses
- ✅ Clear disclaimers on all interfaces
- ✅ Geographic data only (no personal addresses)

### Sample Data
- Added 15+ realistic health signal entries
- Mix of normal and elevated signals
- Coverage across multiple Gaza areas
- Correlation with existing environmental assessments

### Performance
- Optimized queries for area-based summaries
- Indexed by date and location for fast retrieval
- Efficient statistics calculation
- Lazy loading in mobile app

---

## [1.0.0] - 2026-01-15

### Added - Initial Release

#### Backend
- Spring Boot REST API
- Assessment model with risk calculation
- File upload support
- H2 in-memory database
- Sample data for Palestine region

#### Frontend
- React dashboard with Vite
- Interactive map with Leaflet
- Statistics cards and charts
- Priority table with filtering
- Site detail pages

#### Mobile App
- React Native with Expo
- Assessment creation
- History view
- Map integration
- Settings management

#### Features
- Environmental risk assessment (debris and water)
- Automatic risk calculation
- Priority-based sorting
- GeoJSON export for maps
- Image upload support

---

## Future Roadmap

### [2.1.0] - Planned
- Predictive analytics for health risk patterns
- Automated alerts for elevated signals
- WHO EWAR format export
- Heatmap visualization
- Offline mode for mobile app
- Multi-language support (Arabic, English)

### [3.0.0] - Under Consideration
- Machine learning for risk prediction
- Integration with external health systems
- Advanced reporting and analytics
- User authentication and roles
- Real-time collaboration features

---

**Note**: Health Signal Module provides public health early warning signals, not clinical diagnoses. It is designed to support community health monitoring and early intervention decision-making in disaster response scenarios.
