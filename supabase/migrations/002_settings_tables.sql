-- Additional tables for gym settings and working hours

-- Gym Settings table
CREATE TABLE IF NOT EXISTS gym_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL DEFAULT 'Grams Gym',
  name_ar TEXT NOT NULL DEFAULT 'جرامز جيم',
  description_en TEXT,
  description_ar TEXT,
  address_en TEXT,
  address_ar TEXT,
  phone TEXT,
  email TEXT,
  instagram TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default gym settings
INSERT INTO gym_settings (name_en, name_ar) VALUES ('Grams Gym', 'جرامز جيم')
ON CONFLICT DO NOTHING;

-- Gym Working Hours table
CREATE TABLE IF NOT EXISTS gym_working_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time TIME,
  close_time TIME,
  is_closed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(day_of_week)
);

-- Insert default working hours (6 AM - 10 PM, closed Friday)
INSERT INTO gym_working_hours (day_of_week, open_time, close_time, is_closed) VALUES
  (0, '06:00', '22:00', false),  -- Sunday
  (1, '06:00', '22:00', false),  -- Monday
  (2, '06:00', '22:00', false),  -- Tuesday
  (3, '06:00', '22:00', false),  -- Wednesday
  (4, '06:00', '22:00', false),  -- Thursday
  (5, '06:00', '22:00', true),   -- Friday (closed)
  (6, '06:00', '22:00', false)   -- Saturday
ON CONFLICT (day_of_week) DO NOTHING;

-- Add specialization column to coaches if it doesn't exist
ALTER TABLE coaches ADD COLUMN IF NOT EXISTS specialization TEXT;

-- Update pricing table type enum to include gym_membership
ALTER TABLE pricing DROP CONSTRAINT IF EXISTS pricing_type_check;
ALTER TABLE pricing ADD CONSTRAINT pricing_type_check CHECK (type IN ('gym_membership', 'pt_package'));

-- RLS Policies for gym_settings
ALTER TABLE gym_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gym settings are viewable by everyone"
  ON gym_settings FOR SELECT
  USING (true);

CREATE POLICY "Coaches can update gym settings"
  ON gym_settings FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM coaches WHERE is_active = true));

CREATE POLICY "Coaches can insert gym settings"
  ON gym_settings FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM coaches WHERE is_active = true));

-- RLS Policies for gym_working_hours
ALTER TABLE gym_working_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Working hours are viewable by everyone"
  ON gym_working_hours FOR SELECT
  USING (true);

CREATE POLICY "Coaches can update working hours"
  ON gym_working_hours FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM coaches WHERE is_active = true));

CREATE POLICY "Coaches can insert working hours"
  ON gym_working_hours FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM coaches WHERE is_active = true));
