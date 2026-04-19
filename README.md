# Blog Project

A full-stack blogging platform where users can register, manage a rich profile, write and publish posts, discover authors, and stay updated with notifications. The app pairs a **React + TypeScript** frontend with a **Django REST** API and uses **Cloudinary** for media.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
  - [Clone the repository](#clone-the-repository)
  - [Backend (Django)](#backend-django)
  - [Frontend (Vite + React)](#frontend-vite--react)
- [Environment variables](#environment-variables)
- [Contributing](#contributing)
- [Useful commands](#useful-commands)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

### Authentication & session

- User **registration** and **login** (email or username + password).
- **JWT** authentication with tokens delivered via **HTTP-only cookies** (access + refresh).
- **Token refresh** flow and client-side refresh scheduling for a smoother session.
- **Logout** endpoint to clear auth cookies.

### User profile

- View and **edit profile** (bio, contact, social links, preferences, etc.).
- **Profile picture** and **cover image** uploads (stored via Cloudinary).
- **Gallery**-style media for profile and cover where applicable.

### Blogs

- **Create** and **edit** blog posts with a rich editor (**TipTap**).
- **List** blogs, **home** page with featured/recent content, and **categories**.
- **Blog details** by slug; **author** pages for individual bloggers.
- **My blogs**: separate views for **drafts** and **published** posts.
- Optional **AI-assisted blog generation** (backend uses OpenRouter when configured).

### Social & engagement

- **Discover bloggers** and browse author profiles.
- **Comments** on posts (including threaded / reply support in the API).
- **Notifications** for activity relevant to the user.

### Frontend UX

- **Protected routes** for authenticated-only pages (create blog, profile, notifications, etc.).
- **Public routes** for login/register when already signed in.
- Responsive layout with **header**, **footer**, loading states, and toast feedback.

---

## Tech stack

| Layer    | Technologies                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------ |
| Frontend | React 19, TypeScript, Vite, Redux Toolkit (RTK Query), React Router, Tailwind CSS, TipTap, Framer Motion, React Toastify |
| Backend  | Django 6, Django REST Framework, SimpleJWT (cookie-based auth), CORS, Cloudinary storage                                 |
| Database | SQLite (default; configurable in `settings.py`)                                                                          |
| Media    | Cloudinary                                                                                                               |

---

## Project structure

```text
Blog-Project/
├── Backend/                 # Django project
│   ├── blog_project/        # Settings, root URLs
│   ├── accounts/            # Users, auth (register, login, refresh, logout)
│   ├── userProfile/         # Profiles, images, followers-related APIs
│   ├── Blogs/               # Posts, comments, categories, AI helper
│   ├── notifications/       # Notification APIs
│   ├── manage.py
│   └── requirements.txt
├── Frontend/                # Vite + React app
│   ├── src/
│   │   ├── app/             # Redux store
│   │   ├── features/        # API slices (auth, profile, blogs, notifications)
│   │   ├── pages/           # Route-level pages
│   │   ├── components/      # UI components
│   │   └── routes/          # Router, protected/public routes
│   └── package.json
└── README.md
```

---

## Prerequisites

- **Python** 3.12+ (compatible with Django 6 as per your environment)
- **Node.js** 20+ and **npm** (or **pnpm** / **yarn** if you prefer)
- A **Cloudinary** account (for image uploads in development and production)
- Optional: **OpenRouter** API key if you use AI blog generation features

---

## Getting started

### Clone the repository

```bash
git clone https://github.com/<your-username>/Blog-Project.git
cd Blog-Project
```

Use your fork URL or the upstream repository URL you were given.

---

### Backend (Django)

1. Create and activate a virtual environment (from the repo root):

   ```bash
   cd Backend
   python -m venv .venv
   ```

   - **Windows (PowerShell):** `.\.venv\Scripts\Activate.ps1`
   - **macOS/Linux:** `source .venv/bin/activate`

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file inside `Backend/` (see [Environment variables](#environment-variables)).

4. Apply migrations and create a superuser (optional, for Django admin):

   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. Run the development server (default **http://127.0.0.1:8000**):

   ```bash
   python manage.py runserver
   ```

API routes are mounted under `/api/` (for example: `/api/auth/login`, `/api/blog/`, `/api/profile/...`).

---

### Frontend (Vite + React)

1. Install dependencies:

   ```bash
   cd Frontend
   npm install
   ```

2. Optional: create `Frontend/.env` to point at your API (must match how the app is configured):

   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/
   ```

   The codebase also uses a default API base in RTK Query; ensure the backend URL and CORS settings match where you run the frontend (typically **http://localhost:5173** for Vite).

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open the printed local URL (usually **http://localhost:5173**).

---

## Environment variables

Create **`Backend/.env`** (not committed) with at least:

| Variable                | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name                          |
| `CLOUDINARY_API_KEY`    | Cloudinary API key                             |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret                          |
| `OPENROUTER_API_KEY`    | Optional; used for AI blog generation features |

Never commit real secrets. For production, use your host’s secret management and rotate keys if they are ever exposed.

---

## Contributing

Contributions are welcome. A typical workflow:

1. **Fork** the repository on GitHub (or ask for collaborator access on the upstream repo).
2. **Clone your fork** and add the upstream remote if you need to sync:

   ```bash
   git remote add upstream https://github.com/<upstream>/Blog-Project.git
   git fetch upstream
   ```

3. **Create a branch** from `main` (or the default branch):

   ```bash
   git checkout -b feature/your-short-description
   ```

4. **Make focused changes**: one feature or fix per pull request when possible; match existing code style (TypeScript/ESLint on the frontend, PEP 8 on the backend).

5. **Test locally**: run migrations if you change models; run `npm run build` / `npm run lint` on the frontend and exercise critical flows (login, blog create, uploads).

6. **Commit** with clear messages, e.g. `fix: cover image upload sends FormData body`.

7. **Push** and open a **Pull Request** against the default branch. Describe _what_ changed and _why_, and link any related issue.

8. Respond to review feedback; keep PRs reasonably small so they are easier to review.

If you are unsure about a large change, open an **issue** first to agree on the approach.

---

## Useful commands

| Location | Command                           | Description                           |
| -------- | --------------------------------- | ------------------------------------- |
| Frontend | `npm run dev`                     | Dev server with HMR                   |
| Frontend | `npm run build`                   | Production build                      |
| Frontend | `npm run lint`                    | ESLint                                |
| Backend  | `python manage.py runserver`      | Dev API server                        |
| Backend  | `python manage.py migrate`        | Apply DB migrations                   |
| Backend  | `python manage.py makemigrations` | Create migrations after model changes |

---

## Troubleshooting

- **CORS / login issues:** Ensure `django-cors-headers` allows your frontend origin (see `settings.py`) and that you use `credentials: "include"` where the API expects cookies.
- **Images not uploading:** Confirm Cloudinary env vars are set and that multipart `FormData` uses the field names expected by the Django views (`body` in RTK Query, not `data`).
- **Database errors after pulling:** Run `python manage.py migrate` again.
