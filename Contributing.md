# 🤝 Contributing to Med-Genie

Welcome to Med-Genie! We're excited that you want to contribute to this AI-powered medical chatbot project. This guide will help you get started, especially if you're new to open source contributions.

## 📋 Table of Contents

- [🌟 Getting Started](#-getting-started)
- [🛠️ Development Setup](#️-development-setup)
- [🔄 How to Contribute](#-how-to-contribute)
- [📝 Coding Guidelines](#-coding-guidelines)
- [🧪 Testing](#-testing)
- [📖 Documentation](#-documentation)
- [💡 Feature Requests & Bug Reports](#-feature-requests--bug-reports)
- [❓ Need Help?](#-need-help)

## 🌟 Getting Started

### Prerequisites

Before you begin, make sure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** - [Download here](https://git-scm.com/)
- A **GitHub account** - [Sign up here](https://github.com/)
- A code editor (we recommend **VS Code** - [Download here](https://code.visualstudio.com/))

### Tech Stack

Med-Genie is built with:

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **AI**: Google AI Genkit
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **Deployment**: Vercel

## 🛠️ Development Setup

### 1. Fork the Repository

1. Visit the [Med-Genie repository](https://github.com/aayushraj1010/med-genie)
2. Click the **"Fork"** button in the top-right corner
3. This creates a copy of the repository in your GitHub account

### 2. Clone Your Fork

```bash
# Clone your forked repository
git clone https://github.com/YOUR-USERNAME/med-genie.git

# Navigate to the project directory
cd med-genie

# Add the original repository as upstream
git remote add upstream https://github.com/original-repo/med-genie.git
```

### 3. Install Dependencies

```bash
# Install project dependencies
npm install

# or if you prefer yarn
yarn install
```

### 4. Environment Setup

```bash
# Copy the environment example file
cp env.example .env.local

# Open .env.local and add your API keys
# You'll need a Google AI API key - get it from https://aistudio.google.com/
```

### 5. Start Development Server

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:9002
```

### 6. Start AI Development Server (Optional)

```bash
# In a separate terminal, start the Genkit AI development server
npm run genkit:dev

# This provides AI debugging tools and flow visualization
```

## 🔄 How to Contribute

### Step 1: Pick an Issue

1. Browse [open issues](https://github.com/aayushraj1010/med-genie/issues)
2. Look for issues labeled `good first issue` or `beginner-friendly`
3. Comment on the issue saying you'd like to work on it
4. Wait for maintainer approval before starting

### Step 2: Create a Branch

```bash
# Make sure you're on the main branch
git checkout main

# Pull the latest changes
git pull upstream main

# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

### Step 3: Make Your Changes

- Write clean, readable code
- Follow our coding guidelines (see below)
- Test your changes thoroughly
- Add comments where necessary

### Step 4: Commit Your Changes

```bash
# Add your changes
git add .

# Commit with a clear message
git commit -m "feat: add new symptom checker feature"

# Or for bug fixes
git commit -m "fix: resolve chat input validation issue"
```

**Commit Message Format:**
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for code style changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### Step 5: Push and Create Pull Request

```bash
# Push your branch to your fork
git push origin feature/your-feature-name
```

1. Go to your fork on GitHub
2. Click **"Compare & pull request"**
3. Fill out the PR template with:
   - Clear description of changes
   - Link to related issue
   - Screenshots (if UI changes)
   - Testing notes

## 📝 Coding Guidelines

### TypeScript Best Practices

```typescript
// ✅ Good: Use proper types
interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// ❌ Avoid: Using 'any' type
const message: any = { ... };

// ✅ Good: Use descriptive variable names
const isLoadingChatResponse = true;

// ❌ Avoid: Unclear variable names
const loading = true;
```

### React Component Guidelines

```tsx
// ✅ Good: Functional component with proper props typing
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading 
}) => {
  // Component logic here
};

// ✅ Good: Use custom hooks for logic
const { messages, sendMessage, isLoading } = useChatBot();

// ✅ Good: Proper error handling
const handleSubmit = async (data: FormData) => {
  try {
    await sendMessage(data.message);
  } catch (error) {
    console.error('Failed to send message:', error);
    // Show user-friendly error message
  }
};
```

### CSS/Styling Guidelines

```tsx
// ✅ Good: Use Tailwind classes consistently
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
  Send Message
</button>

// ✅ Good: Use semantic HTML
<main className="chat-container">
  <section className="chat-messages">
    <article className="message">
      {/* Message content */}
    </article>
  </section>
</main>

// ✅ Good: Mobile-first responsive design
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Content */}
</div>
```

### File Organization

```
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