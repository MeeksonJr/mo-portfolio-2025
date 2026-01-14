# Vercel Cron Job Fix - Free Plan Compatibility

## Issue
Vercel Hobby (Free) plan only allows **one cron job per day**. The previous schedule `*/5 * * * *` (every 5 minutes) exceeded this limit.

## Solution
Changed the cron schedule to run **once per day at midnight UTC**:

```json
{
  "crons": [
    {
      "path": "/api/admin/newsletter/scheduled",
      "schedule": "0 0 * * *"
    }
  ]
}
```

## What This Means

### Current Behavior
- ✅ Cron job runs once per day at 00:00 UTC
- ✅ Checks for all scheduled newsletters that should have been sent
- ✅ Sends any newsletters that are due (even if scheduled for earlier in the day)

### Limitations
- ⚠️ Newsletters scheduled for specific times will be sent at midnight UTC (not at their exact scheduled time)
- ⚠️ Maximum delay: Up to 24 hours if a newsletter is scheduled right after midnight

### Workarounds

#### Option 1: Accept the Limitation (Recommended for Free Plan)
- Schedule newsletters for dates, not specific times
- Newsletters will be sent at midnight UTC on their scheduled date
- Works well for most use cases

#### Option 2: Upgrade to Vercel Pro
- Pro plan allows unlimited cron jobs
- Can use `*/5 * * * *` for 5-minute checks
- Cost: $20/month

#### Option 3: External Cron Service
- Use services like:
  - [cron-job.org](https://cron-job.org) (free)
  - [EasyCron](https://www.easycron.com) (free tier available)
  - GitHub Actions (free for public repos)
- Set up to call your API endpoint
- Requires `CRON_SECRET` environment variable for security

### Security
The endpoint supports authentication via `CRON_SECRET`:
- Set `CRON_SECRET` in Vercel environment variables
- External cron services should include: `Authorization: Bearer YOUR_CRON_SECRET`

### Testing
To test the cron job manually:
```bash
curl -X GET https://yourdomain.com/api/admin/newsletter/scheduled \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Recommendation
For the free plan, **Option 1** is recommended. The once-daily check is sufficient for most newsletter use cases, and you can schedule newsletters by date rather than specific times.

If you need more frequent checks or exact timing, consider upgrading to Vercel Pro or using an external cron service.

