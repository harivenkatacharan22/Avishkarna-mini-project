# 🌾 VillageShare – Community Resource Sharing Platform

A complete full-stack B.Tech mini project built with **React.js (Vite)** + **Node.js + Express.js** using **JSON file-based storage** (no database required).

---

## 📁 Project Folder Structure

```
Village_Resource_App/
├── backend/
│   ├── data/
│   │   ├── users.json          ← User accounts (hashed passwords)
│   │   ├── resources.json      ← Resource listings
│   │   └── requests.json       ← Borrow requests & pre-bookings
│   ├── middleware/
│   │   └── auth.js             ← JWT bearer token validation
│   ├── routes/
│   │   ├── auth.js             ← Register / Login / Me routes
│   │   ├── resources.js        ← Resource CRUD routes
│   │   └── requests.js         ← Borrow request routes
│   ├── server.js               ← Express entry point (port 5000)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx       ← Responsive sticky navbar
    │   │   ├── Footer.jsx       ← Footer with quick links
    │   │   └── ResourceCard.jsx ← Grid card for resource listings
    │   ├── context/
    │   │   └── AuthContext.jsx  ← Auth state + axios interceptors
    │   ├── pages/
    │   │   ├── Home.jsx         ← Landing page + featured items
    │   │   ├── Login.jsx        ← Login form
    │   │   ├── Register.jsx     ← Registration form
    │   │   ├── BrowseResources.jsx ← Search & filter grid
    │   │   ├── ResourceDetails.jsx ← Item details + booking form
    │   │   ├── AddResource.jsx  ← List a new resource
    │   │   ├── Dashboard.jsx    ← 4-tab owner/borrower dashboard
    │   │   ├── Contact.jsx      ← FAQ + contact form
    │   │   └── About.jsx        ← Project info & architecture
    │   ├── index.css            ← Complete design system (glassmorphism)
    │   ├── config.js            ← Backend API base URL config
    │   └── App.jsx              ← Router with all routes
    └── index.html               ← SEO meta tags + Google Fonts
```

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js v18+ installed
- Two terminal windows

---

### Step 1: Start the Backend Server

```bash
cd Village_Resource_App/backend
npm install
npm run dev
```

✅ Backend runs at: **http://localhost:5000**

---

### Step 2: Start the Frontend Dev Server

```bash
cd Village_Resource_App/frontend
npm install
npm run dev
```

✅ Frontend runs at: **http://localhost:5173**

---

## 🔑 Test Credentials (Pre-seeded)

| Username | Password    | Name          | Village |
|----------|-------------|---------------|---------|
| `ramesh` | `password123` | Ramesh Kumar | Rampur  |
| `suresh` | `password123` | Suresh Patel | Rampur  |

> ⚠️ Note: The hashed password in `users.json` corresponds to `password123`.

---

## 🌐 API Endpoints

### Auth Routes (`/api/auth`)
| Method | Endpoint              | Access  | Description              |
|--------|-----------------------|---------|--------------------------|
| POST   | `/api/auth/register`  | Public  | Register new user        |
| POST   | `/api/auth/login`     | Public  | Login and get JWT token  |
| GET    | `/api/auth/me`        | Private | Get current user profile |

### Resource Routes (`/api/resources`)
| Method | Endpoint              | Access  | Description                    |
|--------|-----------------------|---------|--------------------------------|
| GET    | `/api/resources`      | Public  | Get all resources (filterable) |
| GET    | `/api/resources/:id`  | Public  | Get single resource + bookings |
| POST   | `/api/resources`      | Private | Create a new resource listing  |
| PUT    | `/api/resources/:id`  | Private | Update resource (owner only)   |
| DELETE | `/api/resources/:id`  | Private | Delete resource (owner only)   |

### Request Routes (`/api/requests`)
| Method | Endpoint                     | Access  | Description                       |
|--------|------------------------------|---------|-----------------------------------|
| POST   | `/api/requests`              | Private | Submit borrow/pre-booking request |
| GET    | `/api/requests/owner`        | Private | Get requests received (as owner)  |
| GET    | `/api/requests/borrower`     | Private | Get requests sent (as borrower)   |
| PATCH  | `/api/requests/:id/status`   | Private | Approve or Reject a request       |

---

## 📋 Full Feature Demo Walkthrough

1. **Open** http://localhost:5173 — View hero section and featured resources
2. **Register** a new account (username: `testuser`, village: `Sundarpur`)
3. **Add Resource** — List "12V Cordless Drill" under "Drill Machine"
4. **Logout** and login as `suresh`
5. **Browse Resources** — Filter by "Drill Machine", click on the listed item
6. **Send Request** — Select dates June 25–27, add a message
7. **Logout** and login back as `testuser`
8. **Dashboard → Incoming Requests** — Click "Approve" on the request
9. Back as `suresh`, **Dashboard → My Borrow Requests** — Status shows "approved" ✅
10. Try booking same dates again as another user → Server blocks with overlap error ✅

---

## 🎨 Tech Stack Summary

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js 18 + Vite 6             |
| Routing    | React Router DOM v7              |
| HTTP       | Axios                             |
| Styling    | Custom CSS (Glassmorphism theme) |
| Backend    | Node.js + Express.js             |
| Auth       | JWT + bcryptjs                   |
| Storage    | JSON flat-file database           |

---

*VillageShare – B.Tech Mini Project 2026 | Computer Science & Engineering*
