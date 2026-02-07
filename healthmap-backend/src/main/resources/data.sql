-- Seed data for HealthMap with Palestine coordinates
-- Gaza Strip: ~31.5, 34.45
-- West Bank: ~31.9, 35.2

-- Clear existing data
DELETE FROM assessments;

-- Gaza Strip - Critical Risk Sites
INSERT INTO assessments (latitude, longitude, image_path, site_type, building_age, dust_present, old_materials, near_population, sewage_visible, standing_water, material_type, asbestos_risk, water_risk, overall_risk, priority, notes, created_by, created_at, updated_at)
VALUES
(31.5152, 34.4431, NULL, 'BOTH', 'OLD', true, true, true, true, true, 'Asbestos-containing materials likely', 90, 90, 90, 'CRITICAL', 'Collapsed residential building near Al-Shifa area. Heavy debris with visible asbestos materials. Sewage overflow detected.', 'field_worker_1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.5048, 34.4598, NULL, 'DEBRIS', 'OLD', true, true, true, false, false, 'Asbestos-containing materials likely', 90, 20, 62, 'HIGH', 'Former industrial site with extensive debris. Multiple buildings collapsed. High dust levels.', 'field_worker_1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.5289, 34.4367, NULL, 'WATER', 'UNKNOWN', false, false, true, true, true, 'Mixed/Unknown materials', 15, 90, 45, 'MEDIUM', 'Water contamination site near residential area. Sewage mixing with groundwater.', 'field_worker_2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.4923, 34.4712, NULL, 'BOTH', 'OLD', true, true, true, true, false, 'Old cement/concrete', 90, 60, 78, 'CRITICAL', 'School building debris. High priority due to proximity to temporary shelters.', 'field_worker_1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.5367, 34.4289, NULL, 'DEBRIS', 'MODERN', true, false, true, false, false, 'Modern concrete', 35, 20, 29, 'LOW', 'Recent construction debris. Lower asbestos risk but near populated area.', 'field_worker_3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Gaza Strip - High Risk Sites
(31.5198, 34.4523, NULL, 'BOTH', 'OLD', true, true, false, true, true, 'Asbestos-containing materials likely', 75, 90, 81, 'CRITICAL', 'Hospital complex debris with severe water contamination. Urgent intervention needed.', 'field_worker_2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.4876, 34.4834, NULL, 'DEBRIS', 'OLD', true, true, true, false, false, 'Old cement/concrete', 90, 20, 62, 'HIGH', 'Old apartment complex collapsed. Dust spreading to nearby tents.', 'field_worker_1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.5412, 34.4156, NULL, 'WATER', 'UNKNOWN', false, false, true, true, true, 'Mixed/Unknown materials', 15, 90, 45, 'MEDIUM', 'Agricultural area with contaminated irrigation water.', 'field_worker_3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Gaza Strip - Medium Risk Sites
(31.5034, 34.4645, NULL, 'DEBRIS', 'MODERN', true, false, false, false, false, 'Modern concrete', 20, 0, 12, 'LOW', 'Recent building debris. No immediate health hazards detected.', 'field_worker_2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.5267, 34.4398, NULL, 'BOTH', 'OLD', false, true, true, false, true, 'Old cement/concrete', 55, 50, 53, 'HIGH', 'Mixed debris site with stagnant water pools. Mosquito breeding observed.', 'field_worker_1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Rafah Area
(31.2876, 34.2456, NULL, 'BOTH', 'OLD', true, true, true, true, true, 'Asbestos-containing materials likely', 90, 90, 90, 'CRITICAL', 'Border area with extensive destruction. Multiple hazards present.', 'field_worker_4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.2934, 34.2523, NULL, 'WATER', 'UNKNOWN', false, false, true, true, false, 'Mixed/Unknown materials', 15, 60, 33, 'MEDIUM', 'Water supply contamination. Sewage leakage into water lines.', 'field_worker_4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.2812, 34.2589, NULL, 'DEBRIS', 'OLD', true, true, false, false, false, 'Asbestos-containing materials likely', 75, 0, 45, 'MEDIUM', 'Commercial building rubble. Away from current population centers.', 'field_worker_4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Khan Younis Area
(31.3456, 34.3023, NULL, 'BOTH', 'OLD', true, true, true, false, true, 'Old cement/concrete', 90, 50, 74, 'CRITICAL', 'Residential complex with displaced families nearby. High exposure risk.', 'field_worker_5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.3512, 34.3098, NULL, 'DEBRIS', 'MODERN', false, false, true, false, false, 'Modern concrete', 15, 20, 17, 'LOW', 'New construction debris. Minimal health risk.', 'field_worker_5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.3389, 34.2978, NULL, 'WATER', 'UNKNOWN', false, false, true, true, true, 'Mixed/Unknown materials', 15, 90, 45, 'MEDIUM', 'Well contamination affecting multiple families.', 'field_worker_5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- North Gaza
(31.5523, 34.4867, NULL, 'BOTH', 'OLD', true, true, true, true, false, 'Asbestos-containing materials likely', 90, 60, 78, 'CRITICAL', 'Industrial zone debris with chemical contamination suspected.', 'field_worker_6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.5589, 34.4934, NULL, 'DEBRIS', 'OLD', true, true, false, false, false, 'Old cement/concrete', 75, 0, 45, 'MEDIUM', 'Old factory building collapse. Area currently unoccupied.', 'field_worker_6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.5456, 34.4789, NULL, 'WATER', 'UNKNOWN', false, false, true, false, true, 'Mixed/Unknown materials', 15, 50, 29, 'LOW', 'Rainwater collection contaminated with debris particles.', 'field_worker_6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- West Bank - Jenin Area
(32.4612, 35.2934, NULL, 'DEBRIS', 'OLD', true, true, true, false, false, 'Old cement/concrete', 90, 20, 62, 'HIGH', 'Refugee camp area with building damage. Dense population.', 'field_worker_7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(32.4534, 35.2867, NULL, 'BOTH', 'OLD', false, true, true, true, true, 'Asbestos-containing materials likely', 55, 90, 69, 'HIGH', 'Combined infrastructure damage. Water and debris hazards.', 'field_worker_7', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- West Bank - Nablus Area
(32.2212, 35.2534, NULL, 'DEBRIS', 'MODERN', true, false, false, false, false, 'Modern concrete', 20, 0, 12, 'LOW', 'Construction site debris. Standard cleanup required.', 'field_worker_8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(32.2289, 35.2612, NULL, 'WATER', 'UNKNOWN', false, false, false, true, true, 'Mixed/Unknown materials', 0, 70, 28, 'LOW', 'Spring water contamination. Low population exposure.', 'field_worker_8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- West Bank - Hebron Area
(31.5298, 35.0934, NULL, 'BOTH', 'OLD', true, true, true, false, false, 'Old cement/concrete', 90, 20, 62, 'HIGH', 'Old city area with structural damage. Historic building materials.', 'field_worker_9', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.5234, 35.0867, NULL, 'DEBRIS', 'OLD', true, true, false, false, false, 'Asbestos-containing materials likely', 75, 0, 45, 'MEDIUM', 'Warehouse collapse. Possible asbestos insulation.', 'field_worker_9', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Additional Gaza sites for demo density
(31.5089, 34.4567, NULL, 'BOTH', 'OLD', true, true, true, true, true, 'Asbestos-containing materials likely', 90, 90, 90, 'CRITICAL', 'Multi-story residential collapse. Maximum risk indicators.', 'field_worker_1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.5134, 34.4489, NULL, 'DEBRIS', 'OLD', false, true, true, false, false, 'Old cement/concrete', 55, 20, 41, 'MEDIUM', 'Partial building collapse. Some materials exposed.', 'field_worker_2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.5178, 34.4612, NULL, 'WATER', 'UNKNOWN', false, false, true, false, true, 'Mixed/Unknown materials', 15, 50, 29, 'LOW', 'Standing water near debris. Monitor for contamination.', 'field_worker_3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.4998, 34.4534, NULL, 'BOTH', 'OLD', true, true, true, true, false, 'Asbestos-containing materials likely', 90, 60, 78, 'CRITICAL', 'Market area destruction. High foot traffic nearby.', 'field_worker_1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(31.5223, 34.4378, NULL, 'DEBRIS', 'MODERN', true, false, true, false, false, 'Modern concrete', 35, 20, 29, 'LOW', 'Newer building debris. Standard precautions needed.', 'field_worker_2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Health Signals Data
-- Clear existing health signals
DELETE FROM health_signals;

-- Gaza Central - Al-Shifa Area (Critical respiratory signals)
INSERT INTO health_signals (area_id, area_name, signal_date, signal_type, signal_level, source, notes, latitude, longitude, reported_by, created_at, updated_at)
VALUES
('gaza_central_01', 'Al-Shifa District', CURRENT_DATE, 'RESPIRATORY', 'ELEVATED', 'CLINIC', 'Increased respiratory complaints reported. Likely related to nearby debris sites with high dust levels.', 31.5152, 34.4431, 'Dr. Ahmad Hassan', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('gaza_central_01', 'Al-Shifa District', CURRENT_DATE - 1, 'RESPIRATORY', 'ELEVATED', 'FIELD_TEAM', 'Field team reports continued coughing and breathing difficulties among residents near debris sites.', 31.5152, 34.4431, 'Field Team Alpha', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('gaza_central_01', 'Al-Shifa District', CURRENT_DATE, 'GASTROINTESTINAL', 'ELEVATED', 'CLINIC', 'Multiple cases of gastrointestinal symptoms. Water contamination suspected.', 31.5152, 34.4431, 'Dr. Ahmad Hassan', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('gaza_central_01', 'Al-Shifa District', CURRENT_DATE, 'SKIN', 'NORMAL', 'CLINIC', 'Skin conditions within normal range for the area.', 31.5152, 34.4431, 'Dr. Ahmad Hassan', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Rafah Area (Water-related signals)
('rafah_border_01', 'Rafah Border District', CURRENT_DATE, 'GASTROINTESTINAL', 'ELEVATED', 'MOBILE_UNIT', 'Significant increase in diarrhea cases. Sewage contamination of water supply confirmed.', 31.2876, 34.2456, 'Mobile Health Unit 3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('rafah_border_01', 'Rafah Border District', CURRENT_DATE - 1, 'GASTROINTESTINAL', 'ELEVATED', 'CLINIC', 'Continued GI symptoms. Water testing recommended.', 31.2876, 34.2456, 'Nurse Fatima', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('rafah_border_01', 'Rafah Border District', CURRENT_DATE, 'RESPIRATORY', 'NORMAL', 'CLINIC', 'Respiratory symptoms within expected range.', 31.2876, 34.2456, 'Nurse Fatima', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('rafah_border_01', 'Rafah Border District', CURRENT_DATE, 'SKIN', 'ELEVATED', 'MOBILE_UNIT', 'Increased skin rashes and infections. Linked to water quality and hygiene conditions.', 31.2876, 34.2456, 'Mobile Health Unit 3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Khan Younis (Mixed signals)
('khan_younis_01', 'Khan Younis Central', CURRENT_DATE, 'RESPIRATORY', 'ELEVATED', 'CLINIC', 'Respiratory issues among families near collapsed residential complex.', 31.3456, 34.3023, 'Dr. Youssef', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('khan_younis_01', 'Khan Younis Central', CURRENT_DATE, 'GASTROINTESTINAL', 'NORMAL', 'CLINIC', 'GI symptoms within normal baseline.', 31.3456, 34.3023, 'Dr. Youssef', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('khan_younis_01', 'Khan Younis Central', CURRENT_DATE, 'SKIN', 'NORMAL', 'FIELD_TEAM', 'No unusual skin conditions observed.', 31.3456, 34.3023, 'Field Team Beta', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- North Gaza (Industrial area - respiratory focus)
('north_gaza_01', 'North Gaza Industrial Zone', CURRENT_DATE, 'RESPIRATORY', 'ELEVATED', 'FIELD_TEAM', 'Severe respiratory symptoms near industrial debris. Chemical exposure suspected.', 31.5523, 34.4867, 'Field Team Gamma', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('north_gaza_01', 'North Gaza Industrial Zone', CURRENT_DATE - 1, 'RESPIRATORY', 'ELEVATED', 'CLINIC', 'Persistent respiratory complaints. Area evacuation may be needed.', 31.5523, 34.4867, 'Dr. Layla', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('north_gaza_01', 'North Gaza Industrial Zone', CURRENT_DATE, 'GASTROINTESTINAL', 'NORMAL', 'CLINIC', 'No significant GI issues reported.', 31.5523, 34.4867, 'Dr. Layla', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('north_gaza_01', 'North Gaza Industrial Zone', CURRENT_DATE, 'SKIN', 'NORMAL', 'CLINIC', 'Skin conditions normal.', 31.5523, 34.4867, 'Dr. Layla', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Gaza North - Lower Risk Area (All normal)
('gaza_north_02', 'Gaza North Residential', CURRENT_DATE, 'RESPIRATORY', 'NORMAL', 'CLINIC', 'All health indicators normal in this area.', 31.5589, 34.4934, 'Nurse Ibrahim', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('gaza_north_02', 'Gaza North Residential', CURRENT_DATE, 'GASTROINTESTINAL', 'NORMAL', 'CLINIC', 'No unusual GI symptoms.', 31.5589, 34.4934, 'Nurse Ibrahim', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('gaza_north_02', 'Gaza North Residential', CURRENT_DATE, 'SKIN', 'NORMAL', 'CLINIC', 'Skin health within normal parameters.', 31.5589, 34.4934, 'Nurse Ibrahim', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
