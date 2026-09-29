# TravelBharat — Digital Tourism Encyclopedia for India

> *"Discover India. Explore Bharat."*

TravelBharat is a centralized, digital tourism encyclopedia covering tourist destinations, state-wise geography, regional cultures, royal forts, spiritual sanctums, and hidden gems across India. Built for travelers, researchers, students, and cultural enthusiasts, TravelBharat focuses purely on informational discovery, historical significance, and curated travel intelligence without commercial booking clutter.

---

## 🏛️ Key Features

- **Territorial Exploration**: Dedicated coverage of India's 28 states and 8 union territories with capitals, regional culture, local cuisine, and major festivals.
- **Rich Encyclopedic Folios**: Comprehensive information on monuments with architecture monographs, historical & cultural significance, visiting hours, entry fees, recommended duration, and how-to-reach guides.
- **Categorized Discovery**: 15 curated categories including World Heritage Sites, Hill Forts, Sacred Temples, Backwaters, Hill Stations, Wildlife Sanctuaries, Beaches, and Caves.
- **Multi-Criteria Filtering & Search**: Filter destinations simultaneously by state, dynamic city listing, category, and historical verification status with live sorting.
- **Full-Text Global Search**: Search across destination names, states, cities, and categories with instant grouping.
- **Interactive Image Galleries**: Multi-image galleries with responsive layout, thumbnail navigation, and keyboard-accessible fullscreen lightbox (`Left`, `Right`, `Esc`).
- **Curator & Admin Portal**: Secure JWT-authenticated dashboard for creating, editing, and deleting destinations, states, cities, and categories, complete with draft/published moderation and verified badges.
- **Resilient Dual-Mode Data Layer**: Works out-of-the-box in development with a seeded in-memory store and connects automatically to MongoDB / MongoDB Atlas when configured.

---

## 🛠️ Technology Stack

- **Frontend**: React.js 19, Vite, Tailwind CSS, Lucide Icons, React Router DOM
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose ODM (with automatic resilient fallback)
- **Security & Authentication**: JSON Web Tokens (JWT), bcryptjs, Helmet, CORS
- **Language**: 100% JavaScript (`.js` / `.jsx`) with a unified root `package.json`

---

## 📂 Project Structure

```text
TravelBharat/
├── package.json              # Single root package.json for frontend and backend
├── package-lock.json
├── .gitignore
├── .env.example              # Environment variables template
├── README.md                 # Full documentation
├── index.html                # HTML5 entry with metadata
├── vite.config.js            # Vite configuration
├── server.js                 # Unified Express + Vite full-stack server
│
├── src/                      # React Frontend
│   ├── main.jsx              # React application root
│   ├── App.jsx               # Routes and layout shell
│   ├── index.css             # Tailwind base styles and typography
│   ├── context/
│   │   └── AuthContext.jsx   # Admin authentication context
│   ├── services/
│   │   └── api.js            # REST API client
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation bar with responsive drawer
│   │   ├── Footer.jsx        # Informational footer
│   │   ├── HeroSection.jsx   # Hero with search and territorial stats
│   │   ├── SearchBar.jsx     # Search component
│   │   ├── StateCard.jsx     # Card for States & UTs
│   │   ├── DestinationCard.jsx # Destination card with verified badges
│   │   ├── CategoryCard.jsx  # Thematic category card
│   │   ├── FilterPanel.jsx   # Multi-criteria filter drawer
│   │   ├── ImageGallery.jsx  # Lightbox and multi-photo gallery
│   │   ├── NearbyPlaces.jsx  # Nearby attractions circuit
│   │   ├── LoadingSpinner.jsx# Skeletons and spinner
│   │   ├── EmptyState.jsx    # Empty state handler
│   │   └── ProtectedRoute.jsx# Admin route guard
│   └── pages/
│       ├── HomePage.jsx      # Curated encyclopedia homepage
│       ├── StatesPage.jsx    # All Indian States & UTs
│       ├── StateDetailsPage.jsx # Detailed state overview & places
│       ├── DestinationsPage.jsx # Filterable destination directory
│       ├── DestinationDetailsPage.jsx # Rich monograph folio
│       ├── CategoriesPage.jsx# Thematic category browser
│       ├── SearchPage.jsx    # Global search page
│       ├── LoginPage.jsx     # Curator authentication portal
│       ├── AdminDashboardPage.jsx # Full CRUD administrative dashboard
│       └── NotFoundPage.jsx  # 404 page
│
└── backend/                  # Node.js / Express Backend
    └── src/
        ├── index.js          # Express app factory
        ├── config/
        │   └── index.js      # Environment and DB connection
        ├── models/
        │   ├── State.js      # Mongoose State schema
        │   ├── City.js       # Mongoose City schema
        │   ├── Category.js   # Mongoose Category schema
        │   ├── Destination.js# Mongoose Destination schema
        │   ├── Admin.js      # Mongoose Admin schema
        │   └── dataStore.js  # Unified data abstraction
        ├── controllers/
        │   ├── stateController.js
        │   ├── cityController.js
        │   ├── categoryController.js
        │   ├── destinationController.js
        │   └── adminController.js
        ├── routes/
        │   ├── stateRoutes.js
        │   ├── cityRoutes.js
        │   ├── categoryRoutes.js
        │   ├── destinationRoutes.js
        │   ├── adminRoutes.js
        │   └── index.js
        ├── middleware/
        │   ├── authMiddleware.js
        │   └── errorMiddleware.js
        └── seed/
            ├── seedData.js   # Rich seed dataset covering all Indian regions
            └── runSeed.js    # Seeding runner script
```

---

## ⚡ Quick Start & Local Development

### 1. Prerequisites
- Node.js (v18 or v20+)
- npm (v9+)
- *(Optional)* A running MongoDB instance or free MongoDB Atlas URI

### 2. Installation
Clone the repository and install all dependencies using npm:
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(If `MONGODB_URI` is left blank, TravelBharat immediately initializes in local resilient mode pre-seeded with 14 states, 25+ cities, and 35+ rich destinations).*

### 4. Run the Full-Stack Application
Start the unified full-stack server (Vite frontend + Express backend on port 3000):
```bash
npm run dev
```
Open your browser at: **`http://localhost:3000`**

---

## 🔐 Admin & Curator Access

- **Portal URL**: `/admin/login`
- **Default Email**: `admin@travelbharat.gov.in`
- **Default Password**: `AdminPassword123!`

*(The login page includes a convenient "Fill Credentials" button for instant testing).*

From the dashboard, administrators can:
- Add, update, and delete destinations, states, cities, and categories.
- Moderate entries between **Draft**, **Published**, and **Verified**.
- Upload multiple image URLs, configure travel tips, and edit entry fees and visiting hours.

---

## 📡 REST API Documentation

### Public Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck and current DB status |
| `GET` | `/api/states` | List all states with dynamic destination counts |
| `GET` | `/api/states/:slug` | State monograph with associated cities & destinations |
| `GET` | `/api/cities` | List cities (optional `?state=slug`) |
| `GET` | `/api/cities/:slug` | Single city with destinations |
| `GET` | `/api/categories` | List all 15 tourism categories with counts |
| `GET` | `/api/categories/:slug` | Category details with destinations |
| `GET` | `/api/destinations` | Filter destinations (`?state=`, `?city=`, `?category=`, `?verified=true`, `?sort=`, `?page=`, `?limit=`) |
| `GET` | `/api/destinations/:slug`| Full destination monograph with nearby attractions |
| `GET` | `/api/destinations/search?q=` | Global multi-collection search |

### Admin Endpoints (Bearer JWT Required)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/admin/login` | Authenticate curator, returns JWT token |
| `GET` | `/api/admin/me` | Current authenticated admin profile |
| `GET` | `/api/admin/dashboard` | Dashboard metrics & counters |
| `POST` | `/api/admin/destinations` | Create new destination |
| `PUT` | `/api/admin/destinations/:id` | Update destination (including verification status) |
| `DELETE`| `/api/admin/destinations/:id` | Remove destination |
| `POST` | `/api/admin/states` | Create new state |
| `PUT` | `/api/admin/states/:id` | Update state record |
| `DELETE`| `/api/admin/states/:id` | Remove state |
| `POST` | `/api/admin/cities` | Create new city |
| `PUT` | `/api/admin/cities/:id` | Update city record |
| `DELETE`| `/api/admin/cities/:id` | Remove city |
| `POST` | `/api/admin/categories` | Create new category |
| `PUT` | `/api/admin/categories/:id` | Update category |
| `DELETE`| `/api/admin/categories/:id` | Remove category |

---

## 🗄️ Database Seeding

To seed a live MongoDB Atlas or local MongoDB database:
1. Provide `MONGODB_URI` in `.env`.
2. Run:
```bash
npm run seed
```

---

## 🚀 Production Build & Deployment

### Build Command
Compile the React frontend bundle for production:
```bash
npm run build
```

### Start Command
Start the production server (serves the Express API and static assets from `dist/`):
```bash
npm start
```

### Deployment to Render / AWS / Cloud Run
1. Set the build command: `npm install && npm run build`
2. Set the start command: `node server.js`
3. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=3000` (or leave default for cloud platforms)
   - `MONGODB_URI=<your-mongodb-atlas-connection-string>`
   - `JWT_SECRET=<your-custom-production-secret>`

### Deployment of Frontend to Vercel (Optional)
If deploying the frontend independently to Vercel:
- Root directory: `./`
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL` to your backend URL.

---

## 📜 Informational Notice & Ethics

TravelBharat is created strictly as an informational and cultural encyclopedia. It does not provide commercial booking, flights, or tickets. All information records indicate whether they are verified against archaeological and governmental archives.
