-- ============================================
-- MMW INDUSTRIAL PLATFORM MIGRATION SCRIPT
-- ============================================
-- IMPORTANT: Run this script in the Supabase SQL Editor to wipe the old hygiene products,
-- upgrade the database schema, and insert 30+ new industrial machinery products!

-- 1. UPGRADE SCHEMA
ALTER TABLE products 
  DROP COLUMN IF EXISTS ingredients,
  DROP COLUMN IF EXISTS certifications,
  DROP COLUMN IF EXISTS benefits,
  ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS is_quote_only BOOLEAN DEFAULT false;

CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'responded', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FIX SCHEMA CONSTRAINTS & CLEAR EXISTING CATALOG DATA
-- Fix contradictory constraints on order_items where it tries to SET NULL but the column is NOT NULL
ALTER TABLE order_items ALTER COLUMN product_id DROP NOT NULL;

-- Note: product_images, reviews, cart_items etc. will cascade delete.
-- order_items will have their product_id set to NULL to preserve past order history.
DELETE FROM products;
DELETE FROM categories;

-- 3. INSERT CATEGORIES (Using predictable UUIDs for easy relation mapping)
INSERT INTO categories (id, name, slug, description, display_order, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'Power Tools', 'power-tools', 'Heavy duty professional power tools for industrial applications.', 1, true),
('22222222-2222-2222-2222-222222222222', 'Heavy Machinery', 'heavy-machinery', 'Large scale industrial equipment and factory machinery.', 2, true),
('33333333-3333-3333-3333-333333333333', 'Welding & Soldering', 'welding', 'Professional welding machines, plasma cutters, and supplies.', 3, true),
('44444444-4444-4444-4444-444444444444', 'CNC & Precision', 'cnc', 'Computer Numerical Control machines, spindles, and precision measurement tools.', 4, true),
('55555555-5555-5555-5555-555555555555', 'Safety Gear', 'safety', 'Industrial-grade protective equipment and safety apparel.', 5, true);

-- 4. INSERT PRODUCTS
-- We will insert 30 products across the 5 categories.

-- ================= CATEGORY 1: POWER TOOLS =================
INSERT INTO products (id, category_id, name, slug, short_description, description, base_price, sku, stock_quantity, is_active, is_featured, is_quote_only, specifications) VALUES
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'Industrial Angle Grinder 9-Inch', 'angle-grinder-9in', 'Heavy-duty 9-inch angle grinder for metal fabrication.', 'Engineered for extreme metalworking tasks, this 9-inch angle grinder features a 15-amp motor that delivers up to 6,000 RPM. Built with a dust-ejection system and epoxy-coated motor for maximum durability in harsh environments.', 249.99, 'PT-AG9-001', 50, true, true, false, '{"Power": "15 Amp", "RPM": "6000", "Spindle Thread": "5/8-11", "Weight": "11.5 lbs", "Wheel Diameter": "9 Inch"}'),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'SDS Max Rotary Hammer Drill', 'sds-max-rotary-hammer', 'Professional grade rotary hammer for concrete and masonry.', 'The ultimate tool for drilling and chiseling hard concrete. Features vibration control and constant response circuitry for reliable performance under heavy loads.', 599.00, 'PT-RH-002', 30, true, true, false, '{"Impact Energy": "10.5 ft-lbs", "Max Hole Diameter": "1-3/4 Inch", "Vibration": "8.0 m/s2", "Weight": "17.4 lbs"}'),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'Heavy Duty Magnetic Drill Press', 'mag-drill-press', 'Portable 2-speed magnetic drill press with 2-inch capacity.', 'Ideal for structural steel fabrication. This mag drill produces 2,200 lbs of magnetic holding force and features a 2-speed gearbox for optimal cutting speeds.', 899.50, 'PT-MD-003', 15, true, false, false, '{"Motor": "13 Amp", "Max Diameter": "2 Inch", "Magnetic Force": "2200 lbs", "Weight": "35 lbs", "Speeds": "300/450 RPM"}'),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'Cordless 1-Inch Impact Wrench', 'cordless-impact-1in', 'High-torque 1-inch drive cordless impact wrench.', 'Delivers up to 2,000 ft-lbs of nut-busting torque. Eliminates the need for pneumatic hoses in heavy equipment maintenance.', 750.00, 'PT-IW-004', 25, true, false, false, '{"Drive Size": "1 Inch", "Max Torque": "2000 ft-lbs", "Battery": "18V / 8.0Ah", "Weight": "15 lbs (with battery)"}'),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'Industrial Demolition Breaker', 'demo-breaker-jackhammer', '70-lb class demolition breaker jackhammer.', 'Unmatched power for breaking foundations and thick concrete slabs. Features active vibration reduction and a grease-packed gearbox.', 1250.00, 'PT-DB-005', 10, true, false, false, '{"Impact Energy": "50 ft-lbs", "Blows Per Minute": "900 BPM", "Chuck Type": "1-1/8 Hex", "Weight": "65 lbs"}'),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'Metal Cutting Circular Saw', 'metal-circular-saw', '8-inch metal cutting saw with chip collector.', 'Cuts through steel plate, pipe, and angle iron with virtually no sparks or heat. Features an integrated chip collection chamber.', 345.00, 'PT-MCS-006', 40, true, false, false, '{"Blade Diameter": "8 Inch", "Max Cut Depth": "2-9/16 Inch", "Motor": "15 Amp", "RPM": "3500"}'),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111', 'Heavy Duty Belt Sander', 'industrial-belt-sander', '4x24-inch continuous duty belt sander.', 'Designed for aggressive material removal in industrial woodworking and metalworking facilities.', 280.00, 'PT-BS-007', 35, true, false, false, '{"Belt Size": "4 x 24 Inch", "Speed": "1200 FPM", "Motor": "10 Amp", "Dust Collection": "Active"}');

-- ================= CATEGORY 2: HEAVY MACHINERY =================
-- Note: Many of these are is_quote_only = true due to high price and logistics
INSERT INTO products (id, category_id, name, slug, short_description, description, base_price, sku, stock_quantity, is_active, is_featured, is_quote_only, specifications) VALUES
(uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'Hydraulic Press Brake 100-Ton', 'press-brake-100t', '100-ton hydraulic press brake with CNC control.', 'State-of-the-art sheet metal bending machinery. Features a full CNC controller for precise angle calculations and automated backgauge positioning. Ideal for precision manufacturing.', 45000.00, 'HM-PB-100T', 2, true, true, true, '{"Bending Force": "100 Ton", "Bending Length": "3200mm", "Controller": "Delem DA-53T", "Motor": "7.5 kW", "Weight": "6000 kg"}'),
(uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'Industrial Air Compressor 50HP', 'rotary-screw-compressor-50hp', '50HP rotary screw air compressor for factory air supply.', 'Continuous duty rotary screw compressor delivering 200 CFM at 125 PSI. Features a sound-attenuating enclosure and intelligent electronic controller.', 12500.00, 'HM-AC-50HP', 5, true, true, true, '{"Motor": "50 HP / 37 kW", "Airflow": "200 CFM", "Max Pressure": "125 PSI", "Noise Level": "68 dB", "Phase": "3-Phase 460V"}'),
(uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'Fully Automatic Bandsaw', 'auto-bandsaw', 'Dual-column fully automatic metal cutting bandsaw.', 'Programmable cutting length and part counting. Features hydraulic vise clamping and automatic feed for high-volume production cutting of steel bars and tubes.', 22000.00, 'HM-BS-AUTO', 3, true, false, true, '{"Cutting Capacity": "300mm Round", "Blade Speed": "20-100 m/min Variable", "Motor": "4.0 kW", "Weight": "1500 kg"}'),
(uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'Electric Forklift 3-Ton', 'electric-forklift-3t', '3-ton capacity electric counterbalance forklift.', 'Zero-emission indoor logistics solution. Features a triplex mast, side-shift, and high-capacity lithium-ion battery for multi-shift operations.', 32000.00, 'HM-FL-3T', 4, true, false, true, '{"Capacity": "3000 kg", "Lift Height": "4500 mm", "Battery": "80V / 400Ah Lithium", "Tires": "Solid"}'),
(uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'Industrial Parts Washer', 'parts-washer-heated', 'Heated high-pressure industrial parts washing cabinet.', 'Aqueous parts washer for degreasing engine blocks and heavy machinery components. Features a motorized turntable and 5HP wash pump.', 4500.00, 'HM-PW-01', 8, true, false, false, '{"Turntable Diameter": "30 Inch", "Working Height": "40 Inch", "Pump": "5 HP", "Heater": "9 kW", "Weight": "650 lbs"}'),
(uuid_generate_v4(), '22222222-2222-2222-2222-222222222222', 'Overhead Bridge Crane 5-Ton', 'bridge-crane-5t', '5-ton single girder overhead bridge crane system.', 'Custom-spanned overhead lifting solution for manufacturing bays. Includes electric wire rope hoist and pendant control.', 18000.00, 'HM-BC-5T', 0, true, false, true, '{"Capacity": "5 Ton", "Span": "Up to 60 ft", "Hoist Speed": "16/5 fpm", "Power": "460V 3-Phase"}');

-- ================= CATEGORY 3: WELDING & SOLDERING =================
INSERT INTO products (id, category_id, name, slug, short_description, description, base_price, sku, stock_quantity, is_active, is_featured, is_quote_only, specifications) VALUES
(uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'MIG Welder 250A Pulse', 'mig-welder-250a', 'Professional 250A synergic pulse MIG welding machine.', 'Advanced inverter technology offering pulse and double pulse MIG capabilities for flawless aluminum and stainless steel welding. Includes heavy-duty wire feeder.', 2199.00, 'WS-MIG-250', 12, true, true, false, '{"Amperage Range": "10-250A", "Duty Cycle": "60% @ 250A", "Wire Diameter": "0.8 - 1.2mm", "Processes": "MIG, Pulse MIG, Stick", "Input Power": "220V 1-Phase"}'),
(uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'TIG Welder AC/DC 315A', 'tig-welder-315a', 'Industrial 315A AC/DC TIG welder with water cooler.', 'The ultimate precision welding machine for aerospace and pipe welding. Features advanced AC wave shaping, high-frequency start, and integrated water cooling unit.', 3450.00, 'WS-TIG-315', 8, true, false, false, '{"Amperage Range": "5-315A", "Duty Cycle": "100% @ 250A", "Cooling": "Water Cooled", "Processes": "AC/DC TIG, Stick", "Input Power": "460V 3-Phase"}'),
(uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'CNC Plasma Cutter 80A', 'plasma-cutter-80a', '80 Amp air plasma cutting system.', 'Cuts up to 1-inch thick mild steel. Compatible with CNC tables for automated shape cutting or hand-held torch operation.', 1850.00, 'WS-PL-80', 15, true, false, false, '{"Max Cut Thickness": "1 Inch", "Severance Cut": "1-1/2 Inch", "Duty Cycle": "60% @ 80A", "Air Pressure req": "90 PSI"}'),
(uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'Engine Driven Welder/Generator', 'engine-welder-gen', '10,000 Watt generator and 250A stick welder combo.', 'Perfect for field repairs and construction sites. Powered by a reliable Kohler gas engine, providing auxiliary power and smooth DC welding arcs.', 5200.00, 'WS-EG-250', 5, true, false, true, '{"Generator Output": "10000W Peak / 9000W Continuous", "Welding Output": "250A DC", "Engine": "Kohler 23HP", "Fuel Tank": "12 Gallons"}'),
(uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'Fume Extraction Arm', 'fume-extractor', 'Articulating welding fume extraction arm and filter.', 'Protects operators from harmful welding fumes. Features a 10-foot articulating arm and HEPA filtration unit.', 1600.00, 'WS-FE-01', 10, true, false, false, '{"Arm Length": "10 ft", "Airflow": "750 CFM", "Filter Type": "HEPA / Carbon", "Noise Level": "65 dB"}'),
(uuid_generate_v4(), '33333333-3333-3333-3333-333333333333', 'Welding Positioner 500kg', 'weld-positioner-500', 'Rotary welding positioner table with 500kg capacity.', 'Improves weld quality and speed by allowing the operator to weld in the flat position. Features variable speed foot pedal control.', 1200.00, 'WS-WP-500', 7, true, false, false, '{"Load Capacity": "500 kg", "Rotation Speed": "0.1 - 1.2 RPM", "Tilt Range": "0 - 90 Degrees", "Table Diameter": "600mm"}');

-- ================= CATEGORY 4: CNC & PRECISION =================
INSERT INTO products (id, category_id, name, slug, short_description, description, base_price, sku, stock_quantity, is_active, is_featured, is_quote_only, specifications) VALUES
(uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', '5-Axis CNC Milling Center', 'cnc-mill-5axis', 'High-speed 5-axis vertical machining center.', 'Designed for complex aerospace and medical components. Features a 24,000 RPM spindle, 40-tool ATC, and Renishaw probing system.', 145000.00, 'CNC-VMC-5X', 1, true, true, true, '{"Axes": "5 (X,Y,Z,A,C)", "Spindle Speed": "24000 RPM", "Tool Capacity": "40", "Controller": "Fanuc 31i", "Accuracy": "0.0001 inch"}'),
(uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'CNC Turning Center (Lathe)', 'cnc-lathe', 'Slant bed CNC lathe with live tooling.', 'High-production turning center with y-axis milling capabilities and a 12-station servo turret.', 65000.00, 'CNC-TC-Y', 2, true, false, true, '{"Max Turning Dia": "14 Inch", "Bar Capacity": "2.5 Inch", "Turret": "12 Station Live", "Spindle RPM": "4500", "Controller": "Siemens 828D"}'),
(uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'Precision Granite Surface Plate', 'granite-plate-36', '36x24 inch Grade AA precision granite surface plate.', 'Laboratory grade granite surface plate for absolute measurement reference. Includes heavy-duty steel stand.', 850.00, 'CNC-GP-3624', 10, true, false, false, '{"Dimensions": "36 x 24 x 6 Inch", "Grade": "AA (Laboratory)", "Flatness Tolerance": "0.00005 Inch", "Material": "Black Granite"}'),
(uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'Digital Height Gauge 24-Inch', 'digital-height-gauge', 'High-accuracy motorized digital height gauge.', 'Used for precision measurement of machined parts. Features air bearings for smooth movement and statistical data output.', 4200.00, 'CNC-HG-24', 5, true, false, false, '{"Range": "24 Inch / 600mm", "Resolution": "0.00001 Inch", "Accuracy": "+/- 0.0001 Inch", "Data Output": "USB / Bluetooth"}'),
(uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'Carbide End Mill Set', 'endmill-set-carbide', '12-piece solid carbide variable flute end mill set.', 'High-performance end mills with AlTiN coating for machining titanium, inconel, and hardened steels.', 399.99, 'CNC-EM-SET12', 45, true, false, false, '{"Material": "Micro-grain Solid Carbide", "Coating": "AlTiN", "Flutes": "4 (Variable Pitch)", "Sizes": "1/8 to 1 Inch"}'),
(uuid_generate_v4(), '44444444-4444-4444-4444-444444444444', 'Zero-Point Clamping System', 'zero-point-chuck', 'Pneumatic zero-point clamping base for CNC tables.', 'Reduces setup time by 90%. Allows for rapid fixture and vise swapping with 5-micron repeatability.', 1250.00, 'CNC-ZP-01', 12, true, false, false, '{"Clamping Force": "25 kN", "Repeatability": "0.005 mm", "Actuation": "Pneumatic 6 Bar", "Material": "Hardened Stainless Steel"}');

-- ================= CATEGORY 5: SAFETY GEAR =================
INSERT INTO products (id, category_id, name, slug, short_description, description, base_price, sku, stock_quantity, is_active, is_featured, is_quote_only, specifications) VALUES
(uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 'Auto-Darkening Welding Helmet', 'weld-helmet-auto', 'True-color panoramic auto-darkening welding hood.', 'Features four optical sensors, a massive 4x4 inch viewing area, and true-color lens technology to reduce eye strain.', 199.99, 'SAF-WH-001', 60, true, true, false, '{"Viewing Area": "4 x 4 Inch", "Shade Range": "5-13 Variable", "Sensors": "4", "Reaction Time": "1/25,000 sec"}'),
(uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 'PAPR Respirator System', 'papr-respirator', 'Powered Air Purifying Respirator for industrial hazards.', 'Provides continuous positive pressure filtered air to the user. Essential for grinding silica or welding galvanized steel.', 1150.00, 'SAF-PAPR-01', 15, true, false, false, '{"Filter Type": "HEPA / Particulate", "Battery Life": "8-12 Hours", "Airflow": "Adjustable (170-210 lpm)", "Weight": "2.5 lbs (belt unit)"}'),
(uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 'Cut-Resistant Gloves (Level A6)', 'gloves-cut-a6', 'Pack of 12 Kevlar-reinforced A6 cut resistant gloves.', 'High-dexterity work gloves featuring nitrile dipped palms for grip in oily environments while providing extreme cut protection.', 120.00, 'SAF-GL-A6-12', 200, true, false, false, '{"Cut Level": "ANSI A6", "Material": "Kevlar / Steel Mesh Blend", "Coating": "Micro-foam Nitrile", "Pack Size": "12 Pairs"}'),
(uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 'Steel Toe Metatarsal Boots', 'work-boots-meta', 'Heavy duty industrial boots with metatarsal guard.', 'Full-grain leather boots featuring a steel toe, external metatarsal impact guard, and puncture-resistant soles.', 185.00, 'SAF-BT-MT', 40, true, false, false, '{"Safety Rating": "ASTM F2413-18 M/I/C Mt EH PR", "Material": "Full Grain Leather", "Toe Type": "Steel", "Sole": "Slip/Oil Resistant Rubber"}'),
(uuid_generate_v4(), '55555555-5555-5555-5555-555555555555', 'Chemical Spill Response Kit', 'spill-kit-50gal', '50-gallon universal chemical spill response drum.', 'Includes absorbent pads, socks, disposal bags, and PPE to rapidly contain and absorb hazardous liquid spills in the factory.', 250.00, 'SAF-SK-50', 25, true, false, false, '{"Capacity": "50 Gallons", "Type": "Universal / Chemical", "Container": "UN-Rated Overpack Drum", "Includes": "Pads, Socks, PPE, Disposal Bags"}');


-- 5. LINK IMAGES TO PRODUCTS
-- We will link high-quality industrial placeholder images from Unsplash/Pixabay to all products based on their SKU.
-- (Using a single robust query that matches SKUs)

INSERT INTO product_images (product_id, image_url, alt_text, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop', 'Industrial Machinery Tool', true
FROM products WHERE category_id = '11111111-1111-1111-1111-111111111111';

INSERT INTO product_images (product_id, image_url, alt_text, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop', 'Heavy Machinery in Factory', true
FROM products WHERE category_id = '22222222-2222-2222-2222-222222222222';

INSERT INTO product_images (product_id, image_url, alt_text, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop', 'Welding Equipment Sparks', true
FROM products WHERE category_id = '33333333-3333-3333-3333-333333333333';

INSERT INTO product_images (product_id, image_url, alt_text, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1565439390113-d34e2cbf1041?q=80&w=800&auto=format&fit=crop', 'Precision CNC Machine', true
FROM products WHERE category_id = '44444444-4444-4444-4444-444444444444';

INSERT INTO product_images (product_id, image_url, alt_text, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1616422285623-14c1fbb46430?q=80&w=800&auto=format&fit=crop', 'Industrial Safety Gear', true
FROM products WHERE category_id = '55555555-5555-5555-5555-555555555555';

-- Migration Complete.
