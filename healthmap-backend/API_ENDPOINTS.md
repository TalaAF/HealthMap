# HealthMap Backend API Endpoints

**Base URL:** `http://localhost:8080`

## ✅ Assessment Endpoints

### Get All Assessments
```
GET /api/assessments
```

### Create Assessment
```
POST /api/assessments
```

### Get Recent Assessments
```
GET /api/assessments/recent
```

### Get Assessment by ID
```
GET /api/assessments/{id}
```

### Update Assessment
```
PUT /api/assessments/{id}
```

### Delete Assessment
```
DELETE /api/assessments/{id}
```

---

## ✅ Health Signals Endpoints (NEW)

### Create Health Signal
```
POST /api/health-signals
```
**Request Body:**
```json
{
  "areaId": "string",
  "areaName": "string",
  "signalDate": "2026-02-06",
  "signalType": "RESPIRATORY|GASTROINTESTINAL|SKIN",
  "signalLevel": "NORMAL|ELEVATED",
  "source": "CLINIC|FIELD_TEAM|MOBILE_UNIT|ORGANIZATION",
  "notes": "string (optional)",
  "latitude": 31.5,
  "longitude": 34.5,
  "reportedBy": "string (optional)"
}
```

### Get All Health Signals
```
GET /api/health-signals
```

### Get Recent Health Signals
```
GET /api/health-signals/recent?days=7
```
**Query Parameters:**
- `days` (optional, default: 7) - Number of days to look back

### Get Health Signals by Area
```
GET /api/health-signals/area/{areaId}
```

### Get Health Signal Statistics
```
GET /api/health-signals/stats
```
**Response includes:**
- Total signals
- Elevated vs normal count
- Signals by type
- Elevated signals by type
- Signals grouped by area

### Get Health Signal by ID
```
GET /api/health-signals/{id}
```

### Delete Health Signal
```
DELETE /api/health-signals/{id}
```

---

## ✅ Statistics Endpoints

### Get Overall Stats
```
GET /api/stats
```

### Get Risk Distribution
```
GET /api/stats/risk-distribution
```

### Get Environmental-Health Correlations (NEW)
```
GET /api/stats/correlations
```
**Response includes:**
- Area correlations (environmental risk + health signals)
- Correlation scores (0-100)
- Risk levels (URGENT, HIGH, MEDIUM, LOW, NORMAL)
- Recommendations
- Linked risks
- Overall statistics

**Sample Response:**
```json
{
  "areaCorrelations": [
    {
      "areaId": "AREA_123_456",
      "areaName": "Jabaliya North",
      "latitude": 31.5,
      "longitude": 34.5,
      "assessmentCount": 5,
      "averageEnvironmentalRisk": 75.5,
      "primaryRiskType": "DEBRIS",
      "criticalAssessments": 2,
      "healthSignalCount": 3,
      "elevatedSignalCount": 2,
      "hasRespiratoryRisk": true,
      "hasGastrointestinalRisk": false,
      "hasSkinRisk": false,
      "riskLevel": "URGENT",
      "correlationScore": 85,
      "recommendation": "URGENT: Immediate dust control and PPE required. Health impact detected.",
      "linkedRisks": [
        "High debris risk + Respiratory signals detected"
      ]
    }
  ],
  "overallStats": {
    "totalAreasAnalyzed": 10,
    "urgentAreas": 2,
    "highRiskAreas": 3,
    "monitorAreas": 4,
    "normalAreas": 1
  }
}
```

---

## 🔧 File Upload Endpoints

### Upload File
```
POST /api/files/upload
```

### Get File
```
GET /api/files/{filename}
```

---

## 🗺️ GeoJSON Endpoints

### Get GeoJSON Data
```
GET /api/assessments/geojson
```

---

## Health Signal Types

### Signal Types
- **RESPIRATORY** 🔴 - Coughing, breathing issues (linked to dust/debris)
- **GASTROINTESTINAL** 🟠 - Stomach issues (linked to water contamination)
- **SKIN** 🟡 - Skin conditions (linked to hygiene/water issues)

### Signal Levels
- **NORMAL** 🟢 - Normal baseline
- **ELEVATED** 🔴 - Higher than usual

### Signal Sources
- **CLINIC** - Health clinic reports
- **FIELD_TEAM** - Field health workers
- **MOBILE_UNIT** - Mobile health units
- **ORGANIZATION** - Partner organizations

---

## Correlation Analysis

The `/api/stats/correlations` endpoint analyzes the relationship between environmental risks and health signals:

### Risk Levels
- **URGENT** - Both environmental risk (>70) and elevated health signals present
- **HIGH** - Environmental risk (>50) with health signals, or very high environmental risk
- **MEDIUM** - Moderate environmental risk or some health signals present
- **LOW** - Low environmental risk factors
- **NORMAL** - No significant risks

### Correlation Score (0-100)
- **80-100**: URGENT - Immediate action required
- **60-79**: HIGH - Priority intervention needed
- **40-59**: MEDIUM - Enhanced monitoring required
- **20-39**: LOW - Standard monitoring
- **0-19**: NORMAL - Routine assessments

### Linked Risks Examples
- "High debris risk + Respiratory signals detected"
- "Water contamination + Gastrointestinal signals detected"
- "Water/hygiene issues + Skin condition signals detected"

---

## CORS Configuration

The API allows cross-origin requests from:
- `http://localhost:5174` (Vite dev server)
- `http://localhost:3000` (React/Next.js)

---

## Database

- **Type**: H2 In-Memory Database
- **Console**: Available at `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:healthmapdb`
- **Username**: `sa`
- **Password**: (empty)

---

## Notes

✅ All health signal endpoints are now active
✅ Correlation analysis endpoint available
✅ Backend is running on port 8080
✅ CORS enabled for frontend integration

### Next Steps for Frontend Integration

1. Update API calls to use the health signals endpoints
2. Implement health signal entry form
3. Display correlation data on dashboard
4. Add health signal visualization on map
5. Show combined risk indicators

### Example Frontend API Calls

```javascript
// Create health signal
const createSignal = async (data) => {
  return axios.post('http://localhost:8080/api/health-signals', data);
};

// Get recent signals
const getRecentSignals = async (days = 7) => {
  return axios.get(`http://localhost:8080/api/health-signals/recent?days=${days}`);
};

// Get correlations
const getCorrelations = async () => {
  return axios.get('http://localhost:8080/api/stats/correlations');
};
```
