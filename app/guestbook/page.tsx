import { Metadata } from 'next'
import GuestbookForm from '@/components/guestbook/guestbook-form'
import GuestbookMessages from '@/components/guestbook/guestbook-messages'
import { createAdminClient } from '@/lib/supabase/server'
import PageContainer from '@/components/layout/page-container'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Guestbook | Mohamed Datt',
  description: 'Leave a message, share your thoughts, or just say hello!',
}

export const revalidate = 0

interface GuestbookMessage {
  id: string
  name: string
  email: string | null
  message: string
  website_url: string | null
  created_at: string
}

async function getGuestbookMessages() {
  try {
    const supabase = createAdminClient()
    const { data: messages } = await supabase
      .from('guestbook')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(50)

    // Get reaction counts for each message
    const messagesWithReactions = await Promise.all(
      (messages || []).map(async (message: GuestbookMessage) => {
        const { count: likeCount } = await supabase
          .from('guestbook_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('guestbook_id', message.id)
          .eq('reaction_type', 'like')

        const { count: heartCount } = await supabase
          .from('guestbook_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('guestbook_id', message.id)
          .eq('reaction_type', 'heart')

        const { count: smileCount } = await supabase
          .from('guestbook_reactions')
          .select('*', { count: 'exact', head: true })
          .eq('guestbook_id', message.id)
          .eq('reaction_type', 'smile')

        return {
          ...message,
          reactions: {
            like: likeCount || 0,
            heart: heartCount || 0,
            smile: smileCount || 0,
          },
        }
      })
    )

    return messagesWithReactions
  } catch (error) {
    console.error('Error fetching guestbook messages:', error)
    return []
  }
}

export default async function GuestbookPage() {
  const messages = await getGuestbookMessages()

  return (
    <PageContainer width="narrow" padding="default">
      <div className="py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className={cn(TYPOGRAPHY.h1)}>Guestbook</h1>
          <p className={cn(TYPOGRAPHY.lead, "text-muted-foreground")}>
            Leave a message, share your thoughts, or just say hello!
          </p>
        </div>

        <GuestbookForm />

        <div className="space-y-4">
          <h2 className={cn(TYPOGRAPHY.h3)}>Messages</h2>
          <GuestbookMessages initialMessages={messages} />
        </div>
      </div>
    </PageContainer>
  )
}

