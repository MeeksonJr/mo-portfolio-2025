"use client"

import { motion } from "framer-motion"
import { Send, CheckCircle, AlertCircle, Terminal, Code, Zap, MessageSquare, Coffee } from "lucide-react"
import { useActionState, useState, useEffect } from "react"
import { submitContactForm } from "@/app/actions/contact"

export default function Contact() {
  const [state, formAction, isPending] = useActionState(submitContactForm, null)
  const [showCursor, setShowCursor] = useState(true)
  const [activeField, setActiveField] = useState("")

  // Blinking cursor effect - FIXED: Properly using useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const terminalCommands = [
    "$ whoami",
    "> Mohamed Datt - Full Stack Developer",
    "$ location",
    "> Norfolk, Virginia, USA",
    "$ status",
    "> Available for opportunities & collaborations",
    "$ echo 'Ready to build something amazing together!'",
    "> Ready to build something amazing together!",
  ]

  return (
    <section id="contact" className="py-20 px-4 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-1 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <motion.div
              key={i}
              className="border border-primary/20"
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3.2,
                repeat: Number.POSITIVE_INFINITY,
                delay: 0.8,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Terminal Header */}
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              className="w-3 h-3 rounded-full bg-red-500"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-yellow-500"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-green-500"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.6 }}
            />
            <div className="flex items-center gap-2 ml-4">
              <Terminal className="text-primary" size={20} />
              <span className="text-primary font-mono text-sm">contact@mohameddatt.com</span>
            </div>
          </div>

          {/* Terminal Command Preview */}
          <motion.div
            className="glass rounded-lg p-4 mb-8 font-mono text-sm shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-1">
              {terminalCommands.map((cmd, i) => (
                <motion.div
                  key={i}
                  className={cmd.startsWith("$") ? "text-primary font-semibold" : "text-foreground/80"}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  {cmd}
                </motion.div>
              ))}
              <div className="flex items-center gap-1 text-primary font-semibold">
                <span>$ connect --interactive</span>
                {showCursor && <span className="bg-primary w-2 h-4 inline-block ml-1"></span>}
              </div>
            </div>
          </motion.div>

          {/* Main Contact Interface */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - Interactive Info */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Connection Status Card */}
              <div className="glass rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-primary font-mono text-sm font-semibold">STATUS: ONLINE & READY</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="text-primary" size={20} />
                  Let's Build Something Amazing!
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  From Guinea to Norfolk, I've built a journey in code. Whether you have a project in mind, want to
                  discuss AI and web development, or just connect with a fellow developer - let's chat! 🚀
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div className="glass rounded-lg p-4 text-center shadow-md" whileHover={{ scale: 1.02, y: -2 }}>
                  <div className="text-primary font-mono text-lg font-bold">24h</div>
                  <div className="text-foreground/60 text-xs">Response Time</div>
                </motion.div>
                <motion.div className="glass rounded-lg p-4 text-center shadow-md" whileHover={{ scale: 1.02, y: -2 }}>
                  <div className="text-primary font-mono text-lg font-bold flex items-center justify-center gap-1">
                    <Coffee size={16} />∞
                  </div>
                  <div className="text-foreground/60 text-xs">Coffee Level</div>
                </motion.div>
              </div>

              {/* Quick Action */}
              <motion.a
                href="/resume-Mohamed-Datt-Full Stack Developer-2025.pdf"
                target="_blank"
                className="flex items-center justify-center gap-2 p-4 glass rounded-lg hover:shadow-lg transition-all text-sm font-mono group"
                whileHover={{ scale: 1.02, y: -2 }}
                rel="noreferrer"
              >
                <Zap size={16} className="text-primary" />
                <span className="text-primary font-semibold">DOWNLOAD RESUME</span>
                <motion.div
                  className="ml-auto opacity-0 group-hover:opacity-100 text-primary"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                >
                  →
                </motion.div>
              </motion.a>
            </motion.div>

            {/* Right Side - Interactive Message Terminal */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Terminal Window */}
              <div className="glass rounded-lg overflow-hidden shadow-lg">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-primary/10 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Code className="text-primary" size={16} />
                    <span className="text-primary font-mono text-sm font-semibold">message.send()</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  </div>
                </div>

                {/* Success/Error Messages */}
                {state && (
                  <motion.div
                    className={`mx-4 mt-4 p-3 rounded border font-mono text-sm ${
                      state.success
                        ? "bg-green-50 border-green-300 text-green-800"
                        : "bg-red-50 border-red-300 text-red-800"
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-2">
                      {state.success ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <AlertCircle size={16} className="text-red-600" />
                      )}
                      <span className="text-xs font-semibold">{state.success ? "SUCCESS:" : "ERROR:"}</span>
                    </div>
                    <p className="mt-1 text-xs">{state.success ? state.message : state.error}</p>
                  </motion.div>
                )}

                {/* Interactive Form */}
                <form action={formAction} className="p-4 space-y-4">
                  <div>
                    <label className="block text-primary font-mono text-xs mb-2 font-semibold">
                      --name <span className="text-red-500">*</span>
                    </label>
                    <motion.input
                      type="text"
                      name="name"
                      required
                      className="w-full px-3 py-2 bg-white/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-mono text-sm placeholder-muted-foreground"
                      placeholder="Enter your name..."
                      onFocus={() => setActiveField("name")}
                      onBlur={() => setActiveField("")}
                      whileFocus={{
                        scale: 1.01,
                      }}
                      disabled={isPending}
                    />
                    {activeField === "name" && (
                      <motion.div
                        className="text-xs text-primary mt-1 font-mono"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {">"} What should I call you?
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <label className="block text-primary font-mono text-xs mb-2 font-semibold">
                      --email <span className="text-red-500">*</span>
                    </label>
                    <motion.input
                      type="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 bg-white/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all font-mono text-sm placeholder-muted-foreground"
                      placeholder="your.email@example.com"
                      onFocus={() => setActiveField("email")}
                      onBlur={() => setActiveField("")}
                      whileFocus={{
                        scale: 1.01,
                      }}
                      disabled={isPending}
                    />
                    {activeField === "email" && (
                      <motion.div
                        className="text-xs text-primary mt-1 font-mono"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {">"} How can I reach you back?
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <label className="block text-primary font-mono text-xs mb-2 font-semibold">
                      --message <span className="text-red-500">*</span>
                    </label>
                    <motion.textarea
                      name="message"
                      rows={4}
                      required
                      className="w-full px-3 py-2 bg-white/50 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none font-mono text-sm placeholder-muted-foreground"
                      placeholder="Tell me about your project or just say hello!"
                      onFocus={() => setActiveField("message")}
                      onBlur={() => setActiveField("")}
                      whileFocus={{
                        scale: 1.01,
                      }}
                      disabled={isPending}
                    />
                    {activeField === "message" && (
                      <motion.div
                        className="text-xs text-primary mt-1 font-mono"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {">"} What's on your mind?
                      </motion.div>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-mono text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    whileHover={{ scale: isPending ? 1 : 1.02 }}
                    whileTap={{ scale: isPending ? 1 : 0.98 }}
                  >
                    {isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                        <span>SENDING...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>EXECUTE SEND</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
