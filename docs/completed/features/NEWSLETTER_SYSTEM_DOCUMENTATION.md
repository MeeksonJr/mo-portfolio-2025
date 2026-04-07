# Newsletter Management System Documentation

## Overview

A comprehensive newsletter management system with automatic triggers, AI content generation, scheduling, and settings management.

## Features

### ✅ Completed Features

1. **Automatic Newsletter Triggers**
   - Blog Posts: Automatically sends newsletter when a blog post is published
   - Projects: Automatically sends newsletter when a project is published
   - Case Studies: Automatically sends newsletter when a case study is published
   - Music: Automatically sends newsletter when music is uploaded

2. **Admin Newsletter Dashboard**
   - Create and manage newsletter campaigns
   - View all campaigns (draft, scheduled, sent)
   - Stats dashboard (subscribers, campaigns, open rates)
   - Rich content editor with HTML support
   - Image upload support (featured + multiple images)
   - Preview before sending

3. **AI Content Generation**
   - Gemini AI integration for newsletter content generation
   - Generates subject, preview text, HTML content, and plain text
   - Context-aware generation based on content type
   - Fallback to default templates if AI fails

4. **Scheduling**
   - Schedule newsletters to be sent at a specific date/time
   - Cron job integration (checks every 5 minutes)
   - Automatic sending when scheduled time arrives

5. **Settings Management**
   - Enable/disable auto-send per content type
   - Settings stored in database
   - Real-time updates in admin dashboard

6. **Campaign Tracking**
   - Track sent, opened, clicked, bounced, and unsubscribed counts
   - Individual send records for each subscriber
   - Campaign analytics

## Database Schema

### Tables

1. **newsletter_campaigns** - Stores newsletter campaigns
2. **newsletter_campaign_sends** - Tracks individual email sends
3. **newsletter_settings** - Stores auto-send settings per content type
4. **newsletter_subscribers** - Subscriber list (existing)
5. **newsletter_analytics** - Analytics events (existing)

## API Endpoints

### Campaigns
- `GET /api/admin/newsletter/campaigns` - List all campaigns
- `POST /api/admin/newsletter/campaigns` - Create/save draft campaign

### Sending
- `POST /api/admin/newsletter/send` - Send newsletter immediately
- `GET /api/admin/newsletter/scheduled` - Process scheduled newsletters (cron)

### Content Generation
- `POST /api/admin/newsletter/generate` - Generate content with AI

### Images
- `POST /api/admin/newsletter/upload-image` - Upload newsletter images

### Settings
- `GET /api/admin/newsletter/settings` - Get all settings
- `PUT /api/admin/newsletter/settings` - Update a setting

### Subscribers
- `GET /api/admin/newsletter/subscribers/count` - Get subscriber count

## Auto-Send Settings

Settings are stored in the `newsletter_settings` table:
- `auto_send_blog` - Enable/disable auto-send for blog posts
- `auto_send_project` - Enable/disable auto-send for projects
- `auto_send_case_study` - Enable/disable auto-send for case studies
- `auto_send_music` - Enable/disable auto-send for music uploads

Default: All are enabled (`enabled: true`)

## Scheduling

1. **Create Scheduled Campaign**: Set `scheduled_at` date/time when creating a campaign
2. **Cron Job**: Vercel Cron checks `/api/admin/newsletter/scheduled` every 5 minutes
3. **Automatic Sending**: When `scheduled_at` time arrives, campaign is automatically sent

### Setting Up Cron

For Vercel deployments, add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/admin/newsletter/scheduled",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

For other platforms, set up a cron job to call:
```
GET https://yourdomain.com/api/admin/newsletter/scheduled
Authorization: Bearer YOUR_CRON_SECRET
```

Set `CRON_SECRET` environment variable for security.

## AI Content Generation

Uses Google Gemini 2.0 Flash for content generation:
- Requires `GEMINI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY` environment variable
- Generates professional, engaging newsletter content
- Includes subject line, preview text, HTML, and plain text versions
- Falls back to template-based generation if AI fails

## Usage

### Creating a Newsletter

1. Go to `/admin/newsletter`
2. Click "Create Newsletter"
3. Fill in:
   - Title
   - Subject
   - Content (HTML) - or use AI generation
   - Images (optional)
   - Schedule (optional)
4. Click "Save Draft" or "Send"

### Using AI Generation

1. Enter a title
2. Select content type (optional)
3. Click "Generate with AI"
4. Review and edit generated content

### Scheduling a Newsletter

1. Create newsletter content
2. Go to "Settings" tab
3. Set date/time in "Schedule Send" field
4. Click "Schedule" button
5. Newsletter will be sent automatically at scheduled time

### Managing Auto-Send Settings

1. Go to `/admin/newsletter`
2. Click "Create Newsletter"
3. Go to "Settings" tab
4. Toggle auto-send switches for each content type
5. Settings are saved immediately

## Environment Variables

Required:
- `RESEND_API_KEY` - For sending emails
- `GEMINI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY` - For AI generation (optional)

Optional:
- `CRON_SECRET` - Secret for cron job authentication

## Migration Files

Run these migrations in order:
1. `006_newsletter.sql` - Subscribers and analytics (existing)
2. `007_newsletter_campaigns.sql` - Campaigns and sends
3. `008_newsletter_settings.sql` - Settings table

## Future Enhancements

- Email templates library
- A/B testing
- Advanced analytics (heatmaps, click tracking)
- Segmentation (send to specific subscriber groups)
- Recurring newsletters
- Email preview in multiple clients
- Unsubscribe reason tracking

