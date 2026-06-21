# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See @README for project overview and @package.json for available npm commands for this project

## Project Overview

QuizApp is a full-stack quiz management application consisting of:

- **Backend**: ASP.NET Core 8 Web API (`/` root, C# project)
- **Frontend**: React SPA (`quiz-client/`)

## Commands

### Backend (ASP.NET Core)

```bash
# Run the API
dotnet run

# Apply EF Core migrations
dotnet ef database update

# Add a new migration
dotnet ef migrations add <MigrationName>
```

### Frontend (React)

```bash
cd quiz-client

# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Architecture

### Backend Structure

- **`Program.cs`** — registers services: EF Core (SQL Server), JWT auth, CORS (allows `localhost:3000`), Swagger with Bearer auth, and all repositories via DI.
- **`DAL/AppDbContext.cs`** — EF Core context with cascade delete rules. `QuizAttempt→User` uses `Restrict` (not `Cascade`) to avoid circular delete paths. `UserAnswer` similarly restricts deletes on `Question` and `Answer` FKs.
- **`DAL/Interfaces/`** + **`DAL/Repositories/`** — repository pattern: `IQuizRepository`, `IQuizAttemptRepository`, `IUserRepository` with their concrete implementations.
- **`Controllers/AccountController.cs`** — `POST /api/account/register` and `POST /api/account/login`. Returns a JWT token + userId + username. Passwords are hashed with SHA-256 (no salt). JWT expires in 7 days.
- **`Controllers/QuizController.cs`** — all endpoints require `[Authorize]`. User identity is extracted from JWT claims (`ClaimTypes.NameIdentifier`). Quizzes are scoped to the authenticated user.
- **`DTOs/`** — separate DTOs for auth (`LoginDto`, `RegisterDto`) and quiz operations (`CreateQuizDto`, `QuizDto`, `SubmitQuizDto`, etc.). Controllers never return raw EF entities.

### Data Model

```
User → Quiz (one-to-many, cascade delete)
Quiz → Question (one-to-many, cascade delete)
Question → Answer (one-to-many, cascade delete)
User → QuizAttempt (one-to-many, restrict delete)
Quiz → QuizAttempt (one-to-many, cascade delete)
QuizAttempt → UserAnswer (one-to-many, cascade delete)
UserAnswer → Question/Answer (restrict delete)
```

### Frontend Structure

- **`src/api/authService.js`** — handles register/login/logout. Stores JWT token and user object in `localStorage`. Provides `getAuthHeader()` for all authenticated requests.
- **`src/api/quizService.js`** — wraps all quiz API calls. Normalizes the API response shape (camelCase backend fields → local field names like `id`, `text`, `answers`).
- **`src/compenents/Login/RequireAuth.js`** — route guard that reads `currentUser` from localStorage; redirects to `/login` if absent.
- **`src/App.js`** — React Router setup. Public routes: `/`, `/login`, `/register`. All other routes are wrapped in `<RequireAuth>`.
- **`src/compenents/QuizHandler.js`** — thin wrapper over `quizService` that also provides `loadExamples()` to seed sample quizzes via the API.

### Key Design Patterns

- The API field name mapping happens in `quizService.getById()`: backend returns `quizId`/`questionId`/`answerId`/`questionText`/`answerText` but the frontend works with `id`/`text`/`answers`.
- `quizService.create()` and `quizService.update()` use a different internal shape (`q.text`, `q.options`, `q.correctAnswer`) compared to the backend DTO — the service builds the correct payload before sending.
- Quiz ownership is enforced server-side: update/delete check that `quiz.UserId == currentUserId`.

## Configuration

The connection string in `appsettings.json` points to a local SQL Server Express instance (`ALI-HAJKASEM\SQLEXPRESS`, database `QuizAppApiDb2`). Update this for a different environment.

JWT settings (`Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience`) can be set in `appsettings.json` or environment variables; hardcoded fallbacks exist in `Program.cs` and `AccountController.cs`.

Frontend API URL is set via `REACT_APP_API_URL` environment variable (used as base URL in both service files). Set in `quiz-client/.env` for local development.

## Swagger

Available at `https://localhost:<port>/swagger` in development. Use the "Authorize" button with `Bearer <token>` to test protected endpoints.

## Workflow

Before finishing any task:

1. ensure the app compiles successfully
2. Avoid braking existing features
3. Keep changes minimal and focused

Update @CLAUDE.md file after each major change and keep it up to date
