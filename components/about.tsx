"use client"

import { motion } from "framer-motion"
import PageContainer from '@/components/layout/page-container'
import { TYPOGRAPHY } from '@/lib/design-tokens'
import { cn } from '@/lib/utils'

export default function About() {
  return (
    <section id="about" className="py-20 px-4">
      <PageContainer width="standard" padding="default">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-green-400 text-sm mb-4">$ cat about.md</div>
          <h2 className={cn(TYPOGRAPHY.h2, "mb-8")}>About Me</h2>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Professional Photo */}
            <div className="lg:col-span-1">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900/50">
                  <img
                    src="/images/mohamed-datt-professional.png"
                    alt="Mohamed Datt - Professional Photo"
                    className="w-full h-auto"
                  />
                </div>
                <div className="text-center mt-4">
                  <p className="text-green-400 font-semibold">Mohamed Datt</p>
                  <p className="text-gray-400 text-sm">Full Stack Developer</p>
                  <p className="text-gray-500 text-xs">Norfolk, Virginia</p>
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="border border-gray-700 p-6 rounded-lg bg-gray-900/50">
                <h3 className="text-xl font-semibold mb-4 text-green-400">My Journey</h3>
                <p className="text-gray-300 leading-relaxed">
                  From facing early challenges and learning English through cartoons to becoming a passionate full-stack
                  developer, my journey has been one of resilience and continuous learning. I believe in the power of
                  technology to solve real-world problems and create meaningful experiences.
                </p>
              </div>

              <div className="border border-gray-700 p-6 rounded-lg bg-gray-900/50">
                <h3 className="text-xl font-semibold mb-4 text-blue-400">What Drives Me</h3>
                <p className="text-gray-300 leading-relaxed">
                  I'm passionate about combining AI with web development to create innovative solutions. Whether it's
                  building educational platforms, interview prep tools, or content generators, I love crafting
                  applications that make a difference.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-700 p-6 rounded-lg bg-gray-900/50">
                  <h3 className="text-xl font-semibold mb-4 text-yellow-400">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Gaming", "AI", "HealthTech", "Frontend Dev", "EdTech"].map((interest) => (
                      <span key={interest} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-700 p-6 rounded-lg bg-gray-900/50">
                  <h3 className="text-xl font-semibold mb-4 text-purple-400">Core Traits</h3>
                  <div className="space-y-2">
                    {[
                      { trait: "Resilient", desc: "Overcame early challenges to thrive" },
                      { trait: "Creative", desc: "Always finding innovative solutions" },
                      { trait: "Resourceful", desc: "Making the most of every opportunity" },
                      { trait: "Self-taught", desc: "Continuous learner and explorer" },
                    ].map((item) => (
                      <div key={item.trait} className="flex justify-between items-center">
                        <span className="text-green-400">{item.trait}</span>
                        <span className="text-gray-400 text-sm">{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  )
}
