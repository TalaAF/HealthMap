# Health Signal Module - Quick Start Guide

## 🎯 What is the Health Signal Module?

A **Public Health Early Warning System** that monitors community health patterns and links them to environmental hazards. It provides **signals, not diagnoses**.

**Time to first entry**: < 5 minutes  
**Time per health signal entry**: < 30 seconds

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Start the Backend (1 minute)
```bash
cd healthmap-backend
mvn spring-boot:run
```
✅ Backend ready at `http://localhost:8080`

### Step 2: Start the Dashboard (1 minute)
```bash
cd healthmap-dashboard
npm install
npm run dev
```
✅ Dashboard ready at `http://localhost:5173`

### Step 3: Open Health Signals (30 seconds)
1. Navigate to `http://localhost:5173`
2. Click **"🏥 Health Signals"** in the top navigation
3. You'll see sample health signal data loaded

✅ **You're ready!**

---

## 📱 Mobile App (Optional)

```bash
cd healthmap-mobile
npm install
npx expo start
```
- Press `a` for Android emulator
- Press `i` for iOS simulator
- Or scan QR code with Expo Go app

---

## 🎬 Your First Health Signal (30 seconds)

### Web Dashboard:
1. Click **"+ Add Health Signal"** button
2. Fill in:
   - **Area Name**: e.g., "Test District"
   - **Signal Type**: Choose one (🔴 Respiratory / 🟠 GI / 🟡 Skin)
   - **Level**: Normal or Elevated
   - **Source**: Choose one (Clinic/Field Team/etc.)
   - **Location**: Enter coordinates (or use: 31.5, 34.4)
3. Click **"✅ Submit Health Signal"**

### Mobile App:
1. Tap **"🏥 Health"** tab at bottom
2. Tap **"+ Add Health Signal"**
3. Fill basic info (location auto-captured)
4. Tap **"✅ Submit Health Signal"**

---

## 📊 Viewing Health Signals

### Dashboard Overview
- **Stats Cards**: See total, elevated, and normal signals
- **Area Summaries**: View signals grouped by location with risk indicators
- **Recent Signals List**: All signals with filters

### What You'll See:
```
Al-Shifa District
🔴 Respiratory: Elevated
🟠 Gastrointestinal: Elevated  
🟡 Skin: Normal
⚠️ Health Risk Detected
```

---

## 🔍 Understanding the 3 Signal Types

### 🔴 Respiratory Signal
**Look for**: Coughing, breathing difficulties  
**Often caused by**: Dust, debris, old materials  
**Example**: "Increased coughing near collapsed buildings"

### 🟠 Gastrointestinal Signal  
**Look for**: Diarrhea, vomiting, stomach issues  
**Often caused by**: Contaminated water, sewage  
**Example**: "Multiple GI cases near water contamination site"

### 🟡 Skin Signal
**Look for**: Rashes, infections, itching  
**Often caused by**: Poor water quality, hygiene issues  
**Example**: "Skin irritations in overcrowded area"

---

## 📈 Sample Scenario

### Scenario: Field Team Reports Respiratory Issues

#### 1️⃣ Field Team Entry (Mobile)
```
Area: Al-Shifa District
Type: 🔴 Respiratory
Level: Elevated
Notes: "Increased coughing among residents near debris site"
```

#### 2️⃣ Manager Views Dashboard (Web)
```
Health Signals - This Week
━━━━━━━━━━━━━━━━━━━━━━━━
Al-Shifa District
🔴 Respiratory: ELEVATED ⚠️
━━━━━━━━━━━━━━━━━━━━━━━━
Linked to 2 high-risk debris sites
Recommendations:
- Deploy PPE to workers
- Notify nearby clinics
- Schedule urgent debris assessment
```

#### 3️⃣ Decision Made
Priority upgraded to **CRITICAL**  
Resources allocated within hours, not days

---

## 🎯 Common Use Cases

### Use Case 1: Daily Field Monitoring
**Who**: Field health team  
**When**: Daily rounds  
**How**: Mobile app, < 30 sec per area  
**Value**: Early detection of unusual patterns

### Use Case 2: Clinic Reporting
**Who**: Clinic staff  
**When**: End of day  
**How**: Web dashboard  
**Value**: Track community health trends

### Use Case 3: Emergency Response
**Who**: Response coordinator  
**When**: During crisis  
**How**: Web dashboard statistics  
**Value**: Prioritize intervention areas

---

## 🛠️ API Testing (For Developers)

### Get All Health Signals
```bash
curl http://localhost:8080/api/health-signals
```

### Get Statistics
```bash
curl http://localhost:8080/api/health-signals/stats
```

### Create Health Signal
```bash
curl -X POST http://localhost:8080/api/health-signals \
  -H "Content-Type: application/json" \
  -d '{
    "areaName": "Test Area",
    "signalType": "RESPIRATORY",
    "signalLevel": "ELEVATED",
    "source": "CLINIC",
    "latitude": 31.5,
    "longitude": 34.4,
    "notes": "Test signal"
  }'
```

### Get Recent Signals (Last 7 Days)
```bash
curl http://localhost:8080/api/health-signals/recent?days=7
```

---

## 📚 Sample Data Included

The system comes pre-loaded with **15+ health signals**:
- ✅ Al-Shifa District (elevated respiratory + GI)
- ✅ Rafah Border (elevated GI + skin)
- ✅ Khan Younis (elevated respiratory)
- ✅ North Gaza Industrial Zone (elevated respiratory)
- ✅ Gaza North Residential (all normal)

Explore these to understand the system!

---

## 🔐 Privacy Notice

### What This Module Does:
✅ Tracks **community-level** health patterns  
✅ Links health signals to **environmental factors**  
✅ Supports **public health decisions**

### What This Module Does NOT Do:
❌ Store individual patient records  
❌ Diagnose diseases  
❌ Track personal health information  
❌ Replace medical care

**Important**: This module provides public health signals, not clinical diagnoses.

---

## 🎓 3-Minute Demo Script

### For Presentations:

**Minute 1**: System Overview  
"HealthMap AI now includes health signal monitoring. Our field team in Al-Shifa noticed increased coughing..."

**Minute 2**: Quick Entry Demo  
"They open the mobile app, tap Health Signals, select Respiratory + Elevated, and submit in 20 seconds."

**Minute 3**: Decision Impact  
"The manager sees: Alert - Respiratory issues + High-risk debris site. Decision: Upgrade priority, deploy PPE, notify clinics. What was just damage is now an emerging health risk requiring immediate action."

---

## ❓ FAQ

**Q: How is this different from medical records?**  
A: This tracks **community patterns**, not individual patients. Think "more coughing than usual in this area" not "Patient X has pneumonia."

**Q: Do I need medical training?**  
A: No. If you observe "more stomach issues than usual," that's the signal. No diagnosis needed.

**Q: How often should I submit signals?**  
A: Daily for active monitoring, or whenever you notice something unusual.

**Q: What if I'm not sure if it's elevated?**  
A: Submit as "Normal" with a note. Trends over time matter more than any single entry.

**Q: Can I delete incorrect entries?**  
A: Yes, via the dashboard or API.

---

## 🚀 Next Steps

1. ✅ Set up the system (you just did this!)
2. 📱 Try creating a health signal (web or mobile)
3. 📊 Explore the statistics dashboard
4. 📖 Read full documentation: [HEALTH_SIGNALS_MODULE.md](./HEALTH_SIGNALS_MODULE.md)
5. 🔗 Explore environmental correlation features
6. 🎯 Adapt to your specific use case

---

## 💡 Tips for Success

### For Field Teams:
- 📱 Use mobile app for quick entries
- 📍 Location auto-captured when available
- 📝 Brief notes are better than no notes
- ⚡ Submit daily, even if "Normal"

### For Managers:
- 📊 Check statistics daily
- 🔍 Look for patterns across areas
- 🔗 Correlate with environmental assessments
- 📈 Track trends over time

### For Decision Makers:
- 🎯 Focus on elevated signals
- 🗺️ Use area summaries for geo-planning
- ⚠️ Act on environmental + health correlation
- 📱 Enable field teams with mobile access

---

## 🆘 Need Help?

- **Full Documentation**: [HEALTH_SIGNALS_MODULE.md](./HEALTH_SIGNALS_MODULE.md)
- **API Reference**: Check `README.md` API Endpoints section
- **Sample Data**: Already loaded at startup
- **Database Console**: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:healthmapdb`)

---

**Ready to start monitoring community health? You're all set! 🎉**

*Built with ❤️ for public health and disaster response*
