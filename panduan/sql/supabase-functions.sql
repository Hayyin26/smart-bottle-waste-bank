-- Function untuk increment user points secara atomic
CREATE OR REPLACE FUNCTION increment_user_points(user_uuid UUID, points_to_add INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET 
    total_points = total_points + points_to_add,
    updated_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function untuk auto-create profile saat user baru register
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, total_points)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'user',
    0
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Profile already exists, ignore
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger untuk auto-create profile saat user baru dibuat
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function untuk get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
  total_transactions BIGINT,
  total_points_earned INTEGER,
  last_transaction_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_transactions,
    COALESCE(SUM(points_earned), 0)::INTEGER as total_points_earned,
    MAX(created_at) as last_transaction_date
  FROM transactions
  WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function untuk get device statistics
CREATE OR REPLACE FUNCTION get_device_stats(device_uuid TEXT)
RETURNS TABLE (
  total_scans BIGINT,
  total_points_distributed INTEGER,
  unique_users BIGINT,
  last_scan_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_scans,
    COALESCE(SUM(points_earned), 0)::INTEGER as total_points_distributed,
    COUNT(DISTINCT user_id)::BIGINT as unique_users,
    MAX(created_at) as last_scan_date
  FROM transactions
  WHERE device_id = device_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger untuk auto-update profile updated_at
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_profile_updated_at ON profiles;
CREATE TRIGGER trigger_update_profile_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_updated_at();

-- View untuk leaderboard
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  p.id,
  p.full_name,
  p.total_points,
  COUNT(t.id) as total_transactions,
  MAX(t.created_at) as last_transaction
FROM profiles p
LEFT JOIN transactions t ON p.id = t.user_id
GROUP BY p.id, p.full_name, p.total_points
ORDER BY p.total_points DESC;

-- View untuk device activity
CREATE OR REPLACE VIEW device_activity AS
SELECT 
  d.device_id,
  d.location,
  d.is_active,
  COUNT(t.id) as total_scans,
  COALESCE(SUM(t.points_earned), 0) as total_points_distributed,
  COUNT(DISTINCT t.user_id) as unique_users,
  MAX(t.created_at) as last_scan
FROM iot_devices d
LEFT JOIN transactions t ON d.device_id = t.device_id
GROUP BY d.device_id, d.location, d.is_active
ORDER BY total_scans DESC;
