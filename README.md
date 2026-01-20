# 🚀 Mohamed Datt's Creative Portfolio

\`\`\`
 ███▄ ▄███▓ ▒█████  
▓██▒▀█▀ ██▒▒██▒  ██▒
▓██    ▓██░▒██░  ██▒
▒██    ▒██ ▒██   ██░
▒██▒   ░██▒░ ████▓▒░
░ ▒░   ░  ░░ ▒░▒░▒░ 
░  ░      ░  ░ ▒ ▒░ 
░      ░   ░ ░ ░ ▒  
       ░       ░ ░  
\`\`\`

> **From Guinea to Norfolk, from cartoons to code - the journey continues...**

[![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.11.17-pink?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

## 🌟 About This Portfolio

Welcome to my creative, terminal-inspired portfolio! This isn't just another developer portfolio - it's an **interactive experience** that tells the story of a 20-year-old developer who learned English from Dora the Explorer and built a career in AI-powered web development.

**Live Demo:** [mohameddatt.com](https://mohameddatt.com)

## 🎨 Design System

This portfolio uses a comprehensive design system with:

- **Design Tokens**: Centralized constants for spacing, typography, colors, and more
- **Layout Components**: Standardized containers and page structures  
- **Utility Components**: Reusable UI components with built-in accessibility
- **Performance Optimizations**: Memoized components for optimal rendering
- **Accessibility**: ARIA attributes, keyboard navigation, and screen reader support

📚 **See [`docs/DESIGN_SYSTEM_GUIDE.md`](docs/DESIGN_SYSTEM_GUIDE.md) for complete documentation**

🏗️ **See [`DESIGN_SYSTEM_IMPLEMENTATION.md`](DESIGN_SYSTEM_IMPLEMENTATION.md) for implementation status**

## 🎮 **The Terminal Adventure Game**

The centerpiece of this portfolio is an **interactive terminal adventure** that lets visitors experience my real journey:

### 🌍 **Real Story Timeline:**
- **2004**: Born in Guinea, West Africa
- **2011**: Moved to NYC at age 6, learned English in 3 months from cartoons
- **2018**: Moved to Queens, discovered coding
- **2022**: Started Computer Science at Tidewater Community College
- **2024**: Graduated TCC, won 1st place in internship competition
- **2025**: Currently at Old Dominion University, building AI-powered SaaS

### 🎯 **Interactive Features:**
- **Character Creation**: Choose traits that affect the story
- **Secret Commands**: `debug`, `sudo`, `npm install mo`, `stack`
- **Achievement System**: Unlock real milestones from my journey
- **Multiple Endings**: Different paths based on user choices
- **Live GitHub Integration**: Discover real projects as you progress
- **Save Progress**: Continue where you left off

### 🏆 **Real Achievements Unlocked:**
- 🎓 **Academic Excellence**: TCC Computer Science Graduate
- 🏆 **Competition Winner**: 1st place out of 13 teams
- 🚀 **Project Builder**: 5+ AI-powered SaaS applications
- 🌍 **Cultural Bridge**: Guinea → NYC → Norfolk journey
- 📺 **Language Master**: English fluency in 3 months

## ✨ Features

### 🎨 **Terminal-Inspired Design**
- **Authentic Terminal UI**: Black & white with green matrix accents
- **Animated Elements**: Blinking cursors, typing effects, system stats
- **Interactive Commands**: Real terminal commands and responses
- **Matrix Background**: Subtle animated grid patterns

### 🤖 **AI-Powered Interactions**
- **Dual Chatbots**: Gemini 2.0 Flash and Groq AI models
- **Personal Assistant**: Trained on my complete life story and projects
- **Element Inspector**: AI explains code and design decisions
- **GitHub Integration**: Live repository data and project details

### 🎯 **Interactive Features**
- **Command Hub**: Circular navigation menu with terminal aesthetics
- **Inspector Mode**: Click any element to learn about implementation
- **Floating Navigation**: Smooth section scrolling with progress indicator
- **Real-time Stats**: Live system uptime, location, and status

### 📧 **Professional Contact System**
- **Verified Domain**: contact@mohameddatt.com (no more test emails!)
- **React Email Templates**: Beautiful, responsive email design
- **Form Validation**: Client and server-side validation
- **Auto-responses**: Professional confirmation emails

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15.1.3 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: shadcn/ui

### **AI & APIs**
- **AI SDK**: Vercel AI SDK
- **Models**: Gemini 2.0 Flash, Groq (Llama 3.3, Mixtral)
- **Email**: Resend + React Email
- **GitHub**: REST API integration with live data

### **Deployment**
- **Platform**: Vercel
- **Domain**: mohameddatt.com (verified)
- **Environment**: Production optimized

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/MeeksonJr/portfolio-2025.git
   cd portfolio-2025
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

4. **Configure your environment variables**
   \`\`\`env
   # Required for AI chatbots
   GEMINI_API_KEY=your_gemini_api_key
   GROQ_API_KEY=your_groq_api_key
   
   # Required for contact form (IMPORTANT: Use verified domain!)
   RESEND_API_KEY=your_resend_api_key
   
   # Optional for GitHub integration
   GITHUB_TOKEN=your_github_token
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Environment Variables

| Variable | Required | Description | Where to Get |
|----------|----------|-------------|--------------|
| `GEMINI_API_KEY` | ✅ | Google Gemini AI API key | [Google AI Studio](https://makersuite.google.com/app/apikey) |
| `GROQ_API_KEY` | ✅ | Groq AI API key | [Groq Console](https://console.groq.com/keys) |
| `RESEND_API_KEY` | ✅ | Resend email service key | [Resend Dashboard](https://resend.com/api-keys) |
| `GITHUB_TOKEN` | ⚪ | GitHub personal access token | [GitHub Settings](https://github.com/settings/tokens) |

### 🚨 **Important Email Setup:**
Make sure to verify your domain in Resend dashboard and use your verified domain email (e.g., `contact@yourdomain.com`) instead of the test email (`onboarding@resend.dev`).

## 🎮 **Real Projects Showcased**

### 🎓 **EduSphere AI** (2024)
- **Stack**: Next.js, Supabase, Gemini, TailwindCSS
- **Features**: Student dashboard, AI assignment assistant, blog generator
- **Achievement**: Part of 1st place winning internship project

### 💼 **InterviewPrep AI** (2024)
- **Stack**: Next.js, PostgreSQL, Gemini, Firebase, PayPal
- **Features**: AI mock interviews (voice + text), resume analysis
- **Innovation**: Real-time feedback and progress tracking

### 📝 **AI Content Generator** (2024)
- **Stack**: Next.js 14, Supabase, Gemini, Hugging Face, Recharts
- **Features**: Blog/social/product content generation, analytics dashboard
- **Business**: Tiered subscriptions and API access

### 🔍 **SnapFind** (2024)
- **Stack**: Next.js, Gemini Vision, Hugging Face
- **Features**: Advanced image analysis and object detection
- **AI**: Multi-model image processing pipeline

### 🏥 **myLife Health Tracker** (2024)
- **Stack**: Next.js, Supabase, Gemini, Chart.js
- **Features**: AI-powered health report analysis and insights
- **Impact**: Personal health management automation

## 📁 Project Structure

\`\`\`
portfolio-2025/
├── 📁 app/
│   ├── 📁 actions/          # Server Actions (contact form, etc.)
│   ├── 📁 api/              # API Routes (AI chat, GitHub data)
│   ├── globals.css          # Global styles & terminal theme
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page with all sections
├── 📁 components/
│   ├── 📁 emails/           # React Email templates
│   ├── 📁 ui/               # shadcn/ui components
│   ├── about.tsx            # About section with real story
│   ├── ai-chatbot-simple.tsx # Main AI chatbot
│   ├── command-hub.tsx      # Circular terminal navigation
│   ├── contact.tsx          # Terminal-style contact form
│   ├── education.tsx        # TCC → ODU timeline
│   ├── experience.tsx       # Internship & achievements
│   ├── footer.tsx           # Terminal footer with system stats
│   ├── github-showcase.tsx  # Live GitHub repository data
│   ├── hero.tsx             # Landing section with typing effect
│   ├── inspect-*.tsx        # Inspector mode components
│   ├── mini-inspector.tsx   # Element inspector with AI
│   ├── projects.tsx         # Featured project showcase
│   ├── skills.tsx           # Technical skills with animations
│   ├── terminal-adventure-enhanced.tsx # Interactive story game
│   └── typing-*.tsx         # Various typing animations
├── 📁 lib/
│   └── github-data.ts       # GitHub API integration
├── 📁 public/
│   ├── 📁 images/           # Profile photos and assets
│   └── resume-Mohamed-Datt-Full Stack Developer-2025.pdf
├── package.json
├── tailwind.config.ts       # Terminal theme configuration
├── tsconfig.json
└── README.md
\`\`\`

## 🎮 Usage Guide

### **Terminal Adventure Game**
1. **Start the Journey**: Click "Play Terminal Adventure" in the projects section
2. **Make Choices**: Select traits and decisions that shape the story
3. **Unlock Achievements**: Discover real milestones from my journey
4. **Secret Commands**: Try typing `debug`, `sudo`, or `npm install mo`
5. **Multiple Endings**: Different paths lead to different outcomes

### **AI Chatbots**
- **Main Chat**: Click the chat bubble (bottom-right) to talk with Mohamed
- **Ask About Projects**: "Tell me about EduSphere AI" or "What's your best project?"
- **Personal Questions**: "How did you learn English?" or "What's your story?"
- **Technical Details**: "What's your favorite tech stack?"

### **Inspector Mode**
- **Enable**: Click the "Inspect Mode" button (top-left)
- **Explore**: Click any element to see technical implementation details
- **Learn**: Ask the AI about code architecture and design decisions
- **Exit**: Click the X button or toggle off

### **Contact System**
- **Professional**: Sends formatted emails via verified domain
- **Validation**: Real-time form validation with terminal aesthetics
- **Quick Actions**: Direct links to resume, GitHub, and LinkedIn

## 🎨 Customization

### **Terminal Theme Colors**
\`\`\`css
/* Primary colors in globals.css */
:root {
  --primary: #22c55e;      /* Matrix Green */
  --background: #000000;    /* Terminal Black */
  --foreground: #ffffff;    /* Terminal White */
  --accent: #10b981;        /* Success Green */
  --muted: #374151;         /* Terminal Gray */
}
\`\`\`

### **Personal Content Updates**
- **Story Data**: Update `terminal-adventure-enhanced.tsx` with your journey
- **Projects**: Modify `projects.tsx` with your real projects
- **Experience**: Edit `experience.tsx` with your achievements
- **Skills**: Update `skills.tsx` with your tech stack

### **AI Personality**
- **Main Chat**: Update profile data in `app/api/simple-chat/route.ts`
- **Inspector**: Modify technical explanations in `components/inspect-mode-context.tsx`

## 🚀 Deployment

### **Vercel (Recommended)**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. **Important**: Verify your domain in Resend for email functionality
5. Deploy automatically on every push

### **Domain Setup**
1. **Purchase Domain**: Get your custom domain (e.g., yourname.com)
2. **Verify in Resend**: Add domain to Resend dashboard
3. **Update Email**: Change contact form to use your verified domain
4. **DNS Configuration**: Point domain to Vercel

## 🤝 Contributing

While this is a personal portfolio, I welcome suggestions and improvements!

1. **Fork the repository**
2. **Create a feature branch**
   \`\`\`bash
   git checkout -b feature/amazing-feature
   \`\`\`
3. **Commit your changes**
   \`\`\`bash
   git commit -m 'Add some amazing feature'
   \`\`\`
4. **Push to the branch**
   \`\`\`bash
   git push origin feature/amazing-feature
   \`\`\`
5. **Open a Pull Request**

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for speed and user experience
- **Bundle Size**: Minimized with tree shaking and code splitting
- **Images**: Optimized with Next.js Image component
- **Animations**: Hardware-accelerated with Framer Motion

## 🔒 Security

- **Environment Variables**: Secure API key handling
- **Form Validation**: Server-side validation with sanitization
- **Rate Limiting**: API route protection against abuse
- **CORS**: Proper cross-origin resource sharing
- **Domain Verification**: Verified email sending domain

## 📱 Browser Support

- **Chrome**: 90+ ✅
- **Firefox**: 88+ ✅
- **Safari**: 14+ ✅
- **Edge**: 90+ ✅
- **Mobile**: iOS 14+, Android 10+ ✅

## 🐛 Known Issues & Solutions

- ✅ **Email Delivery**: Fixed with verified domain setup
- ✅ **GitHub Rate Limiting**: Handled with proper error boundaries
- ⚠️ **Animation Performance**: Reduced on low-power devices
- ⚠️ **Terminal Fonts**: Fallback fonts for better compatibility

## 🔮 Future Enhancements

- [ ] **Blog Integration**: MDX-powered technical blog
- [ ] **Dark/Light Mode**: Theme switching (currently terminal-only)
- [ ] **Analytics Dashboard**: Visitor tracking and interaction metrics
- [ ] **CMS Integration**: Content management for easier updates
- [ ] **PWA Features**: Offline support and app installation
- [ ] **3D Terminal**: Three.js integration for immersive experience
- [ ] **Voice Commands**: Speech recognition for terminal interaction
- [ ] **Multi-language**: Support for French (Guinea heritage)

## 📊 Analytics & Monitoring

- **Performance**: Web Vitals monitoring with Vercel Analytics
- **Errors**: Error boundary implementation with detailed logging
- **Usage**: Contact form and chatbot interaction tracking
- **AI**: Model performance and response quality monitoring

## 🎯 Learning Resources

This portfolio demonstrates advanced concepts in:

### **Modern React Patterns**
- Server Components and Server Actions
- useActionState for form handling
- Suspense boundaries and error handling
- Custom hooks for complex state management

### **AI Integration**
- Multiple AI model handling with fallbacks
- Streaming responses for better UX
- Context-aware AI assistants
- Real-time data integration with AI

### **Animation Techniques**
- Framer Motion best practices
- Performance-optimized animations
- Interactive hover and click effects
- Scroll-triggered animations

### **Email Systems**
- Professional email handling with React Email
- Domain verification and deliverability
- Template design and responsive layouts
- Server-side form processing

### **TypeScript Advanced Patterns**
- Strict type safety throughout
- Custom type definitions
- Generic components and utilities
- API response type safety

## 🌟 **What Makes This Portfolio Special**

### 🎮 **Interactive Storytelling**
Unlike traditional portfolios, this creates an **emotional connection** through interactive storytelling. Visitors don't just read about my skills - they experience my journey.

### 🤖 **AI-Powered Assistance**
The AI chatbots aren't just gimmicks - they're trained on my real data and can answer detailed questions about my projects, experience, and technical decisions.

### 🎨 **Unique Design Language**
The terminal aesthetic isn't just trendy - it reflects my developer identity and creates a memorable brand experience.

### 📊 **Real Data Integration**
Everything is connected to real APIs and live data - GitHub repos, actual projects, verified contact system.

### 🏆 **Proven Results**
This isn't just a portfolio - it's a demonstration of the same skills that won 1st place in a competitive internship program.

## 📞 Contact & Support

**Mohamed Datt** - 20 years old, Norfolk, Virginia

- 📧 Email: [d.mohamed1504@gmail.com](mailto:d.mohamed1504@gmail.com)
- 🐙 GitHub: [@MeeksonJr](https://github.com/MeeksonJr)
- 💼 LinkedIn: [mohamed-datt-b60907296](https://www.linkedin.com/in/mohamed-datt-b60907296)
- 🌐 Portfolio: [mohameddatt.com](https://mohameddatt.com)
- 📄 Resume: [Download PDF](./public/resume-Mohamed-Datt-Full%20Stack%20Developer-2025.pdf)

### 🎓 **Current Status**
- **Education**: Computer Science student at Old Dominion University
- **Previous**: A.S. Computer Science from Tidewater Community College (2024)
- **Achievement**: 1st place winner in Fall 2024 internship competition
- **Availability**: Open to full-time opportunities and exciting projects

### 🚀 **Looking For**
- Full-time Software Engineer positions
- AI/ML development opportunities
- Startup collaborations
- Mentorship and learning opportunities
- Open source contributions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### **Technology Partners**
- **Vercel Team**: For the incredible AI SDK and deployment platform
- **Framer**: For the powerful Motion library that brings everything to life
- **Tailwind Labs**: For the utility-first CSS framework
- **Resend Team**: For the developer-friendly email service
- **Google**: For Gemini AI that powers the intelligent interactions
- **Groq**: For lightning-fast AI inference

### **Personal Inspiration**
- **Dora the Explorer**: For teaching me English and showing that learning can be fun 📺
- **My Family**: For supporting the journey from Guinea to Norfolk
- **TCC Professors**: For believing in a self-taught developer
- **Internship Team**: For the collaborative spirit that led to our 1st place win
- **Open Source Community**: For the countless libraries and tools that make this possible

### **Special Thanks**
- **Guinea 🇬🇳**: Where the journey began
- **New York City 🗽**: Where I learned to adapt and thrive
- **Norfolk, Virginia 🌊**: Where I'm building my future
- **The Internet**: For being my university when I needed it most

---

<div align="center">

**Built with ❤️ and lots of ☕ by Mohamed Datt**

*From Guinea to Norfolk, Virginia - The journey continues...*

[![GitHub stars](https://img.shields.io/github/stars/MeeksonJr/portfolio-2025?style=social)](https://github.com/MeeksonJr/portfolio-2025)
[![Follow on LinkedIn](https://img.shields.io/badge/Follow-LinkedIn-blue?style=social&logo=linkedin)](https://www.linkedin.com/in/mohamed-datt-b60907296)

**"Learning English from Dora, building the future with AI"** 🚀

</div>
