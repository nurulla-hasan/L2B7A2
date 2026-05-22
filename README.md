# DevPulse

DevPulse is a backend project for tracking bugs and feature requests inside a software team. Users can create account, login, create issues and see issue details. Maintainer users can update and delete issues.

## Live Link

Live API: `https://l2-b7-a2.vercel.app`

GitHub Repo: `https://github.com/nurulla-hasan/L2B7A2`

## Technology

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- pg
- bcrypt
- jsonwebtoken
- dotenv
- cors

## Features

- User registration
- User login with JWT token
- Password hashing
- Role based access
- Create issue
- Get all issues
- Get single issue
- Update issue
- Delete issue
- Filter issues by type and status
- Sort issues by newest and oldest

## Setup

Clone the project and install packages.

```bash
npm install
```

Create `.env` file in the root folder.

```env
PORT=5000
DATABASE_URL=your database url
ACCESS_SECRET=your secret
REFRESH_SECRET=your refresh secret
NODE_ENV=development
```

Run the project.

```bash
npm run dev
```

Build command:

```bash
npm run build
```

## API Endpoints

### Auth

```txt
POST /api/auth/signup
POST /api/auth/login
```

### Issues

```txt
POST /api/issues
GET /api/issues
GET /api/issues/:id
PATCH /api/issues/:id
DELETE /api/issues/:id
```

Query example:

```txt
/api/issues?sort=newest&type=bug&status=open
```

For protected routes token should be sent in header:

```txt
Authorization: token
```

## Database Tables

### users

- id
- name
- email
- password
- role
- created_at
- updated_at

### issues

- id
- title
- description
- type
- status
- reporter_id
- created_at
- updated_at

## Roles

Contributor:

- can register and login
- can create issue
- can view issues
- can update own open issue

Maintainer:

- can do contributor works
- can update any issue
- can delete issue

## Note

This project uses raw SQL query with PostgreSQL `pg` package. No ORM or query builder is used.
