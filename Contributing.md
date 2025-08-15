# 🤝 Contributing to Med-Genie

<div align="center">

![Contributing](https://img.shields.io/badge/Contributions-Welcome-brightgreen)
![GSSoC'25](https://img.shields.io/badge/GSSoC-2025-orange)
![Beginner Friendly](https://img.shields.io/badge/Beginner-Friendly-blue)

**Welcome to Med-Genie! We're excited that you want to contribute to making healthcare accessible through AI technology.**

*This guide will help you get started, especially if you're new to open source contributions.*

</div>

---

## 📋 Table of Contents

- [🌟 Getting Started](#-getting-started)
- [🛠️ Development Setup](#️-development-setup)
- [🔄 How to Contribute](#-how-to-contribute)
- [📝 Coding Guidelines](#-coding-guidelines)
- [🧪 Testing Guidelines](#-testing-guidelines)
- [📖 Documentation Standards](#-documentation-standards)
- [🏷️ Issue Labels & Types](#️-issue-labels--types)
- [🎯 Good First Issues](#-good-first-issues)
- [💡 Feature Requests & Bug Reports](#-feature-requests--bug-reports)
- [🏆 Recognition & Rewards](#-recognition--rewards)
- [❓ Need Help?](#-need-help)

---

## 🌟 Getting Started

### 🔍 Before You Begin

Med-Genie is part of **GirlScript Summer of Code 2025 (GSSoC'25)** and welcomes contributors of all skill levels. Whether you're a seasoned developer or just starting your open source journey, there's a place for you here!

### ✅ Prerequisites

Before you begin, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm**, **yarn**, or **pnpm** package manager
- **Git** - [Download here](https://git-scm.com/)
- A **GitHub account** - [Sign up here](https://github.com/)
- A code editor (we recommend **VS Code** - [Download here](https://code.visualstudio.com/))
- **Google AI API Key** - For AI functionality testing

### 🛠️ Tech Stack Overview

Med-Genie is built with modern technologies:

| Category | Technologies | Purpose |
|----------|-------------|---------|
| **Frontend** | Next.js 15, React 18, TypeScript | Modern, type-safe web application |
| **Styling** | Tailwind CSS, Radix UI | Beautiful, accessible UI components |
| **AI Integration** | Google AI Genkit, Gemini AI | Intelligent health conversations |
| **Authentication** | JWT, bcrypt, NextAuth patterns | Secure user authentication |
| **Database** | Prisma, SQLite/PostgreSQL | Data management and storage |
| **Form Handling** | React Hook Form, Zod | Form validation and management |
| **Icons & Assets** | Lucide React, Custom SVGs | Consistent iconography |
| **Deployment** | Vercel | Fast, reliable hosting |

---

## 🛠️ Development Setup

### 1️⃣ Fork the Repository

1. Visit the [Med-Genie repository](https://github.com/ashutosh-engineer/med-genie)
2. Click the **"Fork"** button in the top-right corner
3. This creates a copy of the repository in your GitHub account

### 2️⃣ Clone Your Fork

```bash
# Clone your forked repository
git clone https://github.com/YOUR-USERNAME/med-genie.git

# Navigate to the project directory
cd med-genie

# Add the original repository as upstream
git remote add upstream https://github.com/ashutosh-engineer/med-genie.git
```

### 3️⃣ Install Dependencies

```bash
# Install project dependencies
npm install

# or if you prefer yarn
yarn install

# or if you prefer pnpm
pnpm install
```

### 4️⃣ Environment Setup

```bash
# Copy the environment example file
cp env.example .env.local

# Open .env.local and add your configuration
```

**Required Environment Variables:**
```env
# Google AI API Key (Required for AI functionality)
GOOGLE_API_KEY=your_google_ai_api_key_here

# Authentication (Required)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Database (Auto-configured for development)
DATABASE_URL="file:./dev.db"

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:9003
```

**🔑 Getting API Keys:**
- **Google AI API**: Visit [Google AI Studio](https://aistudio.google.com/) to get your API key
- **JWT Secret**: Generate a secure random string (32+ characters)

### 5️⃣ Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create and apply database migrations
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 6️⃣ Start Development Server

```bash
# Start the main development server
npm run dev

# The app will be available at http://localhost:9003
```

### 7️⃣ Start AI Development Server (Optional)

```bash
# In a separate terminal, start the Genkit AI development server
npm run genkit:dev

# This provides AI debugging tools and flow visualization
```

### 🔧 Development Tools

**Recommended VS Code Extensions:**
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Prisma

**Useful Commands:**
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## 🔄 How to Contribute

### 🎯 Step 1: Pick an Issue

1. **Browse Issues**: Check [open issues](https://github.com/ashutosh-engineer/med-genie/issues)
2. **Filter by Labels**: Look for issues labeled:
   - 🟢 `good first issue` - Perfect for beginners
   - 🔵 `beginner-friendly` - Easy to moderate difficulty
   - 🟡 `help wanted` - Community help needed
   - 🟣 `documentation` - Documentation improvements
3. **Express Interest**: Comment on the issue saying you'd like to work on it
4. **Wait for Assignment**: Wait for maintainer approval before starting

### 🌿 Step 2: Create a Branch

```bash
# Make sure you're on the main branch
git checkout main

# Pull the latest changes
git pull upstream main

# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description

# Or for documentation
git checkout -b docs/documentation-improvement
```

**Branch Naming Conventions:**
- `feature/` - New features (e.g., `feature/voice-input`)
- `fix/` - Bug fixes (e.g., `fix/auth-redirect`)
- `docs/` - Documentation (e.g., `docs/api-guide`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-components`)
- `test/` - Adding tests (e.g., `test/chat-functionality`)

### 💻 Step 3: Make Your Changes

1. **Follow Coding Standards**: See [Coding Guidelines](#-coding-guidelines)
2. **Write Clean Code**: Use meaningful variable names and comments
3. **Test Your Changes**: Ensure everything works as expected
4. **Keep Commits Small**: Make focused, atomic commits

### 🧪 Step 4: Test Your Changes

```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint

# Test the application manually
npm run dev

# Test AI functionality (if applicable)
npm run genkit:dev
```

### 📝 Step 5: Commit Your Changes

```bash
# Add your changes
git add .

# Commit with a descriptive message
git commit -m "✨ Add voice input functionality

- Implement speech recognition using Web Speech API
- Add microphone button to chat interface
- Handle voice input errors gracefully
- Update documentation for voice features

Fixes #123"
```

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Commit Types:**
- ✨ `feat` - New features
- 🐛 `fix` - Bug fixes
- 📖 `docs` - Documentation
- 🎨 `style` - Code style changes
- ♻️ `refactor` - Code refactoring
- 🧪 `test` - Adding tests
- 🔧 `chore` - Build/config changes

### 📤 Step 6: Push and Create PR

```bash
# Push your branch to your fork
git push origin your-branch-name

# Go to GitHub and create a Pull Request
# Fill out the PR template completely
```

## 📝 Coding Guidelines

### 🎯 General Principles

1. **Healthcare First**: Always prioritize user safety and accurate information
2. **Accessibility**: Ensure features work for users with disabilities
3. **Privacy**: Never store or log sensitive health information
4. **Performance**: Keep the app fast and responsive
5. **Mobile-First**: Design for mobile devices first

### 💻 TypeScript Best Practices

```typescript
// ✅ Good: Use proper types and interfaces
interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isEmergency?: boolean;
}

// ✅ Good: Use type guards
function isEmergencyMessage(message: string): boolean {
  const emergencyKeywords = ['emergency', 'urgent', 'help', 'chest pain'];
  return emergencyKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
}

// ❌ Avoid: Using 'any' type
const message: any = { ... };

// ✅ Good: Use descriptive variable names
const isLoadingChatResponse = true;
const hasEmergencyKeywords = false;

// ❌ Avoid: Unclear variable names
const loading = true;
const flag = false;
```

### ⚛️ React Component Guidelines

```tsx
// ✅ Good: Functional component with proper props typing
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
  maxLength?: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading,
  placeholder = "Ask about your health...",
  maxLength = 500
}) => {
  // Component logic here
  return (
    <form onSubmit={handleSubmit} className="chat-input-form">
      <textarea
        placeholder={placeholder}
        maxLength={maxLength}
        aria-label="Health question input"
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </form>
  );
};

// ✅ Good: Use custom hooks for logic
const { messages, sendMessage, isLoading } = useChatBot();

// ✅ Good: Proper error handling with user feedback
const handleSubmit = async (data: FormData) => {
  try {
    await sendMessage(data.message);
  } catch (error) {
    console.error('Failed to send message:', error);
    toast.error('Failed to send message. Please try again.');
  }
};
```

### 🎨 CSS/Styling Guidelines

```tsx
// ✅ Good: Use Tailwind classes consistently
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-300">
  Send Message
</button>

// ✅ Good: Use semantic HTML with accessibility
<main className="chat-container" role="main">
  <section className="chat-messages" aria-live="polite" aria-label="Chat conversation">
    <article className="message" role="article">
      <div className="message-content" aria-label="AI response">
        {/* Message content */}
      </div>
    </article>
  </section>
</main>

// ✅ Good: Mobile-first responsive design
<div className="w-full md:w-1/2 lg:w-1/3 p-4 md:p-6">
  {/* Content */}
</div>

// ✅ Good: Dark mode support
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* Content */}
</div>
```

### 📁 File Organization

```
src/
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── chat/                   # Chat-specific components
│   ├── auth/                   # Authentication components
│   └── emergency/              # Emergency-related components
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions and configurations
├── types/                      # TypeScript type definitions
└── app/                        # Next.js app directory
```

### 🔒 Security Guidelines

```typescript
// ✅ Good: Validate and sanitize inputs
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// ✅ Good: Environment variables for sensitive data
const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  throw new Error('GOOGLE_API_KEY is required');
}

// ❌ Avoid: Hardcoded sensitive information
const API_KEY = "hardcoded-api-key"; // Never do this!
```

---

## 🧪 Testing Guidelines

### 🔍 Manual Testing Checklist

Before submitting your PR, ensure you've tested:

#### **Functionality Testing**
- [ ] Feature works as expected on desktop browsers (Chrome, Firefox, Safari)
- [ ] Feature works on mobile devices (iOS Safari, Android Chrome)
- [ ] All user interactions work properly
- [ ] Error handling works correctly
- [ ] Loading states are displayed appropriately

#### **Accessibility Testing**
- [ ] Navigation works with keyboard only
- [ ] Screen reader compatibility (test with NVDA/JAWS/VoiceOver)
- [ ] Color contrast meets WCAG guidelines
- [ ] Focus indicators are visible
- [ ] ARIA labels are present and descriptive

#### **Healthcare-Specific Testing**
- [ ] Medical information is accurate and well-sourced
- [ ] Emergency scenarios are handled appropriately
- [ ] Privacy warnings are displayed when needed
- [ ] No sensitive health data is logged or stored inappropriately

#### **Performance Testing**
- [ ] Page loads quickly (< 3 seconds on slow connections)
- [ ] No console errors or warnings
- [ ] Images and assets are optimized
- [ ] Voice input works smoothly (if applicable)

### 🧪 Unit Testing (Future)

We're planning to add comprehensive testing. You can help by:

```typescript
// Example test structure (coming soon)
describe('ChatInput Component', () => {
  test('should send message when form is submitted', () => {
    // Test implementation
  });

  test('should handle empty input gracefully', () => {
    // Test implementation
  });

  test('should show loading state during submission', () => {
    // Test implementation
  });
});
```

---

## 📖 Documentation Standards

### 📝 Code Documentation

```typescript
/**
 * Sends a health-related question to the AI and returns the response
 * @param question - The user's health question (max 500 characters)
 * @param userId - Optional user ID for personalized responses
 * @returns Promise resolving to AI response and metadata
 * @throws {Error} When API rate limit is exceeded or invalid input
 */
export async function sendHealthQuestion(
  question: string,
  userId?: string
): Promise<HealthResponse> {
  // Implementation here
}
```

### 📋 README Updates

When adding new features, update documentation:

```markdown
## 🆕 New Feature: Voice Input

You can now speak your health questions instead of typing them.

### How to Use:
1. Click the microphone icon 🎤
2. Speak your question clearly
3. The AI will respond to your spoken query

### Browser Support:
- Chrome 25+
- Firefox 44+
- Safari 14.1+
```

---

## 🏷️ Issue Labels & Types

### 🎯 Issue Types

| Label | Description | Difficulty |
|-------|-------------|------------|
| 🟢 `good first issue` | Perfect for new contributors | Beginner |
| 🔵 `beginner-friendly` | Easy to moderate difficulty | Beginner-Intermediate |
| 🟡 `help wanted` | Community help needed | Any Level |
| 🟠 `medium complexity` | Requires some experience | Intermediate |
| 🔴 `advanced` | Complex implementation needed | Advanced |
| 🟣 `documentation` | Documentation improvements | Any Level |
| 🔵 `enhancement` | New feature or improvement | Varies |
| 🔴 `bug` | Something isn't working | Varies |
| 🟢 `question` | Further information is requested | Any Level |

### 📋 Component Labels

- `frontend` - Frontend/UI related
- `backend` - Backend/API related
- `ai` - AI/ML functionality
- `auth` - Authentication system
- `mobile` - Mobile-specific issues
- `accessibility` - Accessibility improvements
- `performance` - Performance optimizations
- `security` - Security enhancements

---

## 🎯 Good First Issues

### 🌟 Recommended Starting Points

#### **Documentation (Easiest)**
- Fix typos in README or contributing guide
- Add code comments to existing functions
- Create user guides for new features
- Improve installation instructions

#### **UI/UX Improvements (Easy)**
- Improve button hover states
- Add loading animations
- Enhance mobile responsiveness
- Fix spacing/alignment issues

#### **Feature Enhancements (Medium)**
- Add keyboard shortcuts
- Implement dark mode improvements
- Create new UI components
- Add form validation

#### **Healthcare Features (Medium-Advanced)**
- Add medical condition information
- Improve emergency response flows
- Enhance accessibility features
- Implement health tips features

---

## 💡 Feature Requests & Bug Reports

### 🐛 Reporting Bugs

Use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md):

1. **Clear Title**: Describe the bug in one sentence
2. **Steps to Reproduce**: Numbered list of exact steps
3. **Expected vs Actual**: What should happen vs what happens
4. **Environment**: Browser, OS, device details
5. **Screenshots**: Visual evidence when applicable

### ✨ Requesting Features

Use our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md):

1. **Problem Statement**: What problem does this solve?
2. **Proposed Solution**: How should it work?
3. **Healthcare Impact**: How does this improve healthcare access?
4. **Alternative Solutions**: Other ways to solve this problem
5. **Additional Context**: Any other relevant information

---

## 🏆 Recognition & Rewards

### 🥇 Contributor Levels

| Level | Requirements | Benefits |
|-------|-------------|----------|
| 🥉 **Bronze** | 1-5 merged PRs | GitHub badge, mention in README |
| 🥈 **Silver** | 6-15 merged PRs | Featured contributor section |
| 🥇 **Gold** | 16+ merged PRs | Core contributor role |
| 💎 **Diamond** | Core maintainer | Repository admin rights |

### 🎁 Special Recognition

- 🌟 **Featured on README**: Top contributors showcase
- 🏅 **GSSoC'25 Certificates**: Official program completion certificates
- 💼 **LinkedIn Recommendations**: For significant contributions
- 🎯 **Special Badges**: Unique GitHub profile badges
- 📧 **Direct Maintainer Contact**: For collaboration opportunities

### 📊 Contribution Tracking

We track contributions through:
- **GitHub Insights**: Automatic contribution tracking
- **Contributor Graph**: Visual representation of contributions
- **Hall of Fame**: Monthly recognition posts
- **Impact Metrics**: Healthcare accessibility improvements

---

## ❓ Need Help?

### 🤝 Getting Support

#### **For Technical Issues:**
- 💬 **GitHub Discussions**: [General Q&A and help](https://github.com/ashutosh-engineer/med-genie/discussions)
- 📧 **GitHub Issues**: [Specific bugs or features](https://github.com/ashutosh-engineer/med-genie/issues)
- 📖 **Documentation**: Check README and authentication guide

#### **For Community Support:**
- 📱 **Discord**: Real-time community chat (Coming Soon)
- 📢 **Twitter**: Follow [@MedGenieAI](https://twitter.com/MedGenieAI) for updates
- 📝 **Blog**: Technical posts and tutorials (Coming Soon)

#### **For Healthcare Questions:**
> **Important**: This project provides technical support only. For medical questions, always consult qualified healthcare professionals.

### 📚 Learning Resources

#### **New to Open Source?**
- [First Contributions](https://firstcontributions.github.io/)
- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)

#### **Learning Our Tech Stack:**
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)

#### **Healthcare Technology:**
- [Healthcare IT Standards](https://www.healthit.gov/topic/standards-technology)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Privacy in Healthcare Apps](https://www.hhs.gov/hipaa/for-professionals/privacy/index.html)

---

<div align="center">

## 🙏 Thank You!

**Your contributions help make healthcare more accessible to everyone.**

*Whether you're fixing a typo, adding a feature, or improving documentation, every contribution matters in our mission to democratize healthcare information through technology.*

**Ready to contribute?** 
[Browse open issues](https://github.com/ashutosh-engineer/med-genie/issues) • [Join our community](https://github.com/ashutosh-engineer/med-genie/discussions) • [Read our Code of Conduct](./CODE_OF_CONDUCT.md)

---

**© 2025 Med-Genie Contributors • Part of GirlScript Summer of Code 2025**

![Open Source](https://img.shields.io/badge/Open%20Source-❤️-red?style=flat-square)
![Healthcare](https://img.shields.io/badge/For-Healthcare-blue?style=flat-square)
![Community](https://img.shields.io/badge/Community-Driven-green?style=flat-square)

</div>
src/
├── ai/                 # AI-related configurations and flows
├── app/                # Next.js app router pages
├── components/         # Reusable UI components
│   ├── ui/            # Basic UI components (buttons, inputs, etc.)
│   ├── chat/          # Chat-specific components
│   └── layout/        # Layout components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and configurations
└── types/             # TypeScript type definitions
```

## 🧪 Testing

### Running Tests

```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint

# Fix linting issues automatically
npm run lint --fix
```

### Manual Testing Checklist

Before submitting a PR, please test:

- [ ] Chat functionality works correctly
- [ ] UI is responsive on different screen sizes
- [ ] No console errors or warnings
- [ ] Accessibility features work (keyboard navigation, screen readers)
- [ ] Performance is not degraded

## 📖 Documentation

### Adding Documentation

- Update README.md if you add new features
- Add inline comments for complex logic
- Update this CONTRIBUTING.md if you change the development process
- Add JSDoc comments for new functions/components

```typescript
/**
 * Processes user input and generates AI response
 * @param message - The user's message
 * @param context - Previous conversation context
 * @returns Promise<string> - AI generated response
 */
async function generateAIResponse(
  message: string, 
  context: ChatMessage[]
): Promise<string> {
  // Implementation
}
```

## 💡 Feature Requests & Bug Reports

### Reporting Bugs

When reporting bugs, please include:

1. **Steps to reproduce** the issue
2. **Expected behavior** vs **actual behavior**
3. **Screenshots** or **screen recordings** if applicable
4. **Browser/device information**
5. **Console errors** (if any)

### Requesting Features

For feature requests:

1. **Describe the problem** you're trying to solve
2. **Explain your proposed solution**
3. **Consider alternative solutions**
4. **Explain why this feature would be useful** to Med-Genie users

## 🚀 Good First Issues

Perfect for beginners:

- 🎨 **UI Improvements**: Update styles, add animations, improve responsive design
- 📱 **Accessibility**: Add ARIA labels, improve keyboard navigation
- 🐛 **Bug Fixes**: Fix small issues, improve error handling
- 📚 **Documentation**: Improve README, add code comments, create tutorials
- 🧹 **Code Cleanup**: Refactor components, remove unused code
- 🌐 **Internationalization**: Add support for multiple languages

## 📞 Communication

### Where to Get Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussions
- **Discord/Slack**: [Add your community links]

### Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md)

## 🎉 Recognition

Contributors will be:

- Added to our [Contributors list](https://github.com/your-repo/med-genie/graphs/contributors)
- Mentioned in release notes
- Eligible for GSSoC'25 points and recognition
- Invited to our contributor community

## ❓ Need Help?

Don't hesitate to ask for help! We're here to support you:

1. **Check existing issues** and documentation first
2. **Search previous discussions** for similar questions
3. **Create a new issue** with the `question` label
4. **Tag maintainers** if you need urgent help

### Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)

---

## 🙏 Thank You!

Thank you for contributing to Med-Genie! Your contributions help make healthcare assistance more accessible to everyone. Every contribution, no matter how small, makes a difference.

**Happy coding! 🚀**

---

*This project is part of [GirlScript Summer of Code 2025](https://gssoc.girlscript.tech/). Let's build something amazing together!*
