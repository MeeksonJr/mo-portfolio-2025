"use server"

import { Resend } from "resend"
import { ContactEmail } from "@/components/emails/contact-email"
import { headers } from "next/headers"
import { logServerAnalyticsEvent } from "@/lib/analytics-server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function submitContactForm(prevState: any, formData: FormData) {
  console.log("📧 Contact Form: Submission received")
  const headerList = await headers()

  try {
    const name = formData.get("name")
    const email = formData.get("email")
    const message = formData.get("message")

    console.log("📧 Contact Form: Data extracted:", {
      name: name?.toString(),
      email: email?.toString(),
      messageLength: message?.toString()?.length,
    })

    // Basic validation
    if (!name || !email || !message) {
      console.error("❌ Contact Form: Missing required fields")
      return {
        success: false,
        error: "All fields are required",
      }
    }

    const nameStr = name.toString().trim()
    const emailStr = email.toString().trim()
    const messageStr = message.toString().trim()

    if (!nameStr || !emailStr || !messageStr) {
      console.error("❌ Contact Form: Empty fields after trimming")
      return {
        success: false,
        error: "All fields are required",
      }
    }

    if (!emailStr.includes("@")) {
      console.error("❌ Contact Form: Invalid email format")
      return {
        success: false,
        error: "Please enter a valid email address",
      }
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ Contact Form: RESEND_API_KEY not configured")
      return {
        success: false,
        error: "Email service is not configured. Please try again later.",
      }
    }

    console.log("📧 Contact Form: Sending email via Resend...")

    // Send email using Resend with verified domain
    const { data, error } = await resend.emails.send({
      from: "Mohamed Datt <contact@mohameddatt.com>", // ✅ Fixed: Using verified domain
      to: ["d.mohamed1504@gmail.com"], // Mohamed's email
      replyTo: emailStr, // User's email for easy reply
      subject: `New Portfolio Contact: ${nameStr}`,
      react: ContactEmail({
        name: nameStr,
        email: emailStr,
        message: messageStr,
      }),
    })

    if (error) {
      console.error("❌ Contact Form: Resend error:", error)
      return {
        success: false,
        error: "Failed to send email. Please try again later.",
      }
    }

    console.log("✅ Contact Form: Email sent successfully:", data)

    await logServerAnalyticsEvent({
      event_type: 'form_submit',
      content_type: 'resource',
      content_id: 'contact-form',
      metadata: {
        source: 'contact-section',
      },
      ip_address: headerList.get('x-forwarded-for') || headerList.get('x-real-ip'),
      user_agent: headerList.get('user-agent'),
      referrer: headerList.get('referer'),
    })

    return {
      success: true,
      message: `Thanks ${nameStr}! Your message has been sent to Mohamed. He'll get back to you soon!`,
    }
  } catch (error) {
    console.error("💥 Contact Form Error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    }
  }
}
