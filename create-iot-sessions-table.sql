-- Create table for IoT sessions
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.iot_sessions (
  id BIGSERIAL PRIMARY KEY,
  session_token TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL REFERENCES public.iot_devices(device_id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_iot_sessions_token ON public.iot_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_iot_sessions_device ON public.iot_sessions(device_id);
CREATE INDEX IF NOT EXISTS idx_iot_sessions_expires ON public.iot_sessions(expires_at);

-- Enable RLS
ALTER TABLE public.iot_sessions ENABLE ROW LEVEL SECURITY;

-- Allow public read (for IoT device to check)
CREATE POLICY "Allow public read iot_sessions"
  ON public.iot_sessions
  FOR SELECT
  TO public
  USING (true);

-- Allow public insert (for web to create session)
CREATE POLICY "Allow public insert iot_sessions"
  ON public.iot_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public update (for web to update session)
CREATE POLICY "Allow public update iot_sessions"
  ON public.iot_sessions
  FOR UPDATE
  TO public
  USING (true);

-- Allow public delete (for cleanup)
CREATE POLICY "Allow public delete iot_sessions"
  ON public.iot_sessions
  FOR DELETE
  TO public
  USING (true);

-- Create function to auto-delete expired sessions
CREATE OR REPLACE FUNCTION delete_expired_iot_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.iot_sessions
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a cron job to clean up expired sessions every hour
-- (Requires pg_cron extension - enable in Supabase Dashboard → Database → Extensions)
-- SELECT cron.schedule('delete-expired-iot-sessions', '0 * * * *', 'SELECT delete_expired_iot_sessions()');

COMMENT ON TABLE public.iot_sessions IS 'Temporary sessions for IoT device authentication';
