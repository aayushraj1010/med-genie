# 🤝 Contributing to Med-Genie

Welcome to Med-Genie! We're excited that you want to contribute to this AI-powered medical chatbot project. This guide will help you get started, no matter your experience level.

---

## 📋 Table of Contents

* [Getting Started](#getting-started)
* [Development Setup](#development-setup)
* [How to Contribute](#how-to-contribute)
* [Coding & Style Guidelines](#coding--style-guidelines)
* [Testing](#testing)
* [Documentation](#documentation)
* [Feature Requests & Bug Reports](#feature-requests--bug-reports)
* [Community & Help](#community--help)
* [Recognition](#recognition)

---

## Getting Started

### Prerequisites

Make sure you have:

* [Node.js](https://nodejs.org/) (v18 or higher)
* npm or yarn
* [Git](https://git-scm.com/)
* [VS Code](https://code.visualstudio.com/) or any modern editor
* [GitHub account](https://github.com/)

### Tech Stack

* **Frontend:** Next.js 15, React 18, TypeScript
* **UI:** Tailwind CSS, Radix UI
* **AI:** Genkit with Google AI (Gemini)
* **Deployment:** Vercel

---

## Development Setup

1. **Fork the repository**: Click "Fork" on [med-genie GitHub](https://github.com/aayushraj1010/med-genie).
2. **Clone your fork**:

   ```bash
   git clone https://github.com/YOUR-USERNAME/med-genie.git
   cd med-genie
   ```
3. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   ```
4. **Configure environment variables**:

   ```bash
   cp env.example .env.local
   ```

   Add your required API keys (see README for details).
5. **Run the development server**:

   ```bash
   npm run dev
   ```

   Visit [http://localhost:9002](http://localhost:9002) to view the app.
6. **(Optional) Start Genkit Dev Server**:

   ```bash
   npm run genkit:dev
   ```

---

## How to Contribute

1. **Find an issue**:

   * Browse [issues](https://github.com/aayushraj1010/med-genie/issues)
   * Look for `good first issue` or `documentation` tags
   * Comment to request assignment

2. **Create a branch**:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/your-feature
   # or
   git checkout -b fix/bug-description
   ```

3. **Make your changes**:

   * Keep code readable and modular
   * Follow our coding guidelines
   * Add tests and update docs if needed

4. **Commit your changes**:

   ```bash
   git add .
   git commit -m "feat: add health tips section"
   ```

   **Commit types**:

   * `feat:` new feature
   * `fix:` bug fix
   * `docs:` docs only
   * `style:` formatting only
   * `refactor:` code restructure
   * `test:` adding/changing tests
   * `chore:` tooling/devops updates

5. **Push and create a pull request**:

   ```bash
   git push origin feat/your-feature
   ```

   Then, open a PR from your GitHub fork and add a clear description. Reference issues if relevant.

---

## Coding & Style Guidelines

* **TypeScript**: Always use strict types, avoid `any`
* **React**: Functional components with hooks preferred
* **Styling**: Tailwind CSS + semantic HTML
* **Folder Structure**: Organize by component/hook/type
* Add **JSDoc** for functions or components that aren’t self-explanatory

Example:

```ts
/**
 * Get AI medical response for user input
 * @param message - User's question/input
 * @returns ChatBotResponse (from AI)
 */
export async function getAIResponse(message: string): Promise<ChatBotResponse> {
  // ...
}
```

---

## Testing

* Type check and lint:

  ```bash
  npm run typecheck
  npm run lint
  npm run lint --fix
  ```
* Manual QA checklist:

  * [ ] All chat & UI features work
  * [ ] App is responsive
  * [ ] No console errors
  * [ ] Keyboard-accessible & screen-reader-friendly

---

## Documentation

* Update `README.md` or code comments when changing logic, setup, or structure
* Add screenshots/gifs for UI updates
* Document workflow/infrastructure updates in `.github/` if needed

---

## Feature Requests & Bug Reports

### Bug Reports

Include:

* Steps to reproduce
* What you expected vs. what happened
* Screenshots/console errors
* Browser/device info

### Feature Suggestions

Include:

* What problem it solves
* How it improves the user/dev experience
* Any design or code examples

---

## Community & Help

* Use **GitHub Issues** for bugs/features
* Check **Discussions** (if enabled)
* Follow our [Code of Conduct](CODE_OF_CONDUCT.md)
* Ask, share, and build together respectfully 🤝

---

## Recognition

* All contributors appear in GitHub insights
* You may be featured in release notes
* GSSoC contributors will be credited in final reports
* Your efforts make open-source healthcare more powerful 💙

---

**Happy contributing!**
*Med-Genie is part of [GirlScript Summer of Code 2025](https://gssoc.girlscript.tech/) — let’s build something meaningful together!*

---



