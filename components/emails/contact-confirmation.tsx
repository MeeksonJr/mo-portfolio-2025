import { Html, Head, Body, Container, Section, Text, Heading, Hr, Link } from "@react-email/components"

interface ContactConfirmationProps {
  name: string
}

export function ContactConfirmation({ name }: ContactConfirmationProps) {
  return (
    <Html lang="en">
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Heading style={h1}>Thanks for reaching out!</Heading>

            <Text style={text}>Hi {name},</Text>

            <Text style={text}>
              Thank you for contacting me through my portfolio. I've received your message and will get back to you as
              soon as possible, usually within 24 hours.
            </Text>

            <Text style={text}>
              In the meantime, feel free to check out my projects on{" "}
              <Link href="https://github.com/MeeksonJr" style={link}>
                GitHub
              </Link>{" "}
              or connect with me on{" "}
              <Link href="https://linkedin.com/in/mohamed-datt" style={link}>
                LinkedIn
              </Link>
              .
            </Text>

            <Hr style={hr} />

            <Text style={text}>
              Best regards,
              <br />
              Mohamed Datt
              <br />
              Full Stack Developer
            </Text>

            <Text style={footer}>
              This is an automated confirmation email from{" "}
              <Link href="https://mohameddatt.com" style={link}>
                mohameddatt.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles (same as contact-email.tsx)
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const section = {
  padding: "0 48px",
}

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0 20px",
  padding: "0",
}

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
}

const link = {
  color: "#22c55e",
  textDecoration: "underline",
}

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "16px 0 0",
}

export default ContactConfirmation
