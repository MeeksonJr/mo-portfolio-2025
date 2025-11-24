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

interface NewsletterWelcomeEmailProps {
  name: string
  unsubscribeUrl: string
}

export function NewsletterWelcomeEmail({
  name,
  unsubscribeUrl,
}: NewsletterWelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={title}>Welcome to My Newsletter! 🎉</Text>
            <Text style={text}>Hi {name},</Text>
            <Text style={text}>
              Thank you for confirming your subscription! I'm thrilled to have you on board.
            </Text>
            <Text style={text}>
              You'll now receive updates about:
            </Text>
            <Text style={list}>
              • New blog posts and technical insights<br />
              • Project updates and launches<br />
              • Web development tips and tutorials<br />
              • AI integration techniques<br />
              • Career and learning resources
            </Text>
            <Text style={text}>
              I'll keep the emails valuable and infrequent - typically once or twice a month.
            </Text>
            <Button style={button} href="https://mohameddatt.com">
              Visit My Portfolio
            </Button>
            <Hr style={hr} />
            <Text style={footer}>
              You can unsubscribe at any time by clicking{' '}
              <Link href={unsubscribeUrl} style={unsubscribeLink}>
                here
              </Link>
              .
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

const list = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#484848',
  margin: '0 0 20px',
  paddingLeft: '20px',
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

const unsubscribeLink = {
  color: '#22c55e',
  textDecoration: 'underline',
}

