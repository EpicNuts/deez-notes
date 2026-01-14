# Deez Notes

_Deez Notes_ is a sophisticated demonstration web application built with [Next.js](https://nextjs.org), designed as a comprehensive portfolio project showcasing advanced skills in **full-stack development**, **comprehensive testing strategies**, **AI integration**, and **modern DevOps practices**.

> **Note:** This project serves as a living showcase of production-ready development practices, from architecture design to deployment automation.

---

## 🚀 Purpose

- **Technical Showcase:** Demonstrates enterprise-level full-stack development with sophisticated architecture patterns, including middleware-driven authentication flows, server-side rendering with Supabase, and custom Prisma client configurations.
- **Testing Excellence:** Features a comprehensive multi-layered testing strategy combining **End-to-End** ([Cypress](https://www.cypress.io/) & [Playwright](https://playwright.dev/)), **Performance** (Grafana k6 cloud testing), and **CI/CD automation** - showcasing industry best practices for quality assurance.
- **AI Integration:** Implements a sophisticated conversational AI system using OpenAI's GPT-4o-mini with context-aware note analysis, HTML-formatted responses, and conversation memory - demonstrating modern AI application patterns.
- **Modern Stack Mastery:** Built with cutting-edge technologies including Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, and Prisma ORM, showcasing proficiency with the latest web development standards.

---

## 🛠️ Features & Technical Showcase

**[Deez-Notes!](https://deez-notes-omega.vercel.app/)** - A sophisticated note-taking application demonstrating enterprise-level architecture and AI integration.

### 🧠 **Intelligent AI Integration**
- **Conversational AI**: Context-aware ChatGPT integration with conversation memory and note analysis
- **Dynamic HTML Rendering**: AI responses formatted as valid HTML with custom styling pipeline
- **Smart Context**: Automatically includes all user notes in AI conversations for comprehensive assistance

### 🏗️ **Advanced Architecture**
- **Auto-redirect Middleware**: Sophisticated authentication flow that automatically creates and redirects users to their newest note
- **Server-Side Rendering**: Full SSR implementation with Supabase authentication and custom client patterns
- **Custom Database Setup**: Prisma ORM with custom client output location and migration workflows
- **Type-Safe Development**: End-to-end TypeScript with strict configurations and modern React patterns

### 🧪 **Comprehensive Testing Strategy**
- **Multi-Framework E2E**: Both **Cypress** and **Playwright** for cross-browser validation and different testing approaches
- **Performance Testing**: **Grafana k6** cloud-based load testing with environment-specific configurations
- **Test-Driven Design**: All interactive elements include `data-testid` attributes for reliable test automation
- **CI/CD Integration**: Automated testing pipeline with **[GitHub Actions](https://github.com/EpicNuts/deez-notes/actions)** preventing deployment of failing builds

### 🚀 **Production-Ready Infrastructure**
- **Vercel Deployment**: Automatic deployments with environment variable management
- **Database Management**: PostgreSQL with Prisma migrations and custom client generation
- **Authentication**: Supabase SSR with secure cookie handling and protected routes
- **Modern Tooling**: Turbopack dev server, Tailwind CSS 4, and optimized build processes

***This project demonstrates production-ready development practices from conception to deployment.***

---

## 🚀 Deployment Overview

This project uses **Vercel** for production hosting and supports easy local development and deployment.

---

### 🏠 Local Development & Deployment

To run the app locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/EpicNuts/deez-notes.git
   cd deez-notes
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create `.env.local` and copy the contents of `.env.example`. Fill in required values (e.g., database connection, Supabase keys, OpenAI api keys etc.).
   - Ensure `.env.local` is **not** committed to git.

4. **Run database migrations and generate Prisma client:**
   ```bash
   npm run migrate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at **[http://localhost:3000](http://localhost:3000)**.

---

### 🌍 Production Deployment

- **Platform:** [Vercel](https://vercel.com/)
- **Production URL:** [https://deez-notes-omega.vercel.app/](https://deez-notes-omega.vercel.app/)
- **Branch:** The main branch is automatically deployed to production.
- **CI/CD:** GitHub Actions run automated tests (Cypress, Playwright, linting, build) on every pull request. Only successful builds are deployed.

#### **How Production Deployments Work**
- Pushes to the `main` branch trigger a Vercel deployment.
- Vercel builds the app, runs migrations, and hosts the latest version.
- Environment variables for production are managed via the Vercel dashboard (never committed to git).

---

### 🧑‍💻 Useful Scripts

- `npm run build`       Generates the Prisma Client and builds the Application
- `npm run migrate`    Ensures your Prisma Client is up to date and your local database schema matches your code, using the environment variables from [.env.local](/.env.local).
- `npm run lint`       Executes Next.js’s built-in ESLint integration to check for styling issues.
- `npm run dev`        Start the development server, which utilizes [Turbopack](https://turbo.build/pack) for a faster refresh and hot reloading.
- `npm run start`      Start the production server
- `npm run playwright` Run Playwright tests
- `npm run cypress`    Run Cypress tests in headless mode
- `npm run e2e`        Run Cypress and Playwright tests sequentially
- `npm run setup-test-user`   create a new test user in Supabase.

---

### 📝 Notes

- **Environment variables:** Store secrets and config in `.env.local` for local development and in Vercel’s dashboard for production.
- **Database:** Uses Prisma ORM with Postgres. Ensure your database is running and accessible for local development.
- **Authentication:** Uses Supabase; set up your Supabase project and keys as needed.

---

## 🧪 Testing

This repo has a number of different test types targeting both a local development environment, and a fully deployed instance on Vercel. 

### UAT, Feature, E2E

#### Cypress

```bash
npm run cypress
```

#### Playwright

```bash
npm run playwright
```

#### E2E
Launch the Cypress and Playwright tests sequentially
```bash
npm run e2e
```

### Performance testing with K6 (Cloud)

First, export the relevant variables from your `.env.local` file:

```bash
export $(grep -E '^(LOAD_TEST_USERID|LOCAL_HOST)=' .env.local | xargs)
```

Then, run your k6 test (replace `<load-test>.js` with your test file):

```bash
k6 cloud run --local-execution -e LOAD_TEST_USERID=$LOAD_TEST_USERID -e BASE_URL=$LOCAL_HOST k6/loadtests/<load-test>.js
```

- `LOAD_TEST_USERID` is your test user’s ID.
- `BASE_URL` targets the local dev deployment at localhost:3000.
- This runs the k6 tests against the locally deployed app, and reports the results both directly to stdout, and to grafana cloud. When ready to test a deployed app on Vercel or elsewhere, switch out the **BASE_URL** variable for the production (or staging) url of the deployed app under test.

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel documentation](https://vercel.com/docs) 
- [Cypress Documentation](https://docs.cypress.io/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Grafana K6 Documentation](https://grafana.com/docs/k6/latest/testing-guides/api-load-testing/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## 👋 About

This project is a living portfolio. Feedback, suggestions, and contributions are welcome!

---

