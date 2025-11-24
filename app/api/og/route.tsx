/* eslint-disable react/forbid-dom-props */
import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const title = searchParams.get('title') || 'Mohamed Datt'
    const description = searchParams.get('description') || 'Full Stack Developer'
    const type = searchParams.get('type') || 'website'

    // Truncate long titles/descriptions
    const truncatedTitle = title.length > 60 ? title.substring(0, 57) + '...' : title
    const truncatedDescription = description.length > 120 ? description.substring(0, 117) + '...' : description

    // eslint-disable-next-line react/forbid-dom-props
    return new ImageResponse(
      (
        <div
          // eslint-disable-next-line react/forbid-dom-props
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header with type badge */}
          <div
            // eslint-disable-next-line react/forbid-dom-props
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
            }}
          >
            <div
              // eslint-disable-next-line react/forbid-dom-props
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                borderRadius: '8px',
                fontSize: 14,
                fontWeight: 600,
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {type}
            </div>
          </div>

          {/* Title */}
          <div
            // eslint-disable-next-line react/forbid-dom-props
            style={{
              display: 'flex',
              fontSize: 64,
              fontWeight: 800,
              color: '#ffffff',
              textAlign: 'center',
              maxWidth: '1000px',
              marginBottom: 24,
              lineHeight: 1.2,
            }}
          >
            {truncatedTitle}
          </div>

          {/* Description */}
          <div
            // eslint-disable-next-line react/forbid-dom-props
            style={{
              display: 'flex',
              fontSize: 28,
              color: '#a1a1aa',
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: 1.4,
            }}
          >
            {truncatedDescription}
          </div>

          {/* Footer */}
          <div
            // eslint-disable-next-line react/forbid-dom-props
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 60,
              fontSize: 20,
              color: '#71717a',
            }}
          >
            <div
              // eslint-disable-next-line react/forbid-dom-props
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#10b981',
                marginRight: 12,
                animation: 'pulse 2s infinite',
              }}
            />
            mohameddatt.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    // Return a simple fallback image
    // eslint-disable-next-line react/forbid-dom-props
    return new ImageResponse(
      (
        <div
          // eslint-disable-next-line react/forbid-dom-props
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            color: '#ffffff',
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          Mohamed Datt | Full Stack Developer
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }
}

