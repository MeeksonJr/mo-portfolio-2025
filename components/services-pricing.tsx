"use client"

import { motion } from "framer-motion"
import { Check, Zap, Rocket, Sparkles, ArrowRight } from "lucide-react"
import { useState } from "react"

const services = [
  {
    tier: "Quick Fix",
    price: "$150 - $300",
    description: "Bug fixes, small features, or quick consultations",
    features: [
      "1-2 hour response time",
      "Code review & debugging",
      "Small feature additions",
      "Performance optimization",
    ],
    deliveryTime: "1-3 days",
    icon: Zap,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    tier: "Starter Site",
    price: "$300 - $700",
    description: "Professional landing pages and portfolio sites",
    features: [
      "Responsive design",
      "SEO optimization",
      "Contact form integration",
      "GitHub deployment",
      "1 month support",
    ],
    deliveryTime: "1-2 weeks",
    popular: true,
    icon: Rocket,
    color: "text-primary",
    bgColor: "bg-green-50",
  },
  {
    tier: "SaaS Setup",
    price: "$1,500+",
    description: "Full-stack applications with AI integration",
    features: [
      "Complete app development",
      "Authentication & database",
      "AI/API integrations",
      "Payment processing",
      "Deployment & hosting",
      "3 months support & maintenance",
    ],
    deliveryTime: "4-8 weeks",
    icon: Sparkles,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
]

export default function ServicesPricing() {
  const [showModal, setShowModal] = useState(false)

  return (
    <section id="services" className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Services & Pricing</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From quick fixes to full SaaS builds. Transparent pricing, quality delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 auto-rows-fr">
            {services.map((service, idx) => {
              const ServiceIcon = service.icon
              return (
                <motion.div
                  key={service.tier}
                  className={`glass rounded-2xl p-8 shadow-lg relative flex flex-col ${service.popular ? "ring-2 ring-primary" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  {service.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className={`w-12 h-12 ${service.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                    <ServiceIcon className={service.color} size={24} />
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{service.tier}</h3>
                  <div className="text-3xl font-bold text-primary mb-4">{service.price}</div>
                  <p className="text-muted-foreground mb-6">{service.description}</p>

                  {/* Features list with fixed min height */}
                  <div className="space-y-3 mb-6 flex-grow min-h-[180px]">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <Check className="text-primary mt-0.5 flex-shrink-0" size={18} />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery time */}
                  <div className="mb-6 pt-6 border-t border-border">
                    <div className="text-sm text-muted-foreground">Delivery time</div>
                    <div className="font-medium">{service.deliveryTime}</div>
                  </div>

                  {/* Button with proper hover effects */}
                  <button
                    onClick={() => setShowModal(true)}
                    className={`w-full py-3 rounded-xl font-medium transition-all cursor-pointer ${
                      service.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg"
                        : "bg-muted hover:bg-muted/80 hover:shadow-md"
                    }`}
                  >
                    Request Quote
                  </button>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            className="mt-12 glass rounded-2xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="text-primary" size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Case Study: InterviewPrep AI</h3>
                <p className="text-muted-foreground mb-4">
                  Sold for <span className="font-bold text-primary">$500</span> — Full mock-interview platform with
                  voice feedback. Delivered in 6 weeks with ongoing maintenance contracted.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all cursor-pointer"
                >
                  Request similar project
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            className="glass rounded-2xl p-8 max-w-md w-full shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4">Request a Quote</h3>
            <p className="text-muted-foreground mb-6">
              Send me an email at{" "}
              <a href="mailto:d.mohamed1504@gmail.com" className="text-primary font-medium">
                d.mohamed1504@gmail.com
              </a>{" "}
              with your project details, and I'll get back to you within 24 hours!
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 cursor-pointer"
            >
              Got it!
            </button>
          </motion.div>
        </div>
      )}
    </section>
  )
}
