# 🇮🇳 TravelBharat — Explore India State by State

TravelBharat is a full-stack tourism web application that helps users discover Indian states, cities, categories, and tourist destinations in one place. It presents destination information such as descriptions, historical and cultural significance, visiting information, entry fees, nearby attractions, travel tips, directions, maps, and images.

The project combines a React/Vite frontend with an Express/Node.js backend and MongoDB Atlas, with an in-memory fallback so the application can continue to operate when MongoDB is unavailable.

## ✨ Features

### Public tourism experience
- Explore Indian states and union-territory entries.
- Browse cities and tourist destinations.
- Browse destinations by tourism category.
- Search destinations.
- Open detailed destination pages.
- View destination image galleries.
- View historical and cultural information.
- View best time to visit and recommended duration.
- View opening hours and entry-fee information.
- View nearby attractions and travel tips.
- View how-to-reach information by air, train, and road.
- Open destination map links when available.
- Responsive navigation and page layouts.
- Dedicated 404/not-found page.

### Admin portal
The project includes a protected admin dashboard with JWT-based authentication.

Authenticated administrators can:
- View dashboard statistics.
- View their authenticated admin profile.
- Create, update, and delete states.
- Create, update, and delete cities.
- Create, update, and delete categories.
- Create, update, and delete destinations.
- Manage destination image URLs and tourism information.

## 🛠️ Technology Stack

### Frontend
- React 19
- Vite 8
- React Router DOM 7
- Tailwind CSS 4
- `@tailwindcss/vite`
- Lucide React icons

### Backend
- Node.js
- Express 4
- REST API architecture
- Helmet for security headers
- CORS
- JWT authentication
- bcryptjs for password hashing

### Database
- MongoDB
- MongoDB Atlas
- Mongoose
- In-memory resilience fallback when MongoDB is unavailable

## 🏗️ Architecture

```text
React + Vite Frontend
        │
        │ HTTP / REST API
        ▼
Express + Node.js Backend
        │
        ├── Authentication / JWT
        ├── States API
        ├── Cities API
        ├── Categories API
        ├── Destinations API
        └── Admin CRUD API
        │
        ▼
MongoDB Atlas
        │
        └── In-memory fallback when MongoDB is unavailable
```

## 📁 Project Structure

```text
Discover_Bharat/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── seed/
│       └── index.js
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── server.js
├── vite.config.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

## 📄 Main Frontend Pages

| Route | Purpose |
|---|---|
| `/` | Home page |
| `/states` | Browse states |
| `/states/:stateSlug` | State details |
| `/destinations` | Browse destinations |
| `/destinations/:slug` | Destination details |
| `/categories` | Browse tourism categories |
| `/categories/:slug` | Category view |
| `/search` | Destination search |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Protected admin dashboard |

## 🔌 API Endpoints

The frontend communicates with the backend through `/api`.

### Health
```text
GET /api/health
```

### States
```text
GET /api/states
GET /api/states/:slug
```

### Cities
```text
GET /api/cities
GET /api/cities/:slug
```

### Categories
```text
GET /api/categories
GET /api/categories/:slug
```

### Destinations
```text
GET /api/destinations
GET /api/destinations/:slug
GET /api/destinations/search?q=<query>
```

### Admin authentication
```text
POST /api/admin/login
GET  /api/admin/me
GET  /api/admin/dashboard
```

### Protected admin CRUD
```text
POST   /api/admin/states
PUT    /api/admin/states/:id
DELETE /api/admin/states/:id

POST   /api/admin/cities
PUT    /api/admin/cities/:id
DELETE /api/admin/cities/:id

POST   /api/admin/categories
PUT    /api/admin/categories/:id
DELETE /api/admin/categories/:id

POST   /api/admin/destinations
PUT    /api/admin/destinations/:id
DELETE /api/admin/destinations/:id
```

## 🚀 Installation and Setup

### Prerequisites
- Node.js 20 or a compatible modern Node.js version
- npm
- MongoDB Atlas account (optional because the application has an in-memory fallback)
- Git, if cloning from GitHub

### 1. Clone the repository
```bash
git clone https://github.com/Nirbhaya-srivastava/TravelBharat.git
cd TravelBharat
```
Replace the repository URL with your actual GitHub repository URL.

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root.

Example:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

Do not commit the real `.env` file to GitHub. If you provide an `.env.example`, keep only placeholder values in it.

### 4. Start the application
```bash
npm start
```
The application is configured to run at `http://localhost:3000`. The development server mounts Vite as middleware, while the backend exposes the REST API under `/api`.

### 5. Production build
```bash
npm run build
```

## 🗄️ MongoDB and Resilience Mode

When `MONGODB_URI` is available and the Atlas cluster is reachable, the application connects through Mongoose and uses MongoDB for persistent data.

If MongoDB is unavailable, the backend continues using its in-memory data store. This keeps the application usable during development, although fallback-mode changes are not persistent after the process stops.

The current `server.js` also configures Google public DNS resolvers (`8.8.8.8` and `8.8.4.4`) to help resolve MongoDB Atlas SRV records in the development setup.

## 🔐 Security

The project includes:
- JWT-based admin authentication.
- Password hashing with bcryptjs.
- Protected admin routes.
- Authorization headers for authenticated API requests.
- Helmet security headers.
- CORS configuration.
- Environment variables for database and authentication configuration.

Never publish database credentials, JWT secrets, or other private environment values in GitHub.

## 🖼️ Images and External Resources

Destination and city records can contain externally hosted image URLs. Before deploying publicly or commercially, verify the usage rights and license of every third-party image and external resource. For long-term reliability, project-owned or properly licensed images can be stored in public assets and referenced locally.

## 🎯 Project Objectives

1. Organize tourism information by states, cities, categories, and destinations.
2. Make destination discovery easier through search and filtering.
3. Provide practical information for travelers.
4. Provide an administrative interface for managing tourism data.
5. Demonstrate a complete React, Node.js, Express, and MongoDB full-stack architecture.

## 🔮 Possible Future Enhancements
- User accounts and personal favorites.
- Reviews and ratings.
- Trip/itinerary planning.
- Interactive maps and route planning.
- Weather information.
- Hotel and restaurant information.
- Multi-language support.
- Progressive Web App support.
- More advanced tourism analytics in the admin dashboard.

## 👨‍💻 Project

**TravelBharat — Explore India State by State**

Developed as a full-stack web application using React, Node.js, Express, MongoDB/Mongoose, and modern frontend tooling.

## 📜 License

This project is intended for educational and portfolio purposes.
