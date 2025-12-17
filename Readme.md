# Blog App 

## 🚀 Live Demo
**Frontend:** https://rpg-assignment-salman.vercel.app/  


## 📹 Video Demo
[Loom Video - Click to Watch](https://www.loom.com/share/d64896bab277426fbf095b878e6a5638)

---


## 🛠 Tech Stack

**Backend:**
- NestJS
- GraphQL (Apollo Server)
- Drizzle ORM (chose this for type-safety and lightweight footprint)
- PostgreSQL 
- JWT Authentication 
- `graphql-ws` for real-time subscriptions

**Frontend:**
- Vue 3
- Apollo Client
- Vue Router

**Note:** I'm primarily a backend developer. For the Vue.js frontend, I used Cursor AI to help with component structure and Vue-specific syntax. 
---

## 🏃 How to Run Locally

### Prerequisites
- Node.js 20+
- Yarn
- PostgreSQL database (or use Neon.tech free tier)

### 1. Clone the repo
```bash
git clone https://github.com/salmankhan-prs/rpg-assignment.git
cd rpg-assignment
```

### 2. Setup Backend
```bash
cd backend
yarn install

# Create .env file
cp .env.example .env
# Edit .env with your database URL and JWT secret
```

**.env file:**
```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:5173
```

```bash
# Push database schema
yarn db:push

# Start dev server
yarn start:dev
```
Backend runs on: http://localhost:3200/graphql

### 3. Setup Frontend
```bash
cd frontend
yarn install

# Create .env file (optional for local dev)
# Default points to localhost:3200
```

```bash
# Start dev server
yarn dev
```
Frontend runs on: http://localhost:5173

---

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── auth/           # Authentication (JWT, guards)
│   │   ├── blog/           # Blog CRUD + subscriptions
│   │   ├── drizzle/        # Database schema & connection
│   │   └── main.ts         # App entry point
│   └── drizzle.config.ts   # Drizzle ORM config
│
├── frontend/
│   ├── src/
│   │   ├── views/          # Login, Register, Blogs pages
│   │   ├── graphql/        # GraphQL queries/mutations
│   │   ├── composables/    # Auth state management
│   │   └── apollo.ts       # Apollo Client setup
│   └── index.html
```

---



