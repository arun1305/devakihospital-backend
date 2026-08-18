# Devaki Speciality Hospital — Backend API

Express + TypeScript + MongoDB (Mongoose) API powering the Devaki Speciality Hospital public website and admin CMS.

## Stack

- Node.js / Express, TypeScript
- MongoDB Atlas via Mongoose
- JWT auth (access + refresh tokens, httpOnly cookies) with bcrypt password hashing
- express-validator, helmet, express-rate-limit, cors, compression, multer

## Getting started

```bash
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT secrets
npm run seed            # seeds an admin user, departments, doctors, testimonials
npm run dev              # http://localhost:5050
```

Default seeded admin login: `admin@devakihospital.com` / `ChangeMe123!` — change this immediately in a real environment.

Note: `PORT` defaults to `5050`, not `5000` — macOS's AirPlay Receiver (ControlCenter) binds port
5000 by default on many machines, which silently swallows requests without an obvious bind error.

## Code quality

Husky + lint-staged run ESLint (`--fix`) on staged `.ts` files and Prettier on staged
`.json`/`.md` files before every commit (`.husky/pre-commit`), followed by a full `tsc --noEmit`
project check.

## Scripts

- `npm run dev` — start with nodemon + ts-node
- `npm run build` — compile to `dist/`
- `npm start` — run compiled build
- `npm run seed` — reseed sample data (destructive — clears core collections first)
- `npm run lint` — ESLint
- `npm run format` — Prettier write

## API overview

All routes are prefixed with `/api`. Public GET endpoints are open; write endpoints require a Bearer/cookie JWT and role (`admin`, `editor`, `doctor`, `receptionist`).

| Resource                                          | Path                                                       |
| ------------------------------------------------- | ---------------------------------------------------------- |
| Auth                                              | `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me` |
| Users (admin only)                                | `/users`                                                   |
| Departments                                       | `/departments`                                             |
| Doctors                                           | `/doctors`                                                 |
| Appointments                                      | `/appointments`                                            |
| Blogs / Blog Categories                           | `/blogs`, `/blog-categories`                               |
| News                                              | `/news`                                                    |
| Events (+ registration)                           | `/events`, `/events/:id/register`                          |
| Gallery                                           | `/gallery`                                                 |
| Testimonials                                      | `/testimonials`                                            |
| Health Packages (+ booking)                       | `/packages`, `/packages/:id/book`                          |
| Insurance Partners                                | `/insurance-partners`                                      |
| Awards / Accreditations                           | `/awards`, `/accreditations`                               |
| Careers (+ apply, public multipart resume upload) | `/careers`, `/careers/:id/apply`                           |
| Enquiries                                         | `/enquiries`                                               |
| Newsletter Subscribers                            | `/subscribers`                                             |
| Media Upload (admin/editor only)                  | `/upload`                                                  |

List endpoints support `?page=&limit=&q=&status=&sort=` plus arbitrary field filters:

- Exact match: `?departments=<id>`, `?gender=female`, `?languages=Tamil` (matches array fields
  containing the value)
- Range: `?experienceYears_gte=10`, also `_lte`, `_gt`, `_lt`
- Set membership: `?status_in=draft,published`

Department documents also carry optional `contactPhone` / `contactEmail` fields, surfaced on the
website's department contact directory.

## Deployment notes

- Point `MONGO_URI` at a MongoDB Atlas cluster.
- Set strong, unique `JWT_SECRET` / `JWT_REFRESH_SECRET` values.
- `CORS_ORIGINS` must list the deployed website and admin panel origins.
- File uploads are stored on local disk under `uploads/`; swap `middleware/upload.ts` and `models/Misc.ts#MediaAsset` for an S3-backed implementation when ready (interface is already isolated for this).

## Known Mongoose gotcha

Don't name a schema field `schema` on a subdocument (e.g. inside `SeoSchema`) — it collides with
Mongoose's internal subdocument `.schema` property and corrupts array-field default application
elsewhere in the same subdocument, throwing a cryptic `Cannot read properties of undefined
(reading 'indexedPaths')` at validation time. Also avoid sharing one `Schema` instance as a
subdocument type across multiple parent schemas (`common/seo.schema.ts` exports a
`createSeoSchema()` factory for this reason) — Mongoose mutates schema internals in place per
parent it's attached to.
