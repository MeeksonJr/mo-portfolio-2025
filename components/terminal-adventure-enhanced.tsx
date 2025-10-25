"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, RotateCcw, Code, Trophy, Zap } from "lucide-react"
import Inspectable from "./inspectable"

interface GameState {
  currentScene: string
  inventory: string[]
  stats: {
    creativity: number
    technical: number
    resilience: number
    leadership: number
  }
  visitedScenes: string[]
  gameComplete: boolean
  playerName: string
  unlockedProjects: string[]
  achievements: string[]
  debugMode: boolean
  age: number
  location: string
}

interface Scene {
  id: string
  title: string
  description: string
  choices: Choice[]
  autoAdvance?: boolean
  delay?: number
  isEnding?: boolean
  year?: number
  age?: number
  location?: string
}

interface Choice {
  text: string
  nextScene: string
  statBoost?: { [key: string]: number }
  addToInventory?: string
  unlockProject?: string
  addAchievement?: string
  requirement?: { stat: string; min: number }
  isSecret?: boolean
}

const INITIAL_STATE: GameState = {
  currentScene: "start",
  inventory: [],
  stats: {
    creativity: 0,
    technical: 0,
    resilience: 0,
    leadership: 0,
  },
  visitedScenes: [],
  gameComplete: false,
  playerName: "",
  unlockedProjects: [],
  achievements: [],
  debugMode: false,
  age: 6,
  location: "Guinea",
}

const SCENES: Scene[] = [
  {
    id: "start",
    title: "Mohamed's Real Journey Begins",
    year: 2004,
    age: 0,
    location: "Guinea, West Africa",
    description: `
> Initializing mohamed_life_simulator.exe...
> Loading real_journey_data.json...
> Status: AUTHENTICATED

Welcome to Mohamed's REAL Interactive Journey!

This isn't fiction - this is the actual path from Guinea to becoming 
a 20-year-old AI-powered Full Stack Developer in Norfolk, Virginia.

Every choice, challenge, and victory actually happened.

🌍 Born: October 15, 2004 - Guinea, West Africa
🎯 Current: 20 years old, ODU Computer Science student
🏆 Achievement: 1st place winner out of 13 teams (Fall 2024)

Ready to experience the real story?

💡 Pro tip: Try typing 'debug' or 'sudo' for secret developer commands!`,
    choices: [
      {
        text: "🚀 Begin Mohamed's real journey",
        nextScene: "guinea_childhood",
      },
      {
        text: "📊 View character profile first",
        nextScene: "character_profile",
      },
      {
        text: "🎮 Choose starting trait",
        nextScene: "trait_selection",
      },
    ],
  },
  {
    id: "character_profile",
    title: "Real Character Profile",
    description: `
> cat mohamed_real_profile.json

MOHAMED DATT - REAL PROFILE (2004-2025)
======================================
Born: October 15, 2004 (Age: 20)
Origin: Guinea → Bronx → Queens → Norfolk, VA
Current Status: ODU Computer Science Student

REAL ACHIEVEMENTS:
- Learned English in 3 months via cartoons (Age 6-7)
- A.S. Computer Science from TCC (2024)
- 1st place internship winner (13 teams, Fall 2024)
- Built 6+ production SaaS applications
- Self-taught full-stack + AI integration

CURRENT TECH STACK:
Frontend: Next.js, React, TailwindCSS, Framer Motion
Backend: Supabase, Firebase, NeonDB, PostgreSQL  
AI: Gemini 2.0 Flash, Hugging Face, Groq LLMs
Tools: TypeScript, Vercel, PayPal API, GitHub

REAL PROJECTS:
- EduSphere AI (Student productivity suite)
- InterviewPrep AI (Voice + resume analysis)
- AI Content Generator (Full SaaS platform)
- SnapFind (Image analysis tool)
- myLife Health Tracker (AI health reports)`,
    choices: [
      {
        text: "🚀 Start the real journey",
        nextScene: "guinea_childhood",
      },
    ],
  },
  {
    id: "trait_selection",
    title: "Choose Your Starting Trait",
    description: `
> ./character_creator.exe --mode=real_mohamed

Before we begin, which trait best represents young Mohamed?
This will influence how the story unfolds...

Each trait unlocks different paths through his real journey.`,
    choices: [
      {
        text: "🧠 Curious Explorer (loves learning new things)",
        nextScene: "guinea_childhood",
        statBoost: { creativity: 2, technical: 1 },
        addAchievement: "Natural Learner",
      },
      {
        text: "💪 Resilient Fighter (overcomes any challenge)",
        nextScene: "guinea_childhood",
        statBoost: { resilience: 3 },
        addAchievement: "Unbreakable Spirit",
      },
      {
        text: "🎨 Creative Thinker (finds unique solutions)",
        nextScene: "guinea_childhood",
        statBoost: { creativity: 3 },
        addAchievement: "Outside the Box",
      },
      {
        text: "🤝 Natural Leader (brings people together)",
        nextScene: "guinea_childhood",
        statBoost: { leadership: 2, resilience: 1 },
        addAchievement: "Born Leader",
      },
    ],
  },
  {
    id: "guinea_childhood",
    title: "Chapter 1: Guinea Roots (2004-2011)",
    year: 2004,
    age: 6,
    location: "Guinea, West Africa",
    description: `
> cd /life/guinea/childhood
> ls -la memories/

October 15, 2004 - You're born in Guinea, West Africa. 

Life here is vibrant but challenging. No advanced technology, but your 
curiosity shines through. You draw imaginary inventions, play outside, 
and dream of things beyond your small world.

Your family makes a life-changing decision: America offers better opportunities.

2011 - At age 6, everything you know is about to change forever.

How do you feel about leaving everything behind?`,
    choices: [
      {
        text: "🌟 'This is the start of something amazing!'",
        nextScene: "nyc_arrival",
        statBoost: { creativity: 1, resilience: 1 },
      },
      {
        text: "😰 'I'm scared but I trust my family'",
        nextScene: "nyc_arrival",
        statBoost: { resilience: 2 },
      },
      {
        text: "🤔 'I wonder what America is really like'",
        nextScene: "nyc_arrival",
        statBoost: { creativity: 2 },
      },
    ],
  },
  {
    id: "nyc_arrival",
    title: "Chapter 2: The Bronx Reality (2011)",
    year: 2011,
    age: 6,
    location: "Bronx, NYC",
    description: `
> cd /life/usa/bronx
> status: CULTURE_SHOCK_ACTIVATED

Welcome to the Bronx, NYC! 

The city is LOUD, fast-paced, and overwhelming. Skyscrapers everywhere, 
people rushing, cars honking. This is nothing like Guinea.

You start 3rd grade without knowing a word of English. 

The first day of school arrives. Kids are talking, laughing, playing - 
and you understand nothing. The teacher is kind but you're lost.

Some kids point and whisper. You feel isolated and confused.

What's your survival strategy?`,
    choices: [
      {
        text: "📺 Watch TV to learn English (the cartoon method)",
        nextScene: "cartoon_breakthrough",
        statBoost: { creativity: 2, technical: 1 },
        addToInventory: "Cartoon Learning Method",
        addAchievement: "Unconventional Learner",
      },
      {
        text: "📚 Study traditional textbooks harder",
        nextScene: "traditional_struggle",
        statBoost: { resilience: 2 },
      },
      {
        text: "🤝 Try to make friends through gestures",
        nextScene: "social_first",
        statBoost: { leadership: 2 },
      },
    ],
  },
  {
    id: "cartoon_breakthrough",
    title: "The Dora Discovery (2011-2012)",
    year: 2012,
    age: 7,
    location: "Bronx, NYC",
    description: `
> ./learn_english.sh --method=cartoons --speed=3months
> Processing: Dora the Explorer, SpongeBob, educational shows...
> Progress: [████████████████████] 100%
> Result: FLUENT IN 3 MONTHS!

"Hola! Can you say 'Hola'?" - Dora becomes your teacher.

SpongeBob teaches you humor and expressions.
Educational shows build your vocabulary.

Month 1: You understand basic words
Month 2: You're forming sentences  
Month 3: You're FLUENT!

Your teachers are amazed. Classmates who once ignored you now ask:
"Wait, how did you learn English so fast?"

This moment defines your learning style forever.

🏆 ACHIEVEMENT UNLOCKED: "3-Month English Master"`,
    choices: [
      {
        text: "💡 'I find creative solutions to problems'",
        nextScene: "bronx_growth",
        statBoost: { creativity: 3, technical: 1 },
        addAchievement: "Creative Problem Solver",
      },
      {
        text: "🎯 'I adapt quickly to any environment'",
        nextScene: "bronx_growth",
        statBoost: { resilience: 2, leadership: 1 },
        addAchievement: "Quick Adapter",
      },
      {
        text: "🧠 'Learning is just pattern recognition'",
        nextScene: "bronx_growth",
        statBoost: { technical: 2, creativity: 1 },
        addAchievement: "Pattern Master",
      },
    ],
  },
  {
    id: "traditional_struggle",
    title: "The Hard Way",
    year: 2012,
    age: 7,
    location: "Bronx, NYC",
    description: `
> studying_progress.log: 15% complete...
> method: traditional
> efficiency: LOW

Textbooks are hard. Grammar rules are confusing. Progress is slow.

You're struggling while other kids seem to pick things up naturally.

But wait... there's a TV in the corner playing cartoons...

"Hola! I'm Dora!" 

Maybe there's a better way?`,
    choices: [
      {
        text: "📺 Switch to the cartoon method",
        nextScene: "cartoon_breakthrough",
        statBoost: { creativity: 1, resilience: 1 },
        addToInventory: "Cartoon Learning Method",
      },
      {
        text: "💪 Push through with pure determination",
        nextScene: "bronx_growth",
        statBoost: { resilience: 4 },
        addAchievement: "Iron Will",
      },
    ],
  },
  {
    id: "social_first",
    title: "The Friendship Approach",
    year: 2012,
    age: 7,
    location: "Bronx, NYC",
    description: `
> networking.exe --target=classmates --method=gestures

You try to connect through smiles, gestures, and shared activities.

Some kids are welcoming. Others not so much. But the language barrier 
is still there - you can play together but can't really communicate.

A friendly classmate points to the TV during break:
"Hey, want to watch Dora together?"

Maybe learning and friendship can happen together?`,
    choices: [
      {
        text: "📺 Learn English together through cartoons",
        nextScene: "cartoon_breakthrough",
        statBoost: { creativity: 1, leadership: 2 },
        addToInventory: "Cartoon Learning Method",
        addAchievement: "Social Learner",
      },
      {
        text: "🎯 Focus on language first, friends later",
        nextScene: "bronx_growth",
        statBoost: { technical: 1, resilience: 2 },
      },
    ],
  },
  {
    id: "bronx_growth",
    title: "Chapter 3: Bronx Years (2012-2018)",
    year: 2015,
    age: 10,
    location: "Bronx, NYC",
    description: `
> cd /life/bronx/middle_school
> status: GROWING_CONFIDENT

You're now fluent in English and thriving in school!

These middle school years shape who you become:

🎮 You discover video games: Call of Duty, Rocket League, FIFA
🧮 Math becomes your favorite subject - you love problem-solving
💻 You find old Chromebooks and start exploring basic coding
🏙️ The Bronx teaches you street smarts and resilience

You're becoming curious about technology and how things work.

What captures your attention most?`,
    choices: [
      {
        text: "🎮 Gaming - understanding game mechanics and design",
        nextScene: "queens_move",
        statBoost: { creativity: 2, technical: 1 },
        addToInventory: "Gaming Mindset",
      },
      {
        text: "💻 Coding - building simple websites and programs",
        nextScene: "queens_move",
        statBoost: { technical: 3 },
        addToInventory: "Early Coding Skills",
        addAchievement: "Young Programmer",
      },
      {
        text: "🧮 Math - solving complex problems and puzzles",
        nextScene: "queens_move",
        statBoost: { technical: 2, creativity: 1 },
        addToInventory: "Mathematical Thinking",
      },
    ],
  },
  {
    id: "queens_move",
    title: "Chapter 4: Queens Transition (2018)",
    year: 2018,
    age: 13,
    location: "Queens, NYC",
    description: `
> mv /life/bronx /life/queens
> status: NEW_ENVIRONMENT_LOADING...

8th grade - Your family moves from the Bronx to Queens.

New school, new faces, new challenges. But you're not the same scared 
6-year-old who couldn't speak English. You're confident now.

Queens feels different - more diverse, more opportunities.

You start standing out academically. Teachers notice your problem-solving 
skills and curiosity about technology.

This is where your developer identity really begins to form.

How do you approach this fresh start?`,
    choices: [
      {
        text: "🚀 Dive deep into computer science electives",
        nextScene: "high_school_dev",
        statBoost: { technical: 2, creativity: 1 },
      },
      {
        text: "🤝 Build a network while learning tech",
        nextScene: "high_school_dev",
        statBoost: { leadership: 2, technical: 1 },
      },
      {
        text: "🎯 Focus intensely on becoming the best programmer",
        nextScene: "high_school_dev",
        statBoost: { technical: 3 },
        requirement: { stat: "technical", min: 3 },
      },
    ],
  },
  {
    id: "high_school_dev",
    title: "Chapter 5: High School Developer (2018-2022)",
    year: 2020,
    age: 16,
    location: "Queens, NYC",
    description: `
> cd /life/queens/high_school
> git init developer_journey
> status: IDENTITY_FORMING

High school in Queens (2018-2022) - This is where everything clicks!

📚 You take every CS elective available
🧠 Self-teach HTML, CSS, JavaScript in your free time
🎮 Discover Unity and Python - build small games and scripts
💼 Start side hustles:
    • After-school tutoring (you're great at explaining concepts)
    • Selling sneakers (entrepreneurial spirit)
    • Tech help for relatives and neighbors

🌐 You create your GitHub account: MeeksonJr
💻 Build your first real websites and document everything

You're not just surviving high school - you're building your future.

What defines your high school developer era?`,
    choices: [
      {
        text: "🏗️ 'I want to build things that matter'",
        nextScene: "virginia_decision",
        statBoost: { creativity: 2, technical: 2 },
        unlockProject: "First Websites",
        addAchievement: "Builder Mindset",
      },
      {
        text: "🎯 'I want to master every technology I touch'",
        nextScene: "virginia_decision",
        statBoost: { technical: 4 },
        addAchievement: "Tech Perfectionist",
      },
      {
        text: "🤝 'I want to help others learn while I learn'",
        nextScene: "virginia_decision",
        statBoost: { leadership: 3, technical: 1 },
        addAchievement: "Natural Mentor",
      },
    ],
  },
  {
    id: "virginia_decision",
    title: "Chapter 6: The Bold Move (2022)",
    year: 2022,
    age: 18,
    location: "Queens → Norfolk, Virginia",
    description: `
> ./make_life_decision.exe --target=college --location=virginia
> Analyzing options...
> Decision: BOLD_MOVE_TO_VIRGINIA

Right after high school graduation, you make a huge decision:

Move to Virginia to pursue Computer Science seriously at 
Tidewater Community College (TCC).

This isn't just about college - it's about independence, growth, 
and taking control of your future.

You're leaving NYC, your family, everything familiar.

But you know this is the right move for your career.

What drives this decision?`,
    choices: [
      {
        text: "🎯 'I need to focus 100% on becoming a developer'",
        nextScene: "tcc_journey",
        statBoost: { technical: 2, resilience: 1 },
      },
      {
        text: "🌟 'I want to prove I can succeed anywhere'",
        nextScene: "tcc_journey",
        statBoost: { resilience: 2, leadership: 1 },
      },
      {
        text: "🚀 'Virginia has better opportunities for my future'",
        nextScene: "tcc_journey",
        statBoost: { creativity: 1, technical: 1, resilience: 1 },
      },
    ],
  },
  {
    id: "tcc_journey",
    title: "Chapter 7: TCC Mastery (2022-2024)",
    year: 2023,
    age: 19,
    location: "Norfolk, Virginia - TCC",
    description: `
> cd /education/tidewater_community_college
> git clone computer_science_degree
> status: THRIVING

Tidewater Community College becomes your launching pad!

📚 Courses: Python, Java, Data Structures, Algorithms
💻 You go beyond coursework - self-teaching:
    • React, Next.js, TailwindCSS
    • Supabase, Firebase, PostgreSQL
    • AI integration with Gemini and Hugging Face

🧑‍🏫 You tutor peers in programming and math
💼 Side hustles continue:
    • Uber Eats/DoorDash (balancing studies and income)
    • Freelance websites for local businesses

The terminal becomes your best friend. You're coding 12+ hours a day.

🏆 2024 - You graduate with your A.S. in Computer Science!

But the real test is coming...`,
    choices: [
      {
        text: "🏆 'Time for the ultimate challenge - internships'",
        nextScene: "internship_opportunity",
        statBoost: { technical: 2, resilience: 1 },
        addAchievement: "TCC Graduate",
      },
    ],
  },
  {
    id: "internship_opportunity",
    title: "Chapter 8: The Competition (Fall 2024)",
    year: 2024,
    age: 20,
    location: "Norfolk, Virginia",
    description: `
> cd /career/internship_competition
> participants: 13_teams
> stakes: MAXIMUM
> your_status: READY_TO_PROVE_EVERYTHING

Fall 2024 - The Product Manager Accelerator internship opportunity appears.

13 teams competing. Best final app wins.

This is your moment to prove that the kid who learned English from 
cartoons can compete with anyone.

Your tech stack is ready:
✅ TypeScript, Supabase, React, Next.js
✅ Gemini AI integration
✅ Hugging Face APIs
✅ Full-stack expertise

Your heart is racing. This could change everything.

What's your competition strategy?`,
    choices: [
      {
        text: "🏆 'I'm not here to participate - I'm here to WIN'",
        nextScene: "competition_domination",
        statBoost: { technical: 2, resilience: 2 },
        requirement: { stat: "technical", min: 8 },
      },
      {
        text: "🧠 'I'll build something they've never seen before'",
        nextScene: "innovation_path",
        statBoost: { creativity: 3, technical: 1 },
        requirement: { stat: "creativity", min: 6 },
      },
      {
        text: "🤝 'I'll lead my team to collective success'",
        nextScene: "leadership_path",
        statBoost: { leadership: 3, technical: 1 },
        requirement: { stat: "leadership", min: 5 },
      },
    ],
  },
  {
    id: "competition_domination",
    title: "The Competitor's Path",
    year: 2024,
    age: 20,
    location: "Norfolk, Virginia",
    description: `
> competition_mode: ACTIVATED
> target: FIRST_PLACE
> mindset: UNSTOPPABLE

You study every competing team. You analyze winning patterns. 
You push yourself harder than ever before.

Your SaaS app comes together beautifully:
• TypeScript for type safety
• Supabase for real-time data
• Gemini AI for intelligent features
• Polished UI that impresses judges

Team members watch in awe: "Mohamed, your code is incredible!"

You're not just building an app - you're crafting a masterpiece.`,
    choices: [
      {
        text: "🚀 'Push even harder - perfection is the goal'",
        nextScene: "victory_moment",
        statBoost: { technical: 3, resilience: 1 },
      },
      {
        text: "🤝 'Help my teammates reach my level too'",
        nextScene: "victory_moment",
        statBoost: { leadership: 2, technical: 2 },
      },
    ],
  },
  {
    id: "innovation_path",
    title: "The Innovator's Vision",
    year: 2024,
    age: 20,
    location: "Norfolk, Virginia",
    description: `
> ./think_outside_the_box.exe
> innovation_level: MAXIMUM
> status: GAME_CHANGING

You don't just want to win - you want to create something revolutionary.

AI integration that feels magical.
UX that makes judges say "How did you think of this?"
Terminal aesthetics meets modern design.

Your app isn't just functional - it's an experience.

Judge whispers: "I've never seen anything like this before..."

This is your Guinea-to-Norfolk story in code form.`,
    choices: [
      {
        text: "🎨 'This represents everything I've learned'",
        nextScene: "victory_moment",
        statBoost: { creativity: 4, technical: 1 },
      },
    ],
  },
  {
    id: "leadership_path",
    title: "The Team Builder",
    year: 2024,
    age: 20,
    location: "Norfolk, Virginia",
    description: `
> leadership_mode: ACTIVATED
> team_synergy: MAXIMUM
> goal: COLLECTIVE_EXCELLENCE

You remember tutoring classmates, helping relatives with tech.
Leadership isn't about being the smartest - it's about lifting everyone.

You organize code reviews, share knowledge, delegate effectively.
Your team becomes more than the sum of its parts.

Teammate: "Mohamed, you make us all better developers."

The app succeeds because everyone contributed their best.`,
    choices: [
      {
        text: "👑 'Great leaders create more leaders'",
        nextScene: "victory_moment",
        statBoost: { leadership: 4, resilience: 1 },
      },
    ],
  },
  {
    id: "victory_moment",
    title: "Chapter 9: The Victory (Fall 2024)",
    year: 2024,
    age: 20,
    location: "Norfolk, Virginia",
    description: `
> competition_results.txt
> WINNER: MOHAMED_DATT_TEAM
> RANK: 1st out of 13 teams
> STATUS: LEGENDARY
> ACHIEVEMENT_UNLOCKED: "Against All Odds"

"And the winner is... Mohamed Datt's team!"

The room erupts. Your heart pounds. 

From Guinea to this moment - every challenge, every late night coding 
session, every "impossible" obstacle overcome.

The kid who learned English from Dora the Explorer just beat 12 other 
teams of experienced developers.

🏆 ACHIEVEMENT UNLOCKED: "Internship Champion"
🚀 PROJECT UNLOCKED: "Award-Winning SaaS"

But this isn't the end - it's validation that you're ready for anything.

What does this victory mean to you?`,
    choices: [
      {
        text: "🏆 'Proof that unconventional paths lead to success'",
        nextScene: "current_chapter",
        statBoost: { resilience: 2, creativity: 1 },
        addAchievement: "Unconventional Winner",
      },
      {
        text: "🚀 'Confirmation I'm ready for the next level'",
        nextScene: "current_chapter",
        statBoost: { technical: 2, leadership: 1 },
        addAchievement: "Ready for Anything",
      },
      {
        text: "🌟 'Validation of my unique journey and perspective'",
        nextScene: "current_chapter",
        statBoost: { creativity: 2, resilience: 1 },
        addAchievement: "Unique Perspective",
      },
    ],
  },
  {
    id: "current_chapter",
    title: "Chapter 10: The Present (2024-2025)",
    year: 2025,
    age: 20,
    location: "Norfolk, Virginia - ODU",
    description: `
> pwd
> /home/mohamed/norfolk_virginia/odu/2025
> status: FULL_STACK_AI_DEVELOPER
> age: 20
> next_goal: CHANGING_THE_WORLD

Today, Mohamed continues building the future:

🎓 Currently: ODU Computer Science student
🏆 Recent: 1st place internship winner (Fall 2024)
💼 Building: Revolutionary SaaS applications

REAL PROJECTS IN PRODUCTION:
• EduSphere AI - AI-powered student productivity suite
• InterviewPrep AI - Voice + resume analysis platform
• AI Content Generator - Full SaaS with analytics
• SnapFind - Advanced image analysis tool
• myLife Health Tracker - AI health report analysis
• Autodesk Portfolio - CAD project showcase platform

The boy who learned English from cartoons is now building AI-powered 
solutions that help thousands of people.

From Guinea → Bronx → Queens → Norfolk → The World

What's the next chapter in Mohamed's story?`,
    choices: [
      {
        text: "💼 'Ready to join an amazing company'",
        nextScene: "ending_hire_me",
        requirement: { stat: "technical", min: 10 },
      },
      {
        text: "🤝 'Looking for incredible teammates to build with'",
        nextScene: "ending_collaborate",
        requirement: { stat: "leadership", min: 8 },
      },
      {
        text: "🚀 'Ready to revolutionize an entire industry'",
        nextScene: "ending_innovate",
        requirement: { stat: "creativity", min: 10 },
      },
      {
        text: "📧 'Let's connect and explore possibilities'",
        nextScene: "ending_connect",
      },
    ],
  },
  {
    id: "ending_hire_me",
    title: "🎯 The Perfect Hire",
    description: `
> employee_evaluation.exe --candidate=mohamed_datt
> analyzing_journey: guinea_to_norfolk
> RESULT: EXCEPTIONAL_HIRE

You've experienced Mohamed's REAL journey:

✅ Proven resilience (Guinea → NYC → Virginia success)
✅ Rapid learning ability (English in 3 months, self-taught coding)
✅ Competition winner (1st place out of 13 teams, Fall 2024)
✅ Technical excellence (6+ production SaaS apps at age 20)
✅ AI expertise (Gemini, Hugging Face, Groq integration)
✅ Full-stack mastery (Next.js, React, Supabase, TypeScript)
✅ Leadership potential (tutoring, mentoring, team building)

Mohamed isn't just another developer - he's a proven winner with an 
incredible story, unmatched work ethic, and the creativity to solve 
problems others can't even see.

At 20 years old, he's already accomplished what many developers 
take years to achieve.

Ready to make the best hiring decision of 2025?`,
    choices: [
      {
        text: "📧 Email Mohamed directly",
        nextScene: "contact_email",
      },
      {
        text: "💼 View LinkedIn profile",
        nextScene: "contact_linkedin",
      },
      {
        text: "📄 Download resume",
        nextScene: "contact_resume",
      },
      {
        text: "🔄 Explore other story paths",
        nextScene: "restart",
      },
    ],
    isEnding: true,
  },
  {
    id: "ending_collaborate",
    title: "🤝 The Dream Collaborator",
    description: `
> collaboration_assessment.exe --subject=mohamed_datt
> analyzing_leadership_journey...
> RESULT: IDEAL_TEAMMATE

Your choices revealed Mohamed's collaboration superpowers:

✅ Natural mentor (tutored peers throughout college)
✅ Team elevator (1st place team victory in competition)
✅ Cultural bridge (Guinea → NYC → Virginia adaptability)
✅ Technical + emotional intelligence (code + people skills)
✅ Proven track record (multiple successful projects)
✅ Unique perspective (unconventional problem-solving)

Mohamed doesn't just join teams - he transforms them.

His journey from learning English via cartoons to winning coding 
competitions shows he brings creativity and resilience to every 
collaboration.

At 20, he's already proven he can lead, follow, and adapt to any 
team dynamic while delivering exceptional results.

Ready to build something extraordinary together?`,
    choices: [
      {
        text: "🚀 Start a collaboration conversation",
        nextScene: "contact_email",
      },
      {
        text: "🐙 Explore his GitHub projects",
        nextScene: "contact_github",
      },
      {
        text: "📝 Use the contact form",
        nextScene: "contact_form",
      },
      {
        text: "🎮 Play again for different insights",
        nextScene: "restart",
      },
    ],
    isEnding: true,
  },
  {
    id: "ending_innovate",
    title: "💡 The Innovation Catalyst",
    description: `
> innovation_potential.exe --subject=mohamed_datt
> analyzing_creative_journey...
> RESULT: GAME_CHANGER

You've unlocked Mohamed's innovation DNA:

✅ Unconventional thinking (English via cartoons → coding mastery)
✅ AI-first mindset (Gemini, Hugging Face, Groq integration)
✅ User experience focus (terminal aesthetics + modern UX)
✅ Rapid prototyping (6+ production apps in 2 years)
✅ Cross-cultural perspective (Guinea → NYC → Virginia insights)
✅ Problem-solving creativity (turns constraints into opportunities)

Mohamed doesn't just build applications - he crafts experiences 
that users remember and love.

His journey from a 6-year-old who couldn't speak English to a 
20-year-old AI developer shows he sees possibilities others miss.

Every project combines technical excellence with creative vision, 
resulting in solutions that feel magical to users.

Ready to revolutionize your industry together?`,
    choices: [
      {
        text: "⚡ Let's innovate together",
        nextScene: "contact_email",
      },
      {
        text: "🎨 See his creative projects",
        nextScene: "contact_github",
      },
      {
        text: "🧠 Discuss AI possibilities",
        nextScene: "contact_form",
      },
      {
        text: "🔄 Experience other story paths",
        nextScene: "restart",
      },
    ],
    isEnding: true,
  },
  {
    id: "ending_connect",
    title: "🌟 The Connection",
    description: `
> networking.exe --mode=genuine --subject=mohamed_datt
> STATUS: CONNECTION_ESTABLISHED

Sometimes the best opportunities start with a simple conversation.

Mohamed's journey from Guinea to Norfolk shows that meaningful 
connections can change everything. His story is proof that with 
the right opportunities and support, incredible things happen.

Whether you're interested in:
• Hiring an exceptional 20-year-old developer
• Collaborating on AI-powered projects
• Discussing the future of web development
• Sharing stories about overcoming challenges
• Just saying hello and connecting

Mohamed is always excited to meet new people and explore possibilities.

His inbox is open, his GitHub is active, and his next chapter is 
waiting to be written.

What kind of conversation would you like to have?`,
    choices: [
      {
        text: "💼 Business opportunity discussion",
        nextScene: "contact_email",
      },
      {
        text: "🤝 Collaboration brainstorming",
        nextScene: "contact_form",
      },
      {
        text: "☕ Casual developer chat",
        nextScene: "contact_linkedin",
      },
      {
        text: "🧠 AI and tech discussion",
        nextScene: "contact_github",
      },
    ],
    isEnding: true,
  },
]

export default function TerminalAdventureEnhanced() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showChoices, setShowChoices] = useState(false)
  const [commandInput, setCommandInput] = useState("")
  const [showCommandLine, setShowCommandLine] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)

  const currentScene = SCENES.find((scene) => scene.id === gameState.currentScene)

  // Handle secret commands
  const handleSecretCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()

    switch (cmd) {
      case "debug":
      case "--debug":
        setGameState((prev) => ({ ...prev, debugMode: !prev.debugMode }))
        return `Debug mode ${gameState.debugMode ? "disabled" : "enabled"}! 🐛`

      case "sudo":
      case "sudo su":
        return `Nice try! But Mohamed's journey can't be hacked. 😄`

      case "ls -a":
        return `total 42\ndrwxr-xr-x  mohamed  staff   creativity\ndrwxr-xr-x  mohamed  staff   resilience\ndrwxr-xr-x  mohamed  staff   technical_skills\ndrwxr-xr-x  mohamed  staff   .hidden_talents`

      case "whoami":
        return `mohamed_datt\nAge: 20\nLocation: Norfolk, Virginia\nStatus: Full Stack AI Developer\nSuperpower: Learning anything in 3 months`

      case "npm install mo":
      case "npx mo":
        return `Installing Mohamed Datt...\n[████████████████████] 100%\n✅ Success! Mohamed is ready to join your team.`

      case "git log --oneline":
        return `a1b2c3d Won 1st place internship (Fall 2024)\nb2c3d4e Built EduSphere AI\nc3d4e5f Graduated TCC with A.S. CS\nd4e5f6g Learned English in 3 months\ne5f6g7h Born in Guinea`

      case "stack":
        return `Mohamed's Current Stack:\nFrontend: Next.js, React, TailwindCSS, Framer Motion\nBackend: Supabase, Firebase, NeonDB, PostgreSQL\nAI: Gemini 2.0 Flash, Hugging Face, Groq\nTools: TypeScript, Vercel, GitHub`

      case "projects":
        return `Production Projects:\n• EduSphere AI\n• InterviewPrep AI\n• AI Content Generator\n• SnapFind\n• myLife Health Tracker\n• Autodesk Portfolio`

      case "help":
        return `Secret Commands:\ndebug, sudo, ls -a, whoami, npm install mo, git log, stack, projects, clear`

      case "clear":
        return "CLEAR_TERMINAL"

      default:
        return `Command not found: ${command}\nTry 'help' for available commands.`
    }
  }

  // Typing effect for scene descriptions
  useEffect(() => {
    if (!currentScene) return

    setIsTyping(true)
    setShowChoices(false)
    setDisplayText("")

    const text = currentScene.description
    let index = 0

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        setShowChoices(true)
        clearInterval(typeInterval)
      }
    }, 15) // Faster typing for better UX

    return () => clearInterval(typeInterval)
  }, [currentScene])

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [displayText, showChoices])

  const handleChoice = (choice: Choice) => {
    // Check requirements
    if (choice.requirement) {
      const { stat, min } = choice.requirement
      if (gameState.stats[stat as keyof typeof gameState.stats] < min) {
        return // Choice not available
      }
    }

    setGameState((prev) => {
      const newState = { ...prev }

      // Update stats
      if (choice.statBoost) {
        Object.entries(choice.statBoost).forEach(([stat, boost]) => {
          newState.stats[stat as keyof typeof newState.stats] += boost
        })
      }

      // Add to inventory
      if (choice.addToInventory) {
        newState.inventory.push(choice.addToInventory)
      }

      // Unlock projects
      if (choice.unlockProject) {
        newState.unlockedProjects.push(choice.unlockProject)
      }

      // Add achievements
      if (choice.addAchievement) {
        newState.achievements.push(choice.addAchievement)
      }

      // Update visited scenes
      if (!newState.visitedScenes.includes(prev.currentScene)) {
        newState.visitedScenes.push(prev.currentScene)
      }

      // Update age and location based on scene
      if (currentScene?.age) newState.age = currentScene.age
      if (currentScene?.location) newState.location = currentScene.location

      // Move to next scene
      newState.currentScene = choice.nextScene

      // Check if game is complete
      if (choice.nextScene.startsWith("ending_") || choice.nextScene.startsWith("contact_")) {
        newState.gameComplete = true
      }

      return newState
    })
  }

  const handleSpecialAction = (action: string) => {
    switch (action) {
      case "contact_email":
        window.open("mailto:d.mohamed1504@gmail.com?subject=Let's Connect - From Terminal Adventure Game", "_blank")
        break
      case "contact_linkedin":
        window.open("https://linkedin.com/in/mohamed-datt", "_blank")
        break
      case "contact_github":
        window.open("https://github.com/MeeksonJr", "_blank")
        break
      case "contact_resume":
        const link = document.createElement("a")
        link.href = "/resume-Mohamed-Datt-Full Stack Developer-2025.pdf"
        link.download = "Mohamed-Datt-Resume-2025.pdf"
        link.click()
        break
      case "contact_form":
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
        break
      case "restart":
        setGameState(INITIAL_STATE)
        break
    }
  }

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commandInput.trim()) return

    const result = handleSecretCommand(commandInput)

    if (result === "CLEAR_TERMINAL") {
      setDisplayText("")
      setShowChoices(false)
    } else {
      // Add command result to display
      setDisplayText((prev) => prev + `\n\n> ${commandInput}\n${result}`)
    }

    setCommandInput("")
    setShowCommandLine(false)
  }

  const resetGame = () => {
    setGameState(INITIAL_STATE)
  }

  const getStatBar = (value: number, max = 15) => {
    const filled = Math.min(value, max)
    const empty = max - filled
    return "█".repeat(filled) + "░".repeat(empty)
  }

  const isChoiceAvailable = (choice: Choice) => {
    if (!choice.requirement) return true
    const { stat, min } = choice.requirement
    return gameState.stats[stat as keyof typeof gameState.stats] >= min
  }

  if (!currentScene) return null

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-green-400 text-sm mb-4">$ ./mohamed_real_journey.exe --interactive</div>
          <div className="flex items-center gap-3 mb-8">
            <Terminal className="text-green-400" size={32} />
            <h2 className="text-3xl md:text-4xl font-bold">Mohamed's Real Journey</h2>
            <span className="text-sm text-gray-400">Guinea → NYC → Norfolk → The World</span>
          </div>

          <Inspectable elementId="terminal-adventure">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Enhanced Stats Panel */}
              <div className="lg:col-span-1">
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 sticky top-4 space-y-4">
                  {/* Character Info */}
                  <div>
                    <h3 className="text-green-400 font-semibold mb-2">Character Profile</h3>
                    <div className="text-sm space-y-1">
                      <div>
                        Age: <span className="text-green-400">{gameState.age}</span>
                      </div>
                      <div>
                        Location: <span className="text-blue-400">{gameState.location}</span>
                      </div>
                      {currentScene?.year && (
                        <div>
                          Year: <span className="text-yellow-400">{currentScene.year}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div>
                    <h4 className="text-green-400 font-semibold mb-3">Stats</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Creativity</span>
                          <span>{gameState.stats.creativity}</span>
                        </div>
                        <div className="font-mono text-xs text-green-400">{getStatBar(gameState.stats.creativity)}</div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Technical</span>
                          <span>{gameState.stats.technical}</span>
                        </div>
                        <div className="font-mono text-xs text-blue-400">{getStatBar(gameState.stats.technical)}</div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Resilience</span>
                          <span>{gameState.stats.resilience}</span>
                        </div>
                        <div className="font-mono text-xs text-yellow-400">
                          {getStatBar(gameState.stats.resilience)}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Leadership</span>
                          <span>{gameState.stats.leadership}</span>
                        </div>
                        <div className="font-mono text-xs text-purple-400">
                          {getStatBar(gameState.stats.leadership)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  {gameState.achievements.length > 0 && (
                    <div>
                      <h4 className="text-yellow-400 font-semibold mb-2 flex items-center gap-1">
                        <Trophy size={14} />
                        Achievements
                      </h4>
                      <div className="space-y-1 text-xs">
                        {gameState.achievements.map((achievement, index) => (
                          <div key={index} className="text-yellow-300">
                            🏆 {achievement}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Unlocked Projects */}
                  {gameState.unlockedProjects.length > 0 && (
                    <div>
                      <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-1">
                        <Code size={14} />
                        Projects
                      </h4>
                      <div className="space-y-1 text-xs">
                        {gameState.unlockedProjects.map((project, index) => (
                          <div key={index} className="text-blue-300">
                            💻 {project}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Inventory */}
                  {gameState.inventory.length > 0 && (
                    <div>
                      <h4 className="text-purple-400 font-semibold mb-2">Inventory</h4>
                      <div className="space-y-1 text-xs">
                        {gameState.inventory.map((item, index) => (
                          <div key={index} className="text-purple-300">
                            • {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Debug Mode */}
                  {gameState.debugMode && (
                    <div className="border-t border-gray-600 pt-3">
                      <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-1">
                        <Zap size={14} />
                        Debug Mode
                      </h4>
                      <div className="text-xs text-red-300 space-y-1">
                        <div>Scene: {gameState.currentScene}</div>
                        <div>Visited: {gameState.visitedScenes.length}</div>
                        <div>Complete: {gameState.gameComplete ? "Yes" : "No"}</div>
                      </div>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="border-t border-gray-700 pt-4 space-y-2">
                    <button
                      onClick={() => setShowCommandLine(!showCommandLine)}
                      className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors text-sm w-full"
                    >
                      <Terminal size={14} />
                      Command Line
                    </button>

                    <button
                      onClick={resetGame}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm w-full"
                    >
                      <RotateCcw size={14} />
                      Restart Journey
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Game Terminal */}
              <div className="lg:col-span-3">
                <div className="bg-black border border-gray-700 rounded-lg overflow-hidden">
                  {/* Terminal Header */}
                  <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-300 text-sm ml-2">mohamed_real_journey.exe</span>
                    {gameState.debugMode && <span className="text-red-400 text-xs ml-auto">DEBUG MODE</span>}
                  </div>

                  {/* Terminal Content */}
                  <div ref={terminalRef} className="p-6 h-96 overflow-y-auto font-mono text-sm leading-relaxed">
                    <div className="text-green-400 mb-4">{currentScene.title}</div>

                    {currentScene.year && (
                      <div className="text-yellow-400 text-xs mb-2">
                        📅 {currentScene.year} | Age: {currentScene.age} | 📍 {currentScene.location}
                      </div>
                    )}

                    <div className="text-gray-300 whitespace-pre-line mb-6">{displayText}</div>

                    {isTyping && <span className="text-green-400 animate-pulse">█</span>}

                    {/* Command Line Interface */}
                    {showCommandLine && (
                      <form onSubmit={handleCommandSubmit} className="mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400">$</span>
                          <input
                            type="text"
                            value={commandInput}
                            onChange={(e) => setCommandInput(e.target.value)}
                            placeholder="Enter secret command..."
                            className="flex-1 bg-transparent text-green-400 outline-none"
                            autoFocus
                          />
                        </div>
                      </form>
                    )}

                    <AnimatePresence>
                      {showChoices && (
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {currentScene.choices.map((choice, index) => {
                            const available = isChoiceAvailable(choice)
                            const isSpecialAction = [
                              "contact_email",
                              "contact_linkedin",
                              "contact_github",
                              "contact_resume",
                              "contact_form",
                              "restart",
                            ].includes(choice.nextScene)

                            return (
                              <motion.button
                                key={index}
                                className={`block w-full text-left p-3 rounded border transition-colors ${
                                  available
                                    ? "border-gray-600 hover:border-green-400 hover:bg-gray-900/50 text-gray-300 hover:text-white"
                                    : "border-gray-800 text-gray-600 cursor-not-allowed"
                                }`}
                                onClick={() => {
                                  if (available) {
                                    if (isSpecialAction) {
                                      handleSpecialAction(choice.nextScene)
                                    } else {
                                      handleChoice(choice)
                                    }
                                  }
                                }}
                                disabled={!available}
                                whileHover={available ? { scale: 1.02 } : {}}
                                whileTap={available ? { scale: 0.98 } : {}}
                              >
                                <span className="text-green-400">{">"} </span>
                                {choice.text}
                                {!available && <span className="text-red-400 text-xs ml-2">[Locked]</span>}
                                {choice.statBoost && available && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {Object.entries(choice.statBoost).map(([stat, boost]) => (
                                      <span key={stat} className="mr-2">
                                        +{boost} {stat}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </motion.button>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Enhanced Game Info */}
                <div className="mt-4 text-center text-gray-400 text-sm space-y-2">
                  <p>🎮 Interactive journey based on Mohamed's REAL life story • Every choice actually happened</p>
                  <p className="text-xs">
                    💡 Try secret commands: debug, sudo, ls -a, whoami, npm install mo, stack, projects
                  </p>
                  {gameState.gameComplete && (
                    <motion.div
                      className="mt-4 p-4 bg-green-900/20 border border-green-400/30 rounded-lg"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <p className="text-green-400 font-semibold">🎉 Journey Complete!</p>
                      <p className="text-gray-300 text-sm mt-1">
                        You've experienced Mohamed's real story from Guinea to Norfolk. Ready to be part of his next
                        chapter?
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </Inspectable>
        </motion.div>
      </div>
    </section>
  )
}
