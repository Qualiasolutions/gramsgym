-- Grams Gym Database Schema
-- Initial migration

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- COACHES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS coaches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  whatsapp_number TEXT,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  bio_en TEXT,
  bio_ar TEXT,
  specialty_en TEXT,
  specialty_ar TEXT,
  profile_photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  whatsapp_number TEXT,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  bio_en TEXT,
  bio_ar TEXT,
  profile_photo_url TEXT,
  assigned_coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
  preferred_language TEXT DEFAULT 'ar' CHECK (preferred_language IN ('ar', 'en')),
  notification_preference TEXT DEFAULT 'whatsapp' CHECK (notification_preference IN ('whatsapp', 'email', 'both')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- GYM MEMBERSHIPS TABLE (Time-based)
-- ============================================
CREATE TABLE IF NOT EXISTS gym_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_paid DECIMAL(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- PT PACKAGES TABLE (Session-based)
-- ============================================
CREATE TABLE IF NOT EXISTS pt_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE RESTRICT,
  total_sessions INTEGER NOT NULL CHECK (total_sessions > 0),
  remaining_sessions INTEGER NOT NULL CHECK (remaining_sessions >= 0),
  price_paid DECIMAL(10,2),
  purchased_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT remaining_lte_total CHECK (remaining_sessions <= total_sessions)
);

-- ============================================
-- COACH AVAILABILITY TABLE (Weekly template)
-- ============================================
CREATE TABLE IF NOT EXISTS coach_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE RESTRICT,
  pt_package_id UUID REFERENCES pt_packages(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60 CHECK (duration_minutes > 0),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  -- Prevent double booking for same coach at same time
  UNIQUE(coach_id, scheduled_at)
);

-- ============================================
-- NOTIFICATIONS LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email')),
  message_content TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- GYM INFO TABLE (Chatbot knowledge base)
-- ============================================
CREATE TABLE IF NOT EXISTS gym_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value_en TEXT NOT NULL,
  value_ar TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- PRICING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('membership', 'pt_package')),
  duration_or_sessions TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================

-- Members indexes
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_assigned_coach ON members(assigned_coach_id);

-- Gym memberships indexes
CREATE INDEX IF NOT EXISTS idx_gym_memberships_member ON gym_memberships(member_id);
CREATE INDEX IF NOT EXISTS idx_gym_memberships_status ON gym_memberships(status);
CREATE INDEX IF NOT EXISTS idx_gym_memberships_end_date ON gym_memberships(end_date);

-- PT packages indexes
CREATE INDEX IF NOT EXISTS idx_pt_packages_member ON pt_packages(member_id);
CREATE INDEX IF NOT EXISTS idx_pt_packages_coach ON pt_packages(coach_id);
CREATE INDEX IF NOT EXISTS idx_pt_packages_status ON pt_packages(status);

-- Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_member ON bookings(member_id);
CREATE INDEX IF NOT EXISTS idx_bookings_coach ON bookings(coach_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_at ON bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Notifications log indexes
CREATE INDEX IF NOT EXISTS idx_notifications_member ON notifications_log(member_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications_log(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE pt_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;

-- ============================================
-- COACHES POLICIES
-- ============================================

-- Coaches can read all coaches
CREATE POLICY "coaches_read_all_coaches" ON coaches
  FOR SELECT USING (true);

-- Only coaches can update their own profile
CREATE POLICY "coaches_update_own" ON coaches
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- MEMBERS POLICIES
-- ============================================

-- Coaches can do everything with members
CREATE POLICY "coaches_full_access_members" ON members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM coaches WHERE coaches.id = auth.uid())
  );

-- Members can read/update their own data
CREATE POLICY "members_read_own" ON members
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "members_update_own" ON members
  FOR UPDATE USING (auth.uid() = id);

-- ============================================
-- GYM MEMBERSHIPS POLICIES
-- ============================================

-- Coaches can do everything
CREATE POLICY "coaches_full_access_gym_memberships" ON gym_memberships
  FOR ALL USING (
    EXISTS (SELECT 1 FROM coaches WHERE coaches.id = auth.uid())
  );

-- Members can read their own memberships
CREATE POLICY "members_read_own_gym_memberships" ON gym_memberships
  FOR SELECT USING (member_id = auth.uid());

-- ============================================
-- PT PACKAGES POLICIES
-- ============================================

-- Coaches can do everything
CREATE POLICY "coaches_full_access_pt_packages" ON pt_packages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM coaches WHERE coaches.id = auth.uid())
  );

-- Members can read their own packages
CREATE POLICY "members_read_own_pt_packages" ON pt_packages
  FOR SELECT USING (member_id = auth.uid());

-- ============================================
-- COACH AVAILABILITY POLICIES
-- ============================================

-- Everyone can read availability (for booking)
CREATE POLICY "public_read_coach_availability" ON coach_availability
  FOR SELECT USING (true);

-- Coaches can manage their own availability
CREATE POLICY "coaches_manage_own_availability" ON coach_availability
  FOR ALL USING (
    EXISTS (SELECT 1 FROM coaches WHERE coaches.id = auth.uid())
  );

-- ============================================
-- BOOKINGS POLICIES
-- ============================================

-- Coaches can do everything
CREATE POLICY "coaches_full_access_bookings" ON bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM coaches WHERE coaches.id = auth.uid())
  );

-- Members can read their own bookings
CREATE POLICY "members_read_own_bookings" ON bookings
  FOR SELECT USING (member_id = auth.uid());

-- Members can create bookings for themselves
CREATE POLICY "members_create_own_bookings" ON bookings
  FOR INSERT WITH CHECK (member_id = auth.uid());

-- Members can cancel their own bookings
CREATE POLICY "members_update_own_bookings" ON bookings
  FOR UPDATE USING (member_id = auth.uid());

-- ============================================
-- NOTIFICATIONS LOG POLICIES
-- ============================================

-- Coaches can do everything
CREATE POLICY "coaches_full_access_notifications" ON notifications_log
  FOR ALL USING (
    EXISTS (SELECT 1 FROM coaches WHERE coaches.id = auth.uid())
  );

-- Members can read their own notifications
CREATE POLICY "members_read_own_notifications" ON notifications_log
  FOR SELECT USING (member_id = auth.uid());

-- ============================================
-- GYM INFO POLICIES
-- ============================================

-- Everyone can read gym info (for chatbot)
CREATE POLICY "public_read_gym_info" ON gym_info
  FOR SELECT USING (true);

-- Only coaches can modify gym info
CREATE POLICY "coaches_manage_gym_info" ON gym_info
  FOR ALL USING (
    EXISTS (SELECT 1 FROM coaches WHERE coaches.id = auth.uid())
  );

-- ============================================
-- PRICING POLICIES
-- ============================================

-- Everyone can read active pricing
CREATE POLICY "public_read_pricing" ON pricing
  FOR SELECT USING (is_active = true);

-- Coaches can manage pricing
CREATE POLICY "coaches_manage_pricing" ON pricing
  FOR ALL USING (
    EXISTS (SELECT 1 FROM coaches WHERE coaches.id = auth.uid())
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically update pt_package status when sessions depleted
CREATE OR REPLACE FUNCTION update_pt_package_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.remaining_sessions = 0 AND NEW.status = 'active' THEN
    NEW.status := 'completed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pt_package_status_trigger
  BEFORE UPDATE ON pt_packages
  FOR EACH ROW
  EXECUTE FUNCTION update_pt_package_status();

-- Function to automatically update gym_membership status when expired
CREATE OR REPLACE FUNCTION update_gym_membership_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.end_date < CURRENT_DATE AND NEW.status = 'active' THEN
    NEW.status := 'expired';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gym_membership_status_trigger
  BEFORE UPDATE ON gym_memberships
  FOR EACH ROW
  EXECUTE FUNCTION update_gym_membership_status();

-- Function to decrement PT sessions when booking is completed
CREATE OR REPLACE FUNCTION decrement_pt_sessions()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status = 'scheduled' AND NEW.pt_package_id IS NOT NULL THEN
    UPDATE pt_packages
    SET remaining_sessions = remaining_sessions - 1
    WHERE id = NEW.pt_package_id AND remaining_sessions > 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER booking_decrement_sessions_trigger
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION decrement_pt_sessions();

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default gym info
INSERT INTO gym_info (key, value_en, value_ar) VALUES
  ('name', 'Grams Gym', 'جرامز جيم'),
  ('tagline', 'Each Gram Matters', 'كل جرام مهم'),
  ('location', 'Amman, Jordan', 'عمان، الأردن'),
  ('hours_sat_wed', '7:00 AM - 11:00 PM', '7:00 صباحاً - 11:00 مساءً'),
  ('hours_thursday', '7:00 AM - 9:00 PM', '7:00 صباحاً - 9:00 مساءً'),
  ('hours_friday', '6:00 PM - 9:00 PM', '6:00 مساءً - 9:00 مساءً'),
  ('phone', '+962 XX XXX XXXX', '+962 XX XXX XXXX'),
  ('instagram', '@gramsgym', '@gramsgym'),
  ('about', 'Transform your body, transform your life. Professional training in a motivating environment.', 'غيّر جسمك، غيّر حياتك. تدريب احترافي في بيئة محفزة.')
ON CONFLICT (key) DO NOTHING;
