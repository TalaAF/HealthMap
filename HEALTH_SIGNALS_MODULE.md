# Health Signal Module - Public Health Early Warning System

## 📋 Overview

The **Health Signal Module** is a new feature added to HealthMap AI that enables **community health monitoring without clinical diagnosis**. It provides public health early warning signals by tracking unusual patterns in community health, supporting early intervention and decision-making.

---

## 🎯 Purpose

> **Monitor unusual health patterns in communities and link them to environmental hazards to support early intervention.**

### What This Module Does:
✅ Tracks community health signals (not individual patient data)  
✅ Links health trends to environmental risk factors  
✅ Supports public health decision-making  
✅ Enables early warning for emerging health risks  

### What This Module Does NOT Do:
❌ Does not diagnose diseases  
❌ Does not store personal health records  
❌ Does not replace clinical care  
❌ Does not identify individual patients  

---

## 🔴 Core Health Signals

The module tracks **3 essential health signal types**:

### 1. Respiratory Signal 🔴
**Indicators:**
- Increased coughing
- Breathing difficulties
- Chest irritation

**Often Related To:**
- Dust and debris from collapsed buildings
- Old materials (potential asbestos)
- Poor air quality

**Example Action:**
> If respiratory signals are elevated in an area with high-risk debris sites → **Alert: Respiratory health risk. Recommend PPE for workers and reduced exposure.**

---

### 2. Gastrointestinal Signal 🟠
**Indicators:**
- Increased diarrhea
- Vomiting
- Stomach issues

**Often Related To:**
- Contaminated water sources
- Exposed sewage systems
- Overcrowding

**Example Action:**
> If GI signals are elevated in an area with water contamination → **Alert: Water-related health risk. Recommend water testing and community warning.**

---

### 3. Skin Signal 🟡
**Indicators:**
- Skin rashes
- Skin infections
- Itching

**Often Related To:**
- Contaminated water
- Poor hygiene conditions
- Overcrowded living spaces

**Example Action:**
> If skin signals are elevated → **Recommend improved hygiene facilities and water quality assessment.**

---

## 🏗️ Technical Implementation

### Backend (Java/Spring Boot)

#### New Files Created:
```
healthmap-backend/src/main/java/com/healthmap/
├── model/
│   └── HealthSignal.java               # Core entity with enums for signal types
├── dto/
│   ├── HealthSignalRequest.java        # API request DTO
│   ├── HealthSignalResponse.java       # API response DTO
│   └── HealthSignalStatsResponse.java  # Statistics DTO
├── repository/
│   └── HealthSignalRepository.java     # Data access layer
├── service/
│   └── HealthSignalService.java        # Business logic
└── controller/
    └── HealthSignalController.java     # REST API endpoints
```

#### Database Schema:
```sql
CREATE TABLE health_signals (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  area_id VARCHAR(255) NOT NULL,
  area_name VARCHAR(255) NOT NULL,
  signal_date DATE NOT NULL,
  signal_type VARCHAR(50) NOT NULL,  -- RESPIRATORY, GASTROINTESTINAL, SKIN
  signal_level VARCHAR(50) NOT NULL, -- NORMAL, ELEVATED
  source VARCHAR(50) NOT NULL,       -- CLINIC, FIELD_TEAM, MOBILE_UNIT, ORGANIZATION
  notes TEXT,
  latitude DOUBLE NOT NULL,
  longitude DOUBLE NOT NULL,
  reported_by VARCHAR(255),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP
);
```

#### API Endpoints:
```
POST   /api/health-signals              # Create new health signal
GET    /api/health-signals              # Get all health signals
GET    /api/health-signals/recent       # Get recent signals (last N days)
GET    /api/health-signals/area/{id}    # Get signals for specific area
GET    /api/health-signals/stats        # Get statistics
GET    /api/health-signals/{id}         # Get specific signal
DELETE /api/health-signals/{id}         # Delete signal
```

---

### Frontend Dashboard (React/Vite)

#### New Files Created:
```
healthmap-dashboard/src/
├── pages/
│   └── HealthSignalsPage.jsx          # Main health signals page
├── components/
│   ├── HealthSignalEntry.jsx          # Quick entry form (< 30 seconds)
│   └── HealthSignalWidget.jsx         # Area summary widget
└── services/
    └── api.js (updated)               # Added healthSignalApi
```

#### Features:
- **Quick Entry Form**: Submit a health signal in less than 30 seconds
- **Area Summaries**: View health signals grouped by area with risk indicators
- **Statistics Dashboard**: Total signals, elevated alerts, areas with risks
- **Filtering**: Filter by time period and signal level
- **Visual Indicators**: Color-coded badges and icons for quick recognition

#### Navigation:
Added new "🏥 Health Signals" tab to main navigation.

---

### Mobile App (React Native/Expo)

#### New Files Created:
```
healthmap-mobile/
├── src/api/
│   ├── healthSignals.ts              # API client for health signals
│   └── index.ts (updated)            # Export health signals API
├── app/(tabs)/
│   ├── health-signals.tsx            # Health signals tab screen
│   └── _layout.tsx (updated)         # Added health tab
└── app/health-signal/
    └── new.tsx                       # New health signal entry form
```

#### Mobile Features:
- **Native Tab**: Dedicated "🏥 Health" tab in bottom navigation
- **Quick Entry**: Mobile-optimized form with auto-location
- **Offline Support**: Ready for offline data collection (future enhancement)
- **Area Statistics**: View health signals by geographic area
- **Real-time Updates**: Pull-to-refresh for latest data

---

## 📊 Data Model

### HealthSignal Entity
```java
{
  "id": 1,
  "areaId": "gaza_central_01",
  "areaName": "Al-Shifa District",
  "signalDate": "2026-02-06",
  "signalType": "RESPIRATORY",
  "signalLevel": "ELEVATED",
  "source": "CLINIC",
  "notes": "Increased respiratory complaints near debris sites",
  "latitude": 31.5152,
  "longitude": 34.4431,
  "reportedBy": "Dr. Ahmad Hassan",
  "createdAt": "2026-02-06T10:30:00",
  "updatedAt": "2026-02-06T10:30:00"
}
```

### Signal Types (Enum)
- `RESPIRATORY` - Respiratory issues
- `GASTROINTESTINAL` - Gastrointestinal issues
- `SKIN` - Skin conditions

### Signal Levels (Enum)
- `NORMAL` - Within expected baseline
- `ELEVATED` - Higher than usual

### Sources (Enum)
- `CLINIC` - Health clinic
- `FIELD_TEAM` - Field health team
- `MOBILE_UNIT` - Mobile health unit
- `ORGANIZATION` - Partner organization

---

## 🎨 UI/UX Design Principles

### 1. **Speed First**
- Entry form completes in under 30 seconds
- Minimal required fields
- Auto-fill where possible (location, date)

### 2. **Clear Visual Hierarchy**
- Color-coded signal types (🔴 🟠 🟡)
- Risk badges for elevated signals
- Area summaries with visual indicators

### 3. **Context-Aware**
- Shows environmental correlation hints
- Recommends actions based on signal patterns
- Links to related site assessments

### 4. **Non-Clinical Language**
- "Signals" not "diagnoses"
- "Elevated" not "outbreak"
- "Community monitoring" not "patient tracking"

---

## 🔗 Integration with Existing Features

### Environmental Correlation
The system automatically links health signals with environmental risk factors:

```
If:
  - Elevated RESPIRATORY signals in Area X
  + High-risk debris sites in Area X
Then:
  → Alert: "Health risk emerging in correlation with environmental hazards"
  → Recommend: PPE, exposure reduction, clinic preparedness
```

### Priority Engine Impact
Health signals influence priority calculations:
- Areas with elevated health signals get higher priority
- Combined environmental + health risk → Critical priority
- Recommendations include both environmental cleanup AND health intervention

### Dashboard Integration
- New widget on main dashboard: "Health Signals - This Week"
- Shows areas with elevated signals
- Links to environmental risk factors
- Action recommendations

---

## 📱 Usage Workflow

### For Field Teams:
1. Visit area
2. Open mobile app → Health tab
3. Tap "+ Add Health Signal"
4. Select signal type (respiratory/GI/skin)
5. Select level (normal/elevated)
6. Add optional notes
7. Submit (auto-location, auto-date)
8. Done in < 30 seconds

### For Clinic Staff:
1. Notice unusual pattern (e.g., more coughing than usual)
2. Open dashboard → Health Signals
3. Click "+ Add Health Signal"
4. Enter area name
5. Select signal details
6. Submit

### For Managers:
1. View dashboard
2. See "Health Signals - This Week" widget
3. Identify areas with elevated signals
4. Review environmental correlation
5. Make intervention decisions
6. Allocate resources accordingly

---

## 🛡️ Ethical & Legal Compliance

### Privacy by Design:
- ❌ **NO** personal identifiers (names, ages, IDs)
- ❌ **NO** individual patient records
- ❌ **NO** medical diagnoses
- ✅ **ONLY** aggregate community patterns
- ✅ **ONLY** geographic area summaries

### Clear Disclaimers:
Every interface shows:
> "This module provides public health signals, not clinical diagnoses."

### Non-Medical Positioning:
- Positioned as **community monitoring**, not medical surveillance
- Supports **public health**, not clinical care
- Enables **early warning**, not disease diagnosis

---

## 📈 Sample Data

The system includes sample data for demonstration:
- **15+ health signals** across Gaza areas
- Mix of normal and elevated signals
- Correlation with existing site assessments
- Realistic field team scenarios

---

## 🚀 Future Enhancements

### Phase 2 (Optional):
1. **Predictive Analytics**: ML models to predict health risk emergence
2. **Automated Alerts**: Real-time notifications for elevated signals
3. **Mobile Offline Mode**: Full offline data collection with sync
4. **WHO Integration**: Export data in WHO EWAR format
5. **Heatmap Visualization**: Geographic visualization of health signals
6. **Trend Analysis**: Time-series analysis of signal patterns

---

## 🎯 Value Proposition

### Before Health Signal Module:
> "This area has environmental damage."

### After Health Signal Module:
> "This area has environmental damage **AND emerging health risks**. Early intervention needed."

### The Difference:
Transforms HealthMap AI from a **damage assessment tool** into a **comprehensive public health decision support system**.

---

## 📞 Quick Reference

### Key Files to Review:
1. **Backend**: `HealthSignalController.java` - API endpoints
2. **Frontend**: `HealthSignalsPage.jsx` - Main dashboard page
3. **Mobile**: `health-signals.tsx` - Mobile tab screen
4. **Database**: `data.sql` - Sample health signals

### API Testing:
```bash
# Get all health signals
GET http://localhost:8080/api/health-signals

# Get statistics
GET http://localhost:8080/api/health-signals/stats

# Create new signal
POST http://localhost:8080/api/health-signals
Content-Type: application/json

{
  "areaName": "Test Area",
  "signalType": "RESPIRATORY",
  "signalLevel": "ELEVATED",
  "source": "CLINIC",
  "latitude": 31.5,
  "longitude": 34.4
}
```

---

## ✅ Implementation Checklist

- [x] Backend models and entities
- [x] Database schema and migrations
- [x] REST API endpoints
- [x] Frontend dashboard page
- [x] Quick entry form
- [x] Area summary widgets
- [x] Mobile app integration
- [x] Sample data loaded
- [x] Navigation updated
- [x] API client libraries
- [x] Documentation

---

## 🎓 Demo Script (3 Minutes)

### Scenario: Field Team Discovers Health Pattern

**Minute 1:**
> "Our field team in Al-Shifa District noticed increased coughing among residents. They open the mobile app, go to Health Signals, and in 20 seconds they log: Respiratory signal, Elevated level, near coordinates X,Y."

**Minute 2:**
> "Back at the operation center, the manager opens the dashboard. The Health Signals widget shows: 'Al-Shifa District - Respiratory ELEVATED.' The system automatically shows: This area also has 2 high-risk debris sites with potential asbestos."

**Minute 3:**
> "Decision made in real-time: Priority upgraded to CRITICAL. Actions: Deploy PPE to field teams, notify nearby clinics, schedule urgent debris assessment. What was just 'a damaged building' is now 'an emerging health risk requiring immediate action.'"

---

## 📝 Notes

- All timestamps are in UTC
- Location coordinates use WGS84 (standard GPS)
- Date format: ISO 8601 (YYYY-MM-DD)
- Color scheme follows accessibility standards
- Mobile app uses device location services
- Dashboard supports responsive design (mobile/tablet/desktop)

---

**Built with ❤️ for public health and disaster response**
