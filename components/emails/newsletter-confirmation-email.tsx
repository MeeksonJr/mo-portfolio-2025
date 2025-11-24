import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Link,
} from '@react-email/components'

interface NewsletterConfirmationEmailProps {
  name: string
  confirmationUrl: string
}

export function NewsletterConfirmationEmail({
  name,
  confirmationUrl,
}: NewsletterConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={title}>Confirm Your Newsletter Subscription</Text>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Thanks for subscribing to my newsletter! I'm excited to share updates about my projects, 
              blog posts, and insights on web development and AI.
            </Text>
            <Text style={text}>
              Please confirm your email address by clicking the button below:
            </Text>
            <Button style={button} href={confirmationUrl}>
              Confirm Subscription
            </Button>
            <Text style={text}>
              Or copy and paste this link into your browser:
            </Text>
            <Text style={link}>{confirmationUrl}</Text>
            <Hr style={hr} />
            <Text style={footer}>
              If you didn't subscribe to this newsletter, you can safely ignore this email.
            </Text>
            <Text style={footer}>
              Best regards,<br />
              Mohamed Datt
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const section = {
  padding: '0 48px',
}

const title = {
  fontSize: '24px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
  margin: '0 0 20px',
}

const text = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#484848',
  margin: '0 0 16px',
}

const button = {
  backgroundColor: '#22c55e',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  margin: '20px 0',
}

const link = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#22c55e',
  wordBreak: 'break-all' as const,
  margin: '0 0 20px',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const footer = {
  fontSize: '14px',
  lineHeight: '1.4',
  color: '#8898aa',
  margin: '0 0 8px',
}

