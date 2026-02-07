# HealthMap AI - Health Risk Assessment System

A comprehensive system for assessing and visualizing environmental health risks from debris and water contamination in disaster-affected areas, with **integrated public health early warning capabilities**.

## 🆕 Latest Feature: Health Signal Module

HealthMap AI now includes a **Public Health Early Warning System** that monitors community health patterns and correlates them with environmental hazards. 

**[📖 Read Full Documentation](./HEALTH_SIGNALS_MODULE.md)**

### Quick Overview:
- 🏥 **3 Core Health Signals**: Respiratory, Gastrointestinal, Skin
- ⚡ **30-Second Entry**: Quick data collection for field teams
- 🔗 **Environmental Correlation**: Links health signals to debris/water risks
- 📱 **Mobile & Web**: Full support across platforms
- 🛡️ **Privacy-First**: No personal health data, community-level only

> **Note:** This module provides public health signals, not clinical diagnoses.

## Quick Start

### Prerequisites
- Java 17+ and Maven
- Node.js 18+

### 1. Start the Backend

```bash
cd healthmap-backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

### 2. Start the Dashboard

```bash
cd healthmap-dashboard
npm install
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## Features

### Environmental Assessment
- **Overview**: Stats cards showing total sites and risk distribution
- **Risk Chart**: Visual breakdown of critical, high, medium, and low risk sites
- **Interactive Map**: Color-coded markers for all assessment sites
- **Priority List**: Sortable and filterable table of all assessments
- **Site Details**: Detailed view with risk breakdown and recommendations

### 🆕 Health Signal Monitoring
- **Community Health Tracking**: Monitor respiratory, GI, and skin health signals
- **Area Summaries**: View health signals grouped by geographic area
- **Environmental Correlation**: Automatic linking of health signals to environmental risks
- **Quick Entry Forms**: Submit health signals in under 30 seconds
- **Statistics Dashboard**: Total signals, elevated alerts, areas with risks
- **Mobile Support**: Full health signal entry and viewing on mobile devices

### API Endpoints

#### Environmental Assessments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/assessments | List all assessments |
| GET | /api/assessments/{id} | Get single assessment |
| POST | /api/assessments | Create new assessment |
| PUT | /api/assessments/{id} | Update assessment |
| DELETE | /api/assessments/{id} | Delete assessment |
| GET | /api/assessments/priorities | Get prioritized list |
| GET | /api/assessments/geojson | Get GeoJSON for map |
| GET | /api/stats | Dashboard statistics |

#### 🆕 Health Signals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health-signals | List all health signals |
| GET | /api/health-signals/{id} | Get single health signal |
| POST | /api/health-signals | Create new health signal |
| DELETE | /api/health-signals/{id} | Delete health signal |
| GET | /api/health-signals/recent?days=7 | Get recent signals |
| GET | /api/health-signals/area/{id} | Get signals by area |
| GET | /api/health-signals/stats | Health signal statistics |

#### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/files/upload | Upload image |
| GET | /api/files/{filename} | Get image |

### Risk Calculation

**Asbestos Risk (0-100)**
- Old building: +30
- Old materials visible: +25
- Dust present: +20
- Near population: +15

**Water Risk (0-100)**
- Sewage visible: +40
- Standing water: +30
- Near population: +20

**Priority Levels**
- Critical: 70-100
- High: 50-69
- Medium: 30-49
- Low: 0-29

## Sample Data

The system comes preloaded with:
- **30 environmental assessment sites** in Palestine (Gaza Strip, West Bank)
- **15+ health signals** demonstrating community health monitoring
- Mix of normal and elevated health signals for realistic scenarios

## Tech Stack

- **Backend**: Spring Boot 3.2, H2 Database, Lombok, JPA
- **Frontend Dashboard**: React 18, Vite, Tailwind CSS, Leaflet, Recharts
- **Mobile App**: React Native, Expo, TypeScript
- **Data Format**: REST API with JSON
- **Database**: H2 (in-memory) for development, easily switchable to PostgreSQL/MySQL

## Project Structure

```
healthmap/
├── healthmap-backend/      # Spring Boot API
│   ├── src/main/java/com/healthmap/
│   │   ├── controller/     # REST controllers
│   │   │   ├── AssessmentController.java
│   │   │   ├── HealthSignalController.java  # 🆕
│   │   │   ├── StatsController.java
│   │   │   └── FileController.java
│   │   ├── service/        # Business logic
│   │   │   ├── AssessmentService.java
│   │   │   ├── HealthSignalService.java     # 🆕
│   │   │   └── RiskCalculator.java
│   │   ├── model/          # JPA entities
│   │   │   ├── Assessment.java
│   │   │   └── HealthSignal.java            # 🆕
│   │   ├── repository/     # Data access
│   │   │   ├── AssessmentRepository.java
│   │   │   └── HealthSignalRepository.java  # 🆕
│   │   ├── dto/            # Data transfer objects
│   │   │   ├── AssessmentRequest.java
│   │   │   ├── HealthSignalRequest.java     # 🆕
│   │   │   └── HealthSignalResponse.java    # 🆕
│   │   └── config/         # Configuration
│   └── src/main/resources/
│       ├── application.properties
│       └── data.sql        # Seed data (assessments + health signals)
│
├── healthmap-dashboard/    # React frontend
│   └── src/
│       ├── components/     # Reusable UI components
│       │   ├── AssessmentTable.jsx
│       │   ├── MapView.jsx
│       │   ├── HealthSignalEntry.jsx        # 🆕
│       │   └── HealthSignalWidget.jsx       # 🆕
│       ├── pages/          # Page components
│       │   ├── Dashboard.jsx
│       │   ├── MapPage.jsx
│       │   ├── PrioritiesPage.jsx
│       │   └── HealthSignalsPage.jsx        # 🆕
│       └── services/       # API client
│           └── api.js
│
└── healthmap-mobile/       # React Native mobile app
    ├── app/
    │   ├── (tabs)/
    │   │   ├── index.tsx
    │   │   ├── history.tsx
    │   │   ├── map.tsx
    │   │   ├── health-signals.tsx           # 🆕
    │   │   └── settings.tsx
    │   └── health-signal/                   # 🆕
    │       └── new.tsx                      # 🆕
    └── src/
        └── api/
            ├── assessments.ts
            └── healthSignals.ts             # 🆕
```

## Development

### H2 Console (Database)
Access at: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:healthmapdb`
- Username: `sa`
- Password: (empty)

### API Testing

#### Environmental Assessment Example:
```bash
curl -X POST http://localhost:8080/api/assessments \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 31.5,
    "longitude": 34.45,
    "siteType": "DEBRIS",
    "buildingAge": "OLD",
    "dustPresent": true,
    "oldMaterials": true,
    "nearPopulation": true
  }'
```

#### 🆕 Health Signal Example:
```bash
curl -X POST http://localhost:8080/api/health-signals \
  -H "Content-Type: application/json" \
  -d '{
    "areaName": "Al-Shifa District",
    "signalType": "RESPIRATORY",
    "signalLevel": "ELEVATED",
    "source": "CLINIC",
    "latitude": 31.5152,
    "longitude": 34.4431,
    "reportedBy": "Dr. Ahmad",
    "notes": "Increased coughing near debris sites"
  }'
```

## 📱 Mobile App Setup

```bash
cd healthmap-mobile
npm install
npx expo start
```

Use Expo Go app to test on your device, or press:
- `a` for Android emulator
- `i` for iOS simulator
- `w` for web browser

## 📚 Additional Documentation

- **[Health Signals Module](./HEALTH_SIGNALS_MODULE.md)** - Complete documentation for the health monitoring feature
- **API Documentation** - Available at `/swagger-ui.html` (if Swagger is enabled)

## 🎯 Use Cases

### Emergency Response Team
1. Assess environmental damage using web dashboard or mobile app
2. Monitor community health signals from field teams
3. Identify areas where environmental risks correlate with health concerns
4. Prioritize intervention based on combined environmental + health data

### Public Health Officials
1. Track unusual health patterns by geographic area
2. Correlate health signals with environmental assessments
3. Make data-driven decisions for resource allocation
4. Generate early warnings for emerging health risks

### Field Workers
1. Quickly log health observations via mobile app
2. Submit environmental assessments on-site
3. View priority areas for intervention
4. Access offline (future feature)

## 🔐 Privacy & Ethics

The Health Signal Module is designed with privacy-first principles:
- ✅ Community-level data only (no individual records)
- ✅ Geographic summaries (not personal addresses)
- ✅ Public health signals (not medical diagnoses)
- ✅ No personally identifiable information (PII)

## 🚀 Deployment

### Production Considerations:
1. **Database**: Switch from H2 to PostgreSQL or MySQL
2. **File Storage**: Use cloud storage (S3, Azure Blob) instead of local filesystem
3. **Security**: Add authentication/authorization
4. **Scaling**: Consider containerization (Docker) and orchestration (Kubernetes)
5. **Monitoring**: Add logging and monitoring (ELK stack, Prometheus)



**Built for disaster response and public health emergency management**
