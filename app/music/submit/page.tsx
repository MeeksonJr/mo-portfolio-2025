import { Metadata } from 'next'
import MusicSubmissionForm from '@/components/music/music-submission-form'

export const metadata: Metadata = {
  title: 'Submit Your Music | Mohamed Datt',
  description: 'Share your music with the community. Submit your songs for review and potential publication.',
}

export default function MusicSubmitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Submit Your Music</h1>
          <p className="text-muted-foreground text-lg">
            Share your music with the community. All submissions will be reviewed before being published.
          </p>
        </div>
        <MusicSubmissionForm />
      </div>
    </div>
  )
}

