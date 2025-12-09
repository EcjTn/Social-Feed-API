# 📱 Text Feed API  
Modular NestJS backend for a social feed system with organized architecture and security features.

<p align="left">
  <img src="https://img.shields.io/badge/NestJS-v11-red" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-blue" />
  <img src="https://img.shields.io/badge/TypeORM-ORM-orange" />
  <img src="https://img.shields.io/badge/Redis-Caching-critical" />
  <img src="https://img.shields.io/badge/Docker-Ready-informational" />
  <img src="https://img.shields.io/badge/Swagger-API Docs-success" />
</p>

---

> [!NOTE]    
> This project is a Learning Project. Some features may be overkill or included only for practice (e.g., Redis, extra security layers, or more complex patterns).
> 

---

## 🚀 Tech Stack & Architecture

- **TypeORM** — ORM for Entities, Relations, and Migrations.  
- **Postgres** — Relational database for structured, linked data.  
- **Redis (Caching)** — In-memory layer to speed up repeated queries.  
- **Indexing & Unique Indexes** — Improves read performance and prevents duplicates.  
- **Rate Limiting (Throttler)** — Prevents excessive requests and abuse.  
- **Recaptcha Validation (v3)** — Blocks bot activity on sensitive endpoints.  
- **Normalization** — Ensures clean input and consistent database structure.  
- **Modular Architecture** — Each feature is isolated into its own NestJS module.

---

## 📦 Features

- **Authentication** — Secure login and signup workflow using JWT tokens and opaque tokens.  
- **Access & Refresh Tokens** — Short-lived access tokens and long-lived refresh tokens for session continuity.  
- **Partial User Search** — Search for users by matching parts of their username.  
- **Public User Data** — Exposes non-sensitive profile information.  
- **Posts** — Create, view, and manage user-generated posts.  
- **Comments** — Commenting system with parent–child relations.  
- **Followers** — Basic social graph to follow/unfollow users.  
- **Likes (Posts/Comments)** — Unique like actions enforced with unique indexes.  
- **Identicon Avatars/PFPs** — Auto-generated profile images for new users.  
- **Rate Limiting** — App-wide throttling to prevent request flooding.  
- **Helmet Protection** — Adds secure HTTP headers for baseline protection.  
- **GZip Compression** — Reduces response size for faster delivery.  
- **Swagger Docs** — Auto-generated API documentation.  
- **Dockerized** — Fully runnable through Docker for consistent environments.  
- **Recaptcha (v3)** — Server-side validation to block automated signups/logins.  
- **Cursor-Based Pagination** — Efficient, scalable feed pagination.  
- **Role-Based Access Control (RBAC)** — Restricts actions based on user roles.  
- **Ban/Unban Users** — Administrative controls for platform moderation.  
- **View History** — View previously liked posts and past comments.  
- **Redis Caching** — Speeds up frequently accessed pages like user profiles or feeds.

---
