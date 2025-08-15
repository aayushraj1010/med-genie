<div align="center">

# 🩺 MED GENIE
### *Your Intelligent AI Health Companion - Making Healthcare Accessible to Everyone*

![GSSoC'25](https://img.shields.io/badge/GSSoC-2025-orange)
![Open Source](https://img.shields.io/badge/Open--Source-Yes-brightgreen)
![Live](https://img.shields.io/badge/Live-Website-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen)
![Authentication](https://img.shields.io/badge/Auth-JWT-green)
![Database](https://img.shields.io/badge/DB-SQLite%2FPostgreSQL-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![AI Powered](https://img.shields.io/badge/AI-Powered-purple)

**A revolutionary AI-powered health companion that makes medical guidance accessible through natural conversations**

🚀 **[Try Med-Genie Live](https://med-genie-five.vercel.app/)** | 📖 **[Documentation](#-getting-started)** | 🤝 **[Contributing](./Contributing.md)** | 🔐 **[Authentication Guide](./AUTHENTICATION.md)**

![Med-Genie Avatar](./public/images/med-genie-avatar.png)

---

## 📚 Table of Contents

- [🎯 What is Med-Genie?](#-what-is-med-genie)
- [✨ Key Features](#-key-features)
- [🎬 Demo & Screenshots](#-demo--screenshots)
- [🏗️ Architecture & Tech Stack](#️-architecture--tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📖 Usage Guide](#-usage-guide)
- [🛠️ Development Setup](#️-development-setup)
- [🔐 Authentication System](#-authentication-system)
- [🛣️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

---

## 🎯 What is Med-Genie?

**Med-Genie** is an intelligent AI health assistant designed to democratize access to medical information and emergency guidance. Built as part of **GirlScript Summer of Code 2025 (GSSoC'25)**, this open-source project bridges the gap between patients and healthcare information through conversational AI.

### 🌟 Why Med-Genie?

- **🔍 Instant Access**: Get immediate health guidance without waiting for appointments
- **💬 Natural Conversations**: Chat in plain language - no medical jargon required
- **🔐 Privacy-First**: Your health data stays secure with JWT authentication and encryption
- **🚨 Emergency Ready**: Quick access to hospital information and emergency contacts
- **⏰ Always Available**: 24/7 health companion that's always ready to help
- **🎤 Voice-Enabled**: Speak your queries with built-in voice recognition

### 🎯 Our Mission

To make basic healthcare guidance accessible to everyone, everywhere, while maintaining the highest standards of privacy and security, and encouraging professional medical consultation when needed.

> **⚠️ Important Medical Disclaimer**: Med-Genie provides general health information and guidance. It is not a replacement for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical concerns.

---

## ✨ Key Features

<div align="center">

### 🤖 **Conversational AI Engine**
Chat naturally with our AI trained on health-related queries. No complex medical terminology required - just ask in plain language!

### 🚨 **Emergency Assistance**
Instant access to nearby hospitals, emergency contacts, and first-aid guidance when every second counts.

### 🩺 **Intelligent Symptom Checker**
Describe your symptoms and receive AI-powered condition suggestions with actionable health insights.

### 🎤 **Voice Input Support**
Speak to Med-Genie using built-in speech recognition for hands-free, accessible interaction.

### 🌓 **Adaptive Interface**
Seamless dark/light mode switching for comfortable use in any environment, day or night.

### 🔒 **Privacy-First Design**
Secure JWT authentication with encrypted data transmission. Your health conversations remain protected.

</div>

### 🔐 **Secure Authentication System**
- **JWT-based authentication** with secure token management
- **Password hashing** using bcrypt for maximum security
- **Smart login flow** with intelligent signup suggestions
- **Session management** with automatic token refresh
- **Protected routes** ensuring secure access to health data
- **API route protection** with middleware-based security

### 👤 **Personalized User Experience**
- **Individual user accounts** with secure registration
- **Personalized health profiles** for better recommendations
- **Chat history preservation** across sessions
- **Seamless authentication flow** between login and signup pages
- **Context-aware messaging** based on user journey

### 🛡️ **Security & Privacy**
- **End-to-end encryption** for sensitive health data
- **HIPAA-compliant** data handling practices
- **Secure password policies** with validation
- **Automatic session cleanup** on logout
- **Protected API endpoints** with authentication middleware

### 🎯 **Current Capabilities**

| Feature | Description | Status |
|---------|-------------|--------|
| **💬 Natural Language Chat** | Conversational AI for health queries | ✅ Live |
| **🏥 Emergency Services** | Hospital finder & emergency guidance | ✅ Live |
| **📋 Symptom Analysis** | AI-powered symptom assessment | ✅ Live |
| **🎤 Voice Interface** | Speech-to-text health queries | ✅ Live |
| **📱 Responsive Design** | Mobile-first, accessible UI | ✅ Live |
| **🔐 User Authentication** | Secure login/signup system | ✅ Live |
| **🛡️ Privacy Protection** | JWT-based secure sessions | ✅ Live |

---

## 🎬 Demo & Screenshots

<div align="center">

### 🏠 **Welcome Interface**
*Clean, intuitive design that welcomes users to start their health journey*

![Welcome Screen](./assets/demo1.png)

### 💬 **Interactive Chat Experience**
*Natural conversation flow with instant AI responses and helpful suggestions*

![Chat Interface](./assets/demo2.png)

### 🎯 **Try It Live**

Experience Med-Genie in action: **[med-genie-five.vercel.app](https://med-genie-five.vercel.app/)**

**Sample Interactions:**
- *"I have a headache and feel nauseous. What could this be?"*
- *"Find hospitals near me"*
- *"What should I do for a minor burn?"*
- *"I'm feeling anxious about my heart rate"*

</div>

---

## 🏗️ Architecture & Tech Stack

<div align="center">

### **Frontend Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js 15    │    │   TypeScript    │    │  Tailwind CSS   │
│   React 18      │ ←→ │   Type Safety   │ ←→ │   Styling       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **AI & Backend Integration**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Genkit AI     │    │  Google Gemini  │    │    Prisma       │
│   Framework     │ ←→ │   AI Model      │ ←→ │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

</div>

### 🛠️ **Technology Stack**

| Category | Technologies | Purpose |
|----------|-------------|---------|
| **Frontend** | Next.js 15, React 18, TypeScript | Modern, type-safe web application |
| **UI/UX** | Tailwind CSS, Radix UI, Framer Motion | Beautiful, accessible, animated interface |
| **AI Integration** | Genkit, Google Gemini AI | Intelligent health conversation engine |
| **Authentication** | JWT, bcrypt, NextAuth-like patterns | Secure user authentication system |
| **Database** | Prisma, SQLite/PostgreSQL | Data management and user profiles |
| **Deployment** | Vercel | Fast, reliable hosting platform |
| **Development** | ESLint, TypeScript, PostCSS | Code quality and development tools |
| **Speech** | Web Speech API | Voice input functionality |

### 🔄 **System Flow**

1. **User Authentication** → Secure login/signup with JWT tokens
2. **User Input** → Voice or text health query processing
3. **AI Processing** → Genkit processes with Gemini AI
4. **Context Analysis** → User history & symptoms consideration
5. **Response Generation** → Personalized health guidance
6. **Emergency Detection** → Hospital/emergency service routing
7. **Data Protection** → Encrypted storage and transmission

---

## 🚀 Quick Start

### 🎯 **For Users**

1. **Visit**: Go to [med-genie-five.vercel.app](https://med-genie-five.vercel.app/)
2. **Sign Up**: Create your secure account with email/password
3. **Start Chatting**: Type or speak your health question
4. **Get Guidance**: Receive instant AI-powered health insights
5. **Stay Safe**: Follow up with healthcare professionals when needed

### 👨‍💻 **For Developers**

#### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **Git** for version control
- **Google AI API Key** for AI functionality

#### Installation

```bash
# Clone the repository
git clone https://github.com/ashutosh-engineer/med-genie.git
cd med-genie

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Add your API keys (Google AI, JWT secret, etc.)

# Initialize database
npx prisma generate
npx prisma db push

# Run the development server
npm run dev
```

#### Development Scripts

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run typecheck

# Lint code
npm run lint

# Start Genkit AI development
npm run genkit:dev

# Database management
npx prisma studio
npx prisma db push
```

#### Environment Variables

Create a `.env.local` file with:

```env
# Google AI (Gemini) API Key (Required)
GOOGLE_API_KEY=your_google_ai_api_key

# Authentication (Required)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Database URL (SQLite by default)
DATABASE_URL="file:./dev.db"

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:9003
```

---

## 📖 Usage Guide

### 🗣️ **How to Chat with Med-Genie**

#### **Getting Started**
1. **Create Account**: Sign up with a secure email and password
2. **Verify Login**: Access your personalized dashboard
3. **Start Conversation**: Begin chatting with our AI health assistant

#### **Text Input**
- Type your health question naturally: *"I have a sore throat, what should I do?"*
- Ask about symptoms: *"What causes persistent headaches?"*
- Request emergency help: *"Find hospitals near me"*
- Inquire about medications: *"What are the side effects of ibuprofen?"*

#### **Voice Input**
- Click the microphone icon 🎤
- Speak clearly in your preferred language
- Med-Genie will transcribe and respond instantly
- Perfect for hands-free accessibility

#### **Emergency Situations**
- Use keywords like "emergency", "hospital", "urgent"
- Med-Genie will prioritize emergency guidance
- **Always call emergency services (911, etc.) for life-threatening situations**

### 🏥 **Feature Examples**

<details>
<summary><strong>💬 Health Consultation</strong></summary>

**User**: *"I've been feeling tired and having trouble sleeping for the past week"*

**Med-Genie**: *"I understand you're experiencing fatigue and sleep difficulties. Several factors could contribute to this. Here are some general suggestions:

**Possible Causes:**
- Stress and anxiety
- Poor sleep hygiene
- Lifestyle factors (diet, exercise)
- Underlying health conditions

**General Recommendations:**
1. **Sleep Hygiene**: Maintain consistent sleep/wake times
2. **Environment**: Dark, cool, quiet bedroom
3. **Lifestyle**: Regular exercise, limit caffeine after 2 PM
4. **Stress Management**: Relaxation techniques, meditation

**When to Seek Medical Attention:**
- Symptoms persist longer than 2 weeks
- Severe daytime fatigue affecting daily activities
- Additional symptoms like chest pain or difficulty breathing

Would you like more specific guidance on any of these areas?"*

</details>

<details>
<summary><strong>🚨 Emergency Assistance</strong></summary>

**User**: *"Find hospitals near me - I think I might have broken my wrist"*

**Med-Genie**: *"I'll help you find nearby hospitals immediately. For a potential broken wrist, you should seek medical attention promptly.

**🏥 Nearby Emergency Facilities:**

**General Hospital Emergency Room**
📍 123 Main St, Your City
📞 (555) 123-4567
🕐 24/7 Emergency Services

**Urgent Care Center**
📍 456 Health Ave, Your City  
📞 (555) 987-6543
🕐 Open until 10 PM

**Immediate Care Instructions:**
1. Don't move the wrist
2. Apply ice wrapped in cloth
3. Support with a makeshift sling
4. Take over-the-counter pain medication if needed

🚨 **For severe pain, visible deformity, or numbness, call 911 immediately.**"*

</details>

### 🔒 **Privacy & Security**

- **🔐 Secure Authentication**: JWT-based login with encrypted passwords
- **💾 Protected Data**: Your health conversations are encrypted and secure
- **🔄 Session Management**: Automatic logout and session cleanup
- **🛡️ HIPAA Compliance**: Following healthcare data protection standards
- **📱 Device Security**: Secure token storage and transmission

---

## �️ Development Setup

### 📋 **Prerequisites**
- **Node.js** 18+ and npm
- **Git** for version control
- **Text editor** (VS Code recommended)
- **Google AI API Key** for AI functionality

### 🚀 **Quick Start**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ashutosh-engineer/med-genie.git
   cd med-genie
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   ```bash
   # Copy environment template
   cp env.example .env.local
   
   # Edit .env.local file with your configuration:
   # - GOOGLE_API_KEY (required for AI features)
   # - JWT_SECRET (required for authentication)
   # - DATABASE_URL (SQLite by default)
   ```

4. **Database setup:**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Create and migrate database
   npx prisma db push
   
   # (Optional) View database in Prisma Studio
   npx prisma studio
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Access the application:**
   - Main app: `http://localhost:9003`
   - AI development: `npm run genkit:dev`

### 🔐 **Authentication Setup**

The application includes a comprehensive authentication system:

- **User Registration**: Create accounts with email/password
- **Secure Login**: JWT-based authentication with bcrypt hashing
- **Protected Routes**: Homepage and health features require authentication
- **Session Management**: Persistent login across browser sessions
- **Password Security**: bcrypt hashing with 10 salt rounds

**Required Environment Variables:**
```env
# Authentication (Required)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Database (Auto-configured for development)
DATABASE_URL="file:./dev.db"

# AI Features (Required for chat functionality)
GOOGLE_API_KEY=your_google_ai_api_key_here
```

### 📁 **Project Structure**

```
med-genie/
├── 📁 src/
│   ├── 📁 ai/                    # AI integration & flows
│   │   ├── genkit.ts            # Genkit AI setup
│   │   ├── dev.ts               # Development AI server
│   │   └── flows/               # Health Q&A flows
│   │       ├── health-question-answering.ts
│   │       └── personalized-health-question-answering.ts
│   ├── 📁 app/                  # Next.js app directory
│   │   ├── page.tsx            # Main landing page
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── globals.css         # Global styles
│   │   ├── homepage/           # Protected chat interface
│   │   ├── login/              # Authentication pages
│   │   ├── sign-up/            # User registration
│   │   ├── health-vault/       # Health records
│   │   └── api/                # API routes
│   │       ├── auth/           # Authentication endpoints
│   │       │   ├── login/      # Login API
│   │       │   ├── register/   # Registration API
│   │       │   └── logout/     # Logout API
│   │       ├── user/           # User profile endpoints
│   │       └── nearby-hospitals/ # Hospital finder API
│   ├── 📁 components/          # React components
│   │   ├── ui/                 # Reusable UI components (Radix UI)
│   │   ├── landing_page/       # Landing page sections
│   │   ├── ProtectedRoute.tsx  # Route protection wrapper
│   │   ├── UserMenu.tsx        # User authentication menu
│   │   ├── chat-input-form.tsx # Chat interface
│   │   ├── VoiceSearch.tsx     # Voice input component
│   │   └── theme-toggle.tsx    # Dark/light mode toggle
│   ├── 📁 contexts/            # React contexts
│   │   └── AuthContext.tsx     # Authentication state management
│   ├── 📁 hooks/               # Custom React hooks
│   │   ├── use-chat-history.ts # Chat history management
│   │   ├── use-mobile.tsx      # Mobile detection
│   │   ├── use-theme.tsx       # Theme management
│   │   └── use-toast.ts        # Toast notifications
│   ├── 📁 lib/                 # Utilities & configuration
│   │   ├── jwt.ts             # JWT token utilities
│   │   ├── auth-middleware.ts  # API protection middleware
│   │   ├── api-client.ts      # HTTP client with auth
│   │   ├── prompts.ts         # AI prompt templates
│   │   ├── types.ts           # TypeScript type definitions
│   │   └── utils.ts           # General utilities
│   └── 📁 validation/          # Input validation schemas
│       └── userRegister.ts     # User registration validation
├── 📁 public/                  # Static assets
│   ├── 📁 images/             # Application images
│   │   ├── med-genie-avatar.png
│   │   ├── med-genie-avatar.svg
│   │   └── robot-doctor.svg
│   ├── 📁 data/               # Static data files
│   │   └── health-tips.json   # Health tips database
│   ├── favicon.ico            # Site favicon
│   ├── manifest.json          # PWA manifest
│   └── robots.txt             # SEO robots file
├── 📁 prisma/                  # Database schema & migrations
│   ├── schema.prisma          # Database models
│   ├── prisma.ts              # Database connection
│   └── migrations/            # Database migration files
├── � assets/                  # Demo screenshots
│   ├── demo1.png              # Welcome interface
│   └── demo2.png              # Chat interface
└── 📄 Configuration files
    ├── package.json           # Dependencies & scripts
    ├── tsconfig.json          # TypeScript configuration
    ├── tailwind.config.ts     # Tailwind CSS config
    ├── next.config.ts         # Next.js configuration
    └── components.json        # UI components config
```

### 🧪 **Testing & Quality Assurance**

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Database operations
npx prisma studio          # View/edit database
npx prisma db push         # Apply schema changes
npx prisma generate        # Regenerate Prisma client

# Development workflow
npm run dev                # Development server
npm run genkit:dev         # AI development environment
npm run build              # Production build
npm start                  # Production server
```

**Manual Testing Checklist:**
- ✅ User registration and email validation
- ✅ Login/logout flow and JWT token handling
- ✅ Protected route access and redirects
- ✅ Chat functionality with AI responses
- ✅ Voice input/output functionality
- ✅ Hospital finder and emergency features
- ✅ Responsive design across devices
- ✅ Dark/light mode switching
- ✅ Session persistence and security

### 📊 **API Endpoints**

#### Authentication Endpoints
- `POST /api/auth/register` - User registration with validation
- `POST /api/auth/login` - User authentication and JWT generation
- `POST /api/auth/logout` - Session cleanup and token invalidation
- `POST /api/auth/check-email` - Email availability verification

#### Protected Endpoints (Requires Authentication)
- `GET /api/user/profile` - Retrieve user profile information
- `PUT /api/user/profile` - Update user profile and preferences
- `GET /api/user/chat-history` - Retrieve user's chat history
- `POST /api/user/save-chat` - Save chat conversation

#### Public Endpoints
- `GET /api/nearby-hospitals` - Find nearby medical facilities
- `GET /api/health-tips` - Retrieve health tips and information

---

## 🛣️ Roadmap

### 🚀 **Upcoming Features**

| Feature | Description | Timeline | Priority | Status |
|---------|-------------|----------|----------|--------|
| 🔐 **Advanced Auth Features** | 2FA, OAuth providers, password reset | Q1 2025 | High | 🟡 In Progress |
| 📱 **Mobile App** | Native iOS/Android applications | Q2 2025 | High | 📅 Planned |
| 🧠 **Enhanced AI Diagnosis** | Advanced ML-driven health predictions | Q2 2025 | High | 📅 Planned |
| 📍 **Smart Location Services** | Improved hospital/clinic/pharmacy finder | Q1 2025 | High | 🟡 In Progress |
| 🗂️ **Enhanced Health Profiles** | Medical history, allergies, medications tracking | Q2 2025 | Medium | 📅 Planned |
| 👨‍⚕️ **Specialist AI Avatars** | Cardiology, Pediatrics, etc. specialized responses | Q3 2025 | Medium | 📅 Planned |
| 🌐 **Multi-language Support** | Hindi, Bengali, Tamil, Spanish, French | Q2 2025 | High | 🔴 Not Started |
| ⏰ **Health Reminders** | Medication, appointment, wellness alerts | Q3 2025 | Medium | 📅 Planned |
| � **Health Analytics** | Personal health insights and trends | Q3 2025 | Low | 📅 Planned |
| 🔄 **Offline Mode** | Basic functionality without internet | Q4 2025 | Low | 📅 Planned |

### 📈 **Performance Goals**

<div align="center">

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| ⚡ **Response Time** | < 3s | < 2s | Q1 2025 |
| 🎯 **AI Accuracy** | 85% | > 90% | Q2 2025 |
| 📱 **Mobile Performance** | 4s load | < 3s load | Q1 2025 |
| ♿ **Accessibility** | WCAG 2.0 | WCAG 2.1 AA | Q2 2025 |
| 🔐 **Security Score** | Good | Excellent | Q1 2025 |
| 🚀 **API Performance** | < 800ms | < 500ms | Q1 2025 |
| � **User Satisfaction** | 4.2/5 | > 4.5/5 | Q2 2025 |

</div>

### 🎯 **Development Milestones**

#### **Phase 1: Foundation (Q1 2025)** ✅ Completed
- ✅ Basic AI chat functionality
- ✅ User authentication system
- ✅ Responsive web design
- ✅ Voice input integration
- ✅ Hospital finder feature

#### **Phase 2: Enhancement (Q1-Q2 2025)** 🟡 In Progress
- 🟡 Advanced authentication features
- 📅 Performance optimizations
- 📅 Enhanced AI accuracy
- 📅 Improved mobile experience
- 📅 Accessibility improvements

#### **Phase 3: Expansion (Q2-Q3 2025)** 📅 Planned
- 📅 Mobile app development
- 📅 Multi-language support
- 📅 Specialist AI modules
- 📅 Health profile management
- � Analytics dashboard

#### **Phase 4: Advanced Features (Q3-Q4 2025)** 📅 Future
- 📅 Offline capabilities
- 📅 Advanced health tracking
- 📅 Integration with wearables
- 📅 Telemedicine features
- 📅 Community features

---

## 🔐 Authentication System

Med-Genie features a comprehensive authentication system built with modern security practices and user experience in mind.

### ✅ **Implemented Features**
- **🔐 JWT Authentication** with secure token management and refresh
- **🔒 Password Security** using bcrypt with 10 salt rounds
- **🔄 Smart Login Flow** with intelligent signup suggestions
- **🛡️ Protected Routes** ensuring secure access to health data
- **⏱️ Session Management** with automatic cleanup and timeout
- **🔗 API Route Protection** with middleware-based security
- **🎨 Context-Aware UI** that adapts to authentication state
- **📧 Email Validation** with comprehensive input sanitization

### 🔧 **Technical Implementation**

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend State** | React Context + Hooks | Authentication state management |
| **Backend Auth** | Next.js API Routes + Middleware | Secure authentication endpoints |
| **Database** | Prisma ORM + SQLite/PostgreSQL | User data and session storage |
| **Security** | bcrypt + JWT + HTTPS | Password hashing and token security |
| **Validation** | Zod + Custom Schemas | Input validation and sanitization |

### 🛡️ **Security Features**

- **🔐 Secure Password Policies**: Minimum length, complexity requirements
- **🕐 Token Expiration**: Configurable JWT expiration times
- **🔄 Automatic Logout**: Session cleanup on security events
- **🛡️ CSRF Protection**: Cross-site request forgery prevention
- **🔒 HTTP-only Patterns**: Secure cookie handling
- **📊 Rate Limiting**: API endpoint protection against abuse

### 📖 **Documentation**
For detailed authentication implementation and API documentation, see [AUTHENTICATION.md](./AUTHENTICATION.md)

---

## 🤝 Contributing

We welcome contributions from developers, healthcare professionals, and anyone passionate about improving healthcare accessibility! Med-Genie is part of **GirlScript Summer of Code 2025 (GSSoC'25)** and thrives on community collaboration.

### 🌟 **Ways to Contribute**

<div align="center">

| Contribution Type | Description | How to Start |
|------------------|-------------|--------------|
| 🐛 **Bug Reports** | Found an issue? Help us fix it! | [Report Bug](https://github.com/ashutosh-engineer/med-genie/issues/new?template=bug_report.md) |
| 💡 **Feature Requests** | Have an idea? Share it with us! | [Request Feature](https://github.com/ashutosh-engineer/med-genie/issues/new?template=feature_request.md) |
| 🛠️ **Code Contributions** | Write code, fix bugs, add features | [Contributing Guide](./Contributing.md) |
| 📖 **Documentation** | Improve our docs and guides | [Documentation Issues](https://github.com/ashutosh-engineer/med-genie/labels/documentation) |
| 🎨 **Design & UX** | UI/UX improvements and accessibility | [Design Issues](https://github.com/ashutosh-engineer/med-genie/labels/design) |
| 🧪 **Testing** | Write tests, find edge cases | [Testing Guide](./Contributing.md#testing) |
| 🌐 **Translation** | Help make Med-Genie multilingual | [Translation Guide](./Contributing.md#translation) |

</div>

### 🚀 **Quick Contribution Steps**

1. **🍴 Fork** the repository to your GitHub account
2. **📥 Clone** your fork locally: `git clone https://github.com/your-username/med-genie.git`
3. **🌿 Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **🔧 Make** your changes and test thoroughly
5. **💾 Commit** your changes: `git commit -m 'Add amazing feature'`
6. **📤 Push** to your branch: `git push origin feature/amazing-feature`
7. **🔄 Open** a Pull Request with a clear description

### 📋 **Contribution Guidelines**

#### **Before Contributing:**
- 📖 Read our [Code of Conduct](./CODE_OF_CONDUCT.md)
- 🔍 Check existing issues to avoid duplicates
- 💬 Join our discussions for major changes
- 🧪 Test your changes locally

#### **Code Standards:**
- ✅ Follow TypeScript best practices
- 🎨 Use Prettier for code formatting
- 🔍 Run ESLint for code quality
- 📝 Add JSDoc comments for new functions
- 🧪 Include tests for new features
- 📱 Ensure mobile responsiveness

#### **Pull Request Requirements:**
- 📋 Clear description of changes
- 🔗 Reference related issues
- ✅ All checks passing (lint, type-check, build)
- 📸 Screenshots for UI changes
- 🧪 Test instructions included

### 🏆 **Recognition & Rewards**

#### **Contributor Levels:**
- 🥉 **Bronze**: 1-5 merged PRs
- 🥈 **Silver**: 6-15 merged PRs  
- 🥇 **Gold**: 16+ merged PRs
- 💎 **Diamond**: Core maintainer status

#### **Special Recognition:**
- 🌟 **Featured on README**: Top contributors
- 🏅 **GSSoC'25 Certificates**: Program completion
- 💼 **LinkedIn Recommendations**: For significant contributions
- 🎯 **Special Badges**: Unique GitHub profile badges

### 👥 **Our Community**

#### **Current Maintainers:**
- **[@ashutosh-engineer](https://github.com/ashutosh-engineer)** - Project Lead & Architecture
- **[Your Name Here]** - Join our core team!

#### **Top Contributors:**
<!-- CONTRIBUTORS-START -->
We appreciate all our contributors! 🙏

<a href="https://github.com/ashutosh-engineer/med-genie/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ashutosh-engineer/med-genie" alt="Contributors" />
</a>
<!-- CONTRIBUTORS-END -->

#### **Communication Channels:**
- 💬 **GitHub Discussions**: General discussions and Q&A
- 📧 **Issues**: Bug reports and feature requests
- 📱 **Discord**: Real-time community chat (Coming Soon)
- 📢 **Twitter**: Updates and announcements [@MedGenieAI](https://twitter.com/MedGenieAI)

### 🎯 **Good First Issues**

New to open source? Start with these beginner-friendly issues:

- 🏷️ [`good first issue`](https://github.com/ashutosh-engineer/med-genie/labels/good%20first%20issue)
- 🏷️ [`documentation`](https://github.com/ashutosh-engineer/med-genie/labels/documentation)
- 🏷️ [`help wanted`](https://github.com/ashutosh-engineer/med-genie/labels/help%20wanted)

### 📚 **Development Resources**

- 📖 **[Contributing Guide](./Contributing.md)** - Detailed contribution instructions
- 🔐 **[Authentication Docs](./AUTHENTICATION.md)** - Authentication system details
- 📋 **[Code of Conduct](./CODE_OF_CONDUCT.md)** - Community guidelines
- 🏗️ **[Architecture Guide](./docs/ARCHITECTURE.md)** - System architecture overview

---

## 📄 License

<div align="center">

**Med-Genie is open source software licensed under the [MIT License](./License.md)**

</div>

```
MIT License

Copyright (c) 2025 Med-Genie Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 📋 **License Summary**
- ✅ **Commercial Use**: Use Med-Genie in commercial projects
- ✅ **Modification**: Modify the source code to fit your needs
- ✅ **Distribution**: Distribute original or modified versions
- ✅ **Patent Use**: Use any patents contributed by contributors
- ❗ **Liability**: No warranty or liability from maintainers
- ❗ **Trademark**: Med-Genie trademarks are not included

---

## 🙏 Acknowledgments

<div align="center">

### **Made possible by our amazing community and supporters**

</div>

### 🏆 **Special Thanks**

#### **🌟 GirlScript Summer of Code 2025**
![GSSoC'25](https://img.shields.io/badge/GSSoC-2025-orange)

Med-Genie is proudly part of [GirlScript Summer of Code 2025](https://gssoc.girlscript.tech/), empowering students and developers to contribute to meaningful open-source projects in healthcare technology.

#### **🤖 AI & Technology Partners**
- **Google AI (Gemini)** - Powering our intelligent health conversations
- **Vercel** - Providing exceptional hosting and deployment platform
- **Prisma** - Enabling type-safe database management
- **Radix UI** - Beautiful, accessible UI components

#### **🌍 Open Source Community**
- **React & Next.js Teams** - For the incredible framework ecosystem
- **TypeScript Team** - For making JavaScript development safer and more productive
- **Tailwind CSS** - For the utility-first CSS framework
- **All Contributors** - For making Med-Genie better every day

### 💡 **Inspiration & Mission**

Med-Genie was born from the vision of making healthcare information accessible to everyone, everywhere. We believe that:

- 🌍 **Healthcare is a human right** that should be accessible globally
- 🤝 **Technology can bridge gaps** between patients and medical knowledge
- 🔓 **Open source drives innovation** in healthcare technology
- 🛡️ **Privacy and security** are fundamental to health applications
- 👥 **Community collaboration** creates better solutions for everyone

### 🎯 **Impact Goals**

Our mission extends beyond code - we're working toward:

- 📈 **100,000+ users** helped with health guidance by 2026
- 🌐 **10+ languages** supported for global accessibility
- 🏥 **1,000+ hospitals** integrated into our finder network
- 🎓 **500+ developers** trained in healthcare technology
- 📚 **Open source blueprint** for future health applications

---

<div align="center">

## 🌟 **Support Med-Genie**

### **Help us make healthcare accessible to everyone**

[![Star on GitHub](https://img.shields.io/github/stars/ashutosh-engineer/med-genie?style=social)](https://github.com/ashutosh-engineer/med-genie)
[![Follow on Twitter](https://img.shields.io/twitter/follow/MedGenieAI?style=social)](https://twitter.com/MedGenieAI)
[![Join Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da?style=social&logo=discord)](https://discord.gg/medgenie)

### **Quick Links**

🚀 **[Try Med-Genie Live](https://med-genie-five.vercel.app/)** • 
⭐ **[Star on GitHub](https://github.com/ashutosh-engineer/med-genie)** • 
🐛 **[Report Issues](https://github.com/ashutosh-engineer/med-genie/issues)** • 
💡 **[Request Features](https://github.com/ashutosh-engineer/med-genie/issues/new?template=feature_request.md)** • 
📖 **[Read Docs](./Contributing.md)**

---

### **🤝 Built with ❤️ by the Med-Genie Community**

*Empowering healthcare through open-source innovation*

**© 2025 Med-Genie Contributors • Part of GirlScript Summer of Code 2025**

![Open Source](https://img.shields.io/badge/Open%20Source-❤️-red?style=flat-square)
![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=flat-square)
![Healthcare](https://img.shields.io/badge/For-Healthcare-blue?style=flat-square)

</div>-welcome-blue)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.2.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![AI Powered](https://img.shields.io/badge/AI-Powered-purple)

**A revolutionary AI-powered health companion that makes medical guidance accessible through natural conversations**

🚀 **[Try Med-Genie Live](https://med-genie-five.vercel.app/)** | 📖 **[Documentation](#-getting-started)** | 🤝 **[Contributing](./Contributing.md)**

</div>

---

## � Table of Contents

- [🎯 What is Med-Genie?](#-what-is-med-genie)
- [✨ Key Features](#-key-features)
- [🎬 Demo & Screenshots](#-demo--screenshots)
- [🏗️ Architecture & Tech Stack](#️-architecture--tech-stack)
- [🚀 Quick Start](#-quick-start)
- [� Usage Guide](#-usage-guide)
- [� Development Setup](#-development-setup)
- [🛣️ Roadmap](#️-roadmap)
- [🤝 Contributing](#-contributing)
- [� License](#-license)

---

## 🎯 What is Med-Genie?

**Med-Genie** is an intelligent AI health assistant designed to democratize access to medical information and emergency guidance. Built as part of **GirlScript Summer of Code 2025 (GSSoC'25)**, this open-source project bridges the gap between patients and healthcare information through conversational AI.

### 🌟 Why Med-Genie?

- **Instant Access**: Get immediate health guidance without waiting for appointments
- **Natural Conversations**: Chat in plain language - no medical jargon required
- **Privacy-First**: Your health data stays private - we don't store or track anything
- **Emergency Ready**: Quick access to hospital information and emergency contacts
- **Always Available**: 24/7 health companion that's always ready to help

### 🎯 Our Mission

To make basic healthcare guidance accessible to everyone, everywhere, while maintaining the highest standards of privacy and encouraging professional medical consultation when needed.

> **Important**: Med-Genie provides general health information and guidance. It is not a replacement for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical concerns.

---

## ✨ Key Features

<div align="center">

### 🤖 **Conversational AI Engine**
Chat naturally with our AI trained on health-related queries. No complex medical terminology required - just ask in plain language!

### � **Emergency Assistance**
Instant access to nearby hospitals, emergency contacts, and first-aid guidance when every second counts.

### 🩺 **Intelligent Symptom Checker**
Describe your symptoms and receive AI-powered condition suggestions with actionable health insights.

### 🎤 **Voice Input Support**
Speak to Med-Genie using built-in speech recognition for hands-free, accessible interaction.

### 🌓 **Adaptive Interface**
Seamless dark/light mode switching for comfortable use in any environment, day or night.

### 🔒 **Privacy-First Design**
Zero data storage, zero tracking. Your health conversations remain completely private and secure.

</div>

### 🎯 **Current Capabilities**

| Feature | Description | Status |
|---------|-------------|--------|
| **💬 Natural Language Chat** | Conversational AI for health queries | ✅ Live |
| **🏥 Emergency Services** | Hospital finder & emergency guidance | ✅ Live |
| **📋 Symptom Analysis** | AI-powered symptom assessment | ✅ Live |
| **� Voice Interface** | Speech-to-text health queries | ✅ Live |
| **📱 Responsive Design** | Mobile-first, accessible UI | ✅ Live |
| **� PWA Support** | Installable web app | ✅ Live |
| **� Privacy Protection** | No data collection/storage | ✅ Live |  
---

## 🎬 Demo & Screenshots

<div align="center">

### 🏠 **Welcome Interface**
*Clean, intuitive design that welcomes users to start their health journey*

![Welcome Screen](./assets/demo1.png)

### � **Interactive Chat Experience**
*Natural conversation flow with instant AI responses and helpful suggestions*

![Chat Interface](./assets/demo2.png)

</div>

### 🌐 **Try It Live**

Experience Med-Genie in action: **[med-genie-five.vercel.app](https://med-genie-five.vercel.app/)**

**Sample Interactions:**
- *"I have a headache and feel nauseous. What could this be?"*
- *"Find hospitals near me"*
- *"What should I do for a minor burn?"*
- *"I'm feeling anxious about my heart rate"*

---

## 🏗️ Architecture & Tech Stack

<div align="center">

### **Frontend Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js 15    │    │   TypeScript    │    │  Tailwind CSS   │
│   React 18      │ ←→ │   Type Safety   │ ←→ │   Styling       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **AI & Backend Integration**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Genkit AI     │    │  Google Gemini  │    │    Prisma       │
│   Framework     │ ←→ │   AI Model      │ ←→ │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

</div>

### 🛠️ **Technology Stack**

| Category | Technologies | Purpose |
|----------|-------------|---------|
| **Frontend** | Next.js 15, React 18, TypeScript | Modern, type-safe web application |
| **UI/UX** | Tailwind CSS, Radix UI, Framer Motion | Beautiful, accessible, animated interface |
| **AI Integration** | Genkit, Google Gemini AI | Intelligent health conversation engine |
| **Database** | Prisma, PostgreSQL | Data management and storage |
| **Deployment** | Vercel | Fast, reliable hosting platform |
| **Development** | ESLint, TypeScript, PostCSS | Code quality and development tools |
| **Speech** | Web Speech API | Voice input functionality |

### 🔄 **System Flow**

1. **User Input** → Voice or text health query
2. **AI Processing** → Genkit processes with Gemini AI
3. **Context Analysis** → Medical history & symptoms consideration
4. **Response Generation** → Personalized health guidance
5. **Emergency Detection** → Hospital/emergency service routing
6. **Privacy Protection** → No data storage or tracking

---

## 🚀 Quick Start

### 🎯 **For Users**

1. **Visit**: Go to [med-genie-five.vercel.app](https://med-genie-five.vercel.app/)
2. **Start Chatting**: Type or speak your health question
3. **Get Guidance**: Receive instant AI-powered health insights
4. **Stay Safe**: Follow up with healthcare professionals when needed

### 👨‍💻 **For Developers**

#### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **Git** for version control

#### Installation

```bash
# Clone the repository
git clone https://github.com/ashutosh-engineer/med-genie.git
cd med-genie

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Add your API keys (Google AI, etc.)

# Run the development server
npm run dev
```

#### Development Scripts

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run typecheck

# Lint code
npm run lint

# Start Genkit AI development
npm run genkit:dev
```

#### Environment Variables

Create a `.env.local` file with:

```env
# Google AI (Gemini) API Key
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Database URL (if using database features)
DATABASE_URL=your_database_url

# Other optional configurations
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## � Usage Guide

### 🗣️ **How to Chat with Med-Genie**

#### **Text Input**
- Type your health question naturally: *"I have a sore throat, what should I do?"*
- Ask about symptoms: *"What causes headaches?"*
- Request emergency help: *"Find hospitals near me"*

#### **Voice Input**
- Click the microphone icon 🎤
- Speak clearly in your preferred language
- Med-Genie will transcribe and respond

#### **Emergency Situations**
- Use keywords like "emergency", "hospital", "urgent"
- Med-Genie will prioritize emergency guidance
- Always call emergency services (911, etc.) for life-threatening situations

### 🏥 **Feature Examples**

<details>
<summary><strong>💬 Health Consultation</strong></summary>

**User**: *"I've been feeling tired and having trouble sleeping"*

**Med-Genie**: *"I understand you're experiencing fatigue and sleep difficulties. Several factors could contribute to this, such as stress, lifestyle changes, or underlying health conditions. Here are some general suggestions:

1. **Sleep Hygiene**: Try maintaining a consistent sleep schedule
2. **Lifestyle**: Consider your diet, exercise, and stress levels
3. **Medical Evaluation**: If symptoms persist, consult a healthcare provider

Would you like to share more details about when these symptoms started or any other related concerns?"*

</details>

<details>
<summary><strong>🚨 Emergency Assistance</strong></summary>

**User**: *"Find hospitals near me"*

**Med-Genie**: *"I'll help you find nearby hospitals. Here are some medical facilities in your area:

🏥 **General Hospital**
📍 123 Main St, Your City
📞 (555) 123-4567

🏥 **Emergency Medical Center**
📍 456 Health Ave, Your City
📞 (555) 987-6543

For life-threatening emergencies, please call 911 immediately."*

</details>

### 🔒 **Privacy & Safety**

- **No Data Storage**: Your conversations are not saved or tracked
- **Local Processing**: Voice recognition happens on your device
- **Secure Communication**: All data transmission is encrypted
- **Medical Disclaimer**: Always shown with health advice

📝 License
Released under the MIT License.
You’re free to use, modify, and distribute this software with proper attribution.

© 2025 Med Genie — Built with ❤️ by Aayush Raj and contributors.








