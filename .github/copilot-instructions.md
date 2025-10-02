# GitHub Copilot Instructions

## Architecture Overview

**Deez Notes** is a Next.js 15 App Router application with Supabase authentication, Prisma ORM + PostgreSQL, and OpenAI integration. The app auto-redirects authenticated users to their newest note via middleware and creates notes if none exist.

### Key Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Radix UI
- **Backend**: Next.js API routes, Server Actions, Prisma ORM
- **Database**: PostgreSQL with simple User/Note relationship
- **Auth**: Supabase with server-side rendering patterns
- **AI**: OpenAI API for note summarization
- **Testing**: Cypress (e2e), Playwright (e2e), k6 (performance)

## Critical Patterns

### Database & Server Actions
- **Prisma schema**: Located in `src/db/schema.prisma`, custom client output to `src/db/client/`
- **Server Actions**: Use `'use server'` directive, always call `getUser()` for auth checks
- **Error handling**: Use `handleError()` from `src/lib/utils.ts` for consistent error responses
- **Database access**: Import from `@/db/prisma`, not direct Prisma client

### Authentication Flow
- **Middleware**: `src/middleware.ts` handles Supabase SSR and auto-redirects to newest note
- **Server auth**: Use `getUser()` from `src/auth/server.ts` (returns null if unauthenticated)
- **Client creation**: Always use `createClient()` helper, never instantiate Supabase directly
- **Protected routes**: Authentication logic is in middleware, not individual pages

### Component Patterns
- **UI Components**: Radix UI in `src/components/ui/` with Tailwind variants
- **State**: Use React Context (`NoteProvider`) for note text state
- **Styling**: Use `cn()` utility from `src/lib/utils.ts` for className merging
- **Data attributes**: All interactive elements have `data-testid` attributes for E2E tests

### OpenAI Integration
- **Client**: Import from `@/openai` (configured in `src/openai/index.ts`)
- **Server Actions**: Use `askAIAboutNotesAction()` in `src/actions/notes.ts` with conversational context
- **Response Format**: AI responses must be valid HTML for `dangerouslySetInnerHTML` rendering
- **Styling**: AI response HTML styled via `src/styles/ai-responses.css` with `.bot-response` prefix
- **Model**: Uses `gpt-4o-mini` with system prompt that formats all user notes for context
- **Conversation**: Maintains question/response history in component state for context continuity

## Development Workflows

### Local Development
```bash
npm run dev          # Start with Turbopack
npm run migrate      # Generate Prisma client + run migrations (reads .env.local)
npm run build        # Generate Prisma client + build app
```

### Testing
```bash
npm run e2e          # Run both Cypress and Playwright sequentially
npm run cypress      # Headless Cypress tests (requires app running on :3000)
npm run playwright   # Playwright tests (configurable base URL)
```

### Performance Testing (k6)
```bash
export $(grep -E '^(LOAD_TEST_USERID|LOCAL_HOST)=' .env.local | xargs)
k6 cloud run --local-execution -e LOAD_TEST_USERID=$LOAD_TEST_USERID -e BASE_URL=$LOCAL_HOST k6/loadtests/<test>.js
```

## File Organization

### API Routes
- **Pattern**: Query params for simple inputs, JSON body for complex data
- **Location**: `src/app/api/*/route.ts`
- **Example**: `/api/create-new-note?userId=123` (POST)

### Testing Structure
- **Playwright**: `playwright/tests/` with custom test extension in `test.extend.ts`
- **Cypress**: `cypress/e2e/` with page objects in `cypress/pages/`
- **k6**: `k6/loadtests/` for performance tests, `k6/` for other test types

### Environment Setup
- **Local**: `.env.local` (never committed)
- **Required vars**: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `OPENAI_API_KEY`
- **Test vars**: `LOAD_TEST_USERID`, `LOCAL_HOST` for k6 performance tests

## Project-Specific Conventions

1. **Note auto-creation**: Middleware automatically creates a note for new users and redirects to it
2. **Prisma client**: Always regenerate client before builds (`npx prisma generate` in build script)
3. **Test data attributes**: All testable elements use `data-testid` following kebab-case naming
4. **Server Actions**: Always include try/catch with `handleError()` utility
5. **Turbopack**: Default dev server uses `--turbopack` flag for faster development
6. **Deployment**: Vercel with automatic main branch deployment, environment variables managed in dashboard