# Music System Documentation

## Overview
The music system allows admins to upload music files to Supabase Storage and provides a public-facing Spotify-like music player for users to browse and play songs.

## Database Schema

### Songs Table
- `id` (UUID, Primary Key)
- `title` (TEXT, Required)
- `artist` (TEXT, Optional)
- `album` (TEXT, Optional)
- `genre` (TEXT, Optional)
- `duration` (INTEGER, Optional) - Duration in seconds
- `file_url` (TEXT, Required) - Public URL from Supabase Storage
- `file_path` (TEXT, Required) - Storage path
- `file_size` (BIGINT, Optional) - File size in bytes
- `cover_image_url` (TEXT, Optional) - Album cover image URL
- `description` (TEXT, Optional)
- `tags` (TEXT[], Optional)
- `is_featured` (BOOLEAN, Default: false)
- `play_count` (INTEGER, Default: 0)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `created_by` (UUID, Foreign Key to auth.users)

### Storage Bucket
- **Bucket Name**: `music`
- **Public Access**: Yes (for public playback)
- **File Types**: MP3, WAV, M4A, OGG, FLAC

## Setup Instructions

### 1. Run Database Migration
```bash
# Apply the migration to create tables
supabase migration up
```

### 2. Create Storage Bucket
1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `music`
3. Set it to **Public** (for public access)
4. Configure CORS if needed

### 3. Set Environment Variables
Ensure these are set in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Admin Features

### Upload Music (`/admin/music`)
- **Drag & Drop**: Drag audio files directly onto the upload zone
- **File Picker**: Click to select files from device
- **Metadata Entry**: Add title, artist, album, genre, description
- **File Validation**: 
  - Audio files only (MP3, WAV, M4A, OGG, FLAC)
  - Max file size: 50MB
- **Search**: Search uploaded songs by title or artist
- **Delete**: Remove songs from library

### API Endpoints

#### Upload Song
```
POST /api/admin/music/upload
Content-Type: multipart/form-data

Form Data:
- file: File (required)
- title: string (required)
- artist: string (optional)
- album: string (optional)
- genre: string (optional)
- description: string (optional)
```

#### List Songs (Admin)
```
GET /api/admin/music/songs?search=query&limit=100&offset=0
```

#### Delete Song
```
DELETE /api/admin/music/songs?id=song_id
```

## Public Features

### Music Player Page (`/music`)
- **Spotify-like Interface**: Modern, clean design
- **Search**: Search by title, artist, or album
- **Genre Filter**: Filter songs by genre
- **Playback Controls**:
  - Play/Pause
  - Previous/Next
  - Shuffle
  - Repeat (Off/All/One)
  - Volume control
  - Progress bar with seek
- **Song List**: Browse all available songs
- **Now Playing Sidebar**: Shows current track info and controls

### API Endpoints

#### List Songs (Public)
```
GET /api/music/songs?search=query&genre=genre&artist=artist&featured=true&limit=100&offset=0
```

#### Get Single Song
```
GET /api/music/songs/[id]
```

## Integration with Floating Action Menu

The music player is also accessible via the Floating Action Menu:
- Click the main FAB button (bottom-right)
- Select the Music Player option
- Opens in a modal for quick access

## File Structure

```
app/
├── admin/music/
│   └── page.tsx                    # Admin music management page
├── api/
│   ├── admin/music/
│   │   ├── upload/route.ts         # Upload endpoint
│   │   └── songs/route.ts          # Admin songs list/delete
│   └── music/
│       └── songs/
│           ├── route.ts            # Public songs list
│           └── [id]/route.ts       # Single song endpoint
├── music/
│   └── page.tsx                    # Public music player page
components/
├── admin/
│   └── music-upload-manager.tsx    # Admin upload interface
├── music-player-page.tsx            # Public music player
└── music-player-content.tsx         # FAB modal music player
supabase/migrations/
└── 003_music_system.sql            # Database schema
```

## Usage Examples

### Upload a Song (Admin)
1. Navigate to `/admin/music`
2. Drag & drop an audio file or click "Upload Song"
3. Fill in metadata (title required)
4. Click "Upload"
5. Song appears in library immediately

### Play Music (Public)
1. Navigate to `/music`
2. Browse songs or use search/filter
3. Click any song to play
4. Use controls to manage playback
5. Access via FAB menu for quick access

## Security

- **RLS Policies**: 
  - Songs are publicly readable
  - Only admins can upload/update/delete
- **File Validation**: Server-side validation of file type and size
- **Authentication**: Admin endpoints require admin role verification

## Future Enhancements

- [ ] Playlist creation and management
- [ ] Album cover image upload
- [ ] Audio duration extraction on upload
- [ ] Play history tracking
- [ ] Favorite songs
- [ ] Audio waveform visualization
- [ ] Lyrics support
- [ ] Social sharing

