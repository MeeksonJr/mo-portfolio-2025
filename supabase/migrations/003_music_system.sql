-- Music System Tables

-- Songs Table
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist TEXT,
  album TEXT,
  genre TEXT,
  duration INTEGER, -- Duration in seconds
  file_url TEXT NOT NULL, -- Supabase Storage URL
  file_path TEXT NOT NULL, -- Storage path
  file_size BIGINT, -- File size in bytes
  cover_image_url TEXT, -- Album cover image URL
  description TEXT,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);
CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs(artist);
CREATE INDEX IF NOT EXISTS idx_songs_genre ON songs(genre);
CREATE INDEX IF NOT EXISTS idx_songs_is_featured ON songs(is_featured);
CREATE INDEX IF NOT EXISTS idx_songs_created_at ON songs(created_at);

-- Playlists Table (for future use)
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Playlist Songs Junction Table
CREATE TABLE IF NOT EXISTS playlist_songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(playlist_id, song_id)
);

-- RLS Policies for Songs
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Anyone can read published songs
CREATE POLICY "Songs are viewable by everyone"
  ON songs FOR SELECT
  USING (true);

-- Only admins can insert songs
CREATE POLICY "Only admins can insert songs"
  ON songs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Only admins can update songs
CREATE POLICY "Only admins can update songs"
  ON songs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Only admins can delete songs
CREATE POLICY "Only admins can delete songs"
  ON songs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- RLS Policies for Playlists
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Playlists are viewable by everyone if public"
  ON playlists FOR SELECT
  USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create playlists"
  ON playlists FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own playlists"
  ON playlists FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own playlists"
  ON playlists FOR DELETE
  USING (created_by = auth.uid());

-- RLS Policies for Playlist Songs
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Playlist songs are viewable by everyone"
  ON playlist_songs FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their playlist songs"
  ON playlist_songs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM playlists
      WHERE playlists.id = playlist_songs.playlist_id
      AND playlists.created_by = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_songs_updated_at
  BEFORE UPDATE ON songs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON playlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

