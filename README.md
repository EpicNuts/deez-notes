# Deez Notes

_Deez Notes_ is a demonstration web application built with [Next.js](https://nextjs.org), designed as a portfolio project to showcase my skills in **end-to-end testing** (Cypress & Playwright), **CI/CD automation**, and modern web application development.

> **Note:** This project is a work in progress and serves as a living example of my technical abilities.

---

## 🚀 Purpose

- **Portfolio:** This repository is primarily a showcase of my ability to build a modern web app a bit more complex than just "Hello World", test the heck out of it, and integrate those tests into a deployment pipeline, CI/CD style.
- **Testing:** I want comprehensive E2E testing using both [Cypress](https://www.cypress.io/) and [Playwright](https://playwright.dev/). I'll also be using Grafana k6 to dip into performance testing. 
- **CI/CD:** Includes examples of automated testing and deployment pipelines.
- **Web Development:** Built with Next.js, TypeScript, Prisma, and Tailwind CSS.

---

## 🛠️ Features

**[Deez-Notes!](https://deez-notes-omega.vercel.app/)** A note-taking web-app that harnesses **ChatGPT** to generate note-summaries and interact with your notes in new and exciting ways.
- Deployed with **Vercel**
- Authenticated by **Supabase** 
- Tested with **Cypress** and **Playwright** (Postman/Neumann coming soon!)
- CI/CD workflows with **[GitHub Actions](https://github.com/EpicNuts/deez-notes/actions)**
- Modular, modern codebase (**TypeScript**, **Next.js** App Router)
- Responsive UI using **Tailwind CSS**
- Example API endpoints and database integration (**Prisma/Postgres**)

***Under active development — new features and improvements coming soon!***

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

`npm run build`      Generates the Prisma Client and builds the Application
`npm run migrate`    Ensures your Prisma Client is up to date and your local database schema matches your code, using the environment variables from [.env.local](/.env.local).|
`npm run lint`       Executes Next.js’s built-in ESLint integration to check for styling issues.
`npm run dev`        Start the development server, which utilizes [Turbopack](https://turbo.build/pack) for a faster refresh and hot reloading.
`npm run start`      Start the production server
`npm run playwright` Run Playwright tests
`npm run cypress`    Run Cypress tests in headless mode
`npm run e2e`        Run Cypress and Playwright tests sequentially

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

