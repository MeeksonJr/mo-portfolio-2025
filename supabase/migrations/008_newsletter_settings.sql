-- Newsletter settings table
CREATE TABLE IF NOT EXISTS newsletter_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Index
CREATE INDEX IF NOT EXISTS idx_newsletter_settings_key ON newsletter_settings(setting_key);

-- Insert default settings
INSERT INTO newsletter_settings (setting_key, setting_value, description) VALUES
  ('auto_send_blog', '{"enabled": true}', 'Automatically send newsletter when blog post is published'),
  ('auto_send_project', '{"enabled": true}', 'Automatically send newsletter when project is published'),
  ('auto_send_case_study', '{"enabled": true}', 'Automatically send newsletter when case study is published'),
  ('auto_send_music', '{"enabled": true}', 'Automatically send newsletter when music is uploaded'),
  ('default_sender_name', '{"value": "Mohamed Datt"}', 'Default sender name for newsletters'),
  ('default_sender_email', '{"value": "newsletter@mohameddatt.com"}', 'Default sender email for newsletters')
ON CONFLICT (setting_key) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_newsletter_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER trigger_update_newsletter_settings_updated_at
  BEFORE UPDATE ON newsletter_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_settings_updated_at();

