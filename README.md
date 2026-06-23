# AutoTrade – DBMS Project Setup Guide
## Bahria University | DBMS LAB Spring-2026
### Members: Muhammad Roman (046) | Mohammad Armaghan Khan (052) | Muhammad Fahad Khan (054)

---

## 📁 PROJECT STRUCTURE (Files You Have)

```
AutoTrade_DBMS/
│
├── database/
│   ├── 01_create_tables.sql   ← Run this FIRST in Oracle SQL Developer
│   ├── 02_insert_data.sql     ← Run this SECOND (adds sample data)
│   └── 03_queries.sql         ← All SELECT, JOIN, UPDATE, DELETE queries
│
├── backend/
│   ├── server.js              ← Node.js server (connects Oracle ↔ Frontend)
│   └── package.json           ← Lists required packages
│
└── frontend/
    ├── index.html             ← Your original HTML (updated to include db-api.js)
    ├── styles.css             ← Your original CSS (unchanged)
    ├── script.js              ← Your original JavaScript (unchanged)
    └── db-api.js              ← NEW: connects frontend to Oracle through server.js
```

---

## ✅ STEP 1: Set Up Oracle SQL Developer

### A. Open Oracle SQL Developer
- Open Oracle SQL Developer on your computer
- Connect using your credentials (username: `system`, password: whatever you set during Oracle install)

### B. Run the SQL files IN ORDER

**Step B1 – Create Tables:**
1. Click **File → Open** → select `database/01_create_tables.sql`
2. Press **F5** or click the green ▶ Run Script button
3. You should see: `Table created` message for each of 5 tables

**Step B2 – Insert Sample Data:**
1. Click **File → Open** → select `database/02_insert_data.sql`
2. Press **F5** to run
3. You should see row counts: Users=3, Categories=2, Locations=9, Vehicles=10, Listings=10

**Step B3 – Test Queries:**
1. Click **File → Open** → select `database/03_queries.sql`
2. You can run individual queries by selecting them and pressing **F9**
3. Try the JOIN query in Section B4 to see all vehicle data combined

---

## ✅ STEP 2: Install Node.js (if not already installed)

1. Go to https://nodejs.org
2. Download and install the **LTS version** (e.g., 20.x)
3. Verify: open Command Prompt and type:
   ```
   node --version
   npm --version
   ```
   Both should show version numbers.

---

## ✅ STEP 3: Configure the Backend (server.js)

Open `backend/server.js` in any text editor (Notepad, VS Code, etc.)

Find these lines near the top:

```javascript
const dbConfig = {
    user        : 'your_oracle_username',   // ← CHANGE THIS
    password    : 'your_oracle_password',   // ← CHANGE THIS
    connectString: 'localhost/XE'           // ← Usually correct for Oracle XE
};
```

**Change them to your actual Oracle credentials**, for example:
```javascript
const dbConfig = {
    user        : 'system',
    password    : 'oracle123',
    connectString: 'localhost/XE'
};
```

> **Note:** If you're using Oracle 21c or newer, try `'localhost/XEPDB1'` instead of `'localhost/XE'`

---

## ✅ STEP 4: Install Backend Packages & Start Server

1. Open **Command Prompt** (or Terminal)
2. Navigate to your backend folder:
   ```
   cd path\to\AutoTrade_DBMS\backend
   ```
   Example:
   ```
   cd C:\Users\YourName\Desktop\AutoTrade_DBMS\backend
   ```
3. Install required packages:
   ```
   npm install
   ```
   This installs: express, oracledb, cors (takes 1-2 minutes)

4. Start the server:
   ```
   node server.js
   ```
5. You should see:
   ```
   ✅ AutoTrade server running at http://localhost:3000
   ```

> **Keep this Command Prompt window open while using the project!**

---

## ✅ STEP 5: Open the Frontend

1. Open your browser (Chrome recommended)
2. Go to: **http://localhost:3000**
3. The AutoTrade website should load with **real data from Oracle DB**!

---

## 🔄 HOW IT ALL CONNECTS (Simple Explanation)

```
[Oracle SQL Developer]
        ↓  (stores data in tables)
    Oracle Database
        ↓  (oracledb npm package reads it)
    server.js  ←→  http://localhost:3000/api/...
        ↓  (fetch() calls from browser)
    db-api.js
        ↓  (passes data to)
    script.js + index.html  ← what the user sees
```

**In plain English:**
- Oracle holds all the data (users, vehicles, listings)
- `server.js` is a middleman that talks to Oracle and gives data to the website
- `db-api.js` is the glue that connects your original website to server.js
- Your original `index.html`, `styles.css`, `script.js` stay mostly the same!

---

## 🗄️ DATABASE TABLES SUMMARY

| Table | What it stores | Key Columns |
|-------|---------------|-------------|
| **Users** | Registered users | user_id, name, email, password, phone |
| **Categories** | Car or Bike | category_id, category_name |
| **Locations** | Cities with coordinates | location_id, city, latitude, longitude |
| **Vehicles** | Vehicle listings | vehicle_id, title, price, brand, user_id (FK) |
| **Listings** | Posting status | listing_id, vehicle_id (FK), status, post_date |

---

## 🔗 API ENDPOINTS (What server.js provides)

| Method | URL | What it does |
|--------|-----|-------------|
| GET | /api/vehicles | Get all active listings |
| GET | /api/vehicles/:id | Get one vehicle |
| POST | /api/vehicles | Add new vehicle |
| PUT | /api/vehicles/:id | Update vehicle |
| DELETE | /api/vehicles/:id | Delete vehicle |
| POST | /api/login | Login user |
| POST | /api/register | Register new user |
| GET | /api/categories | Get all categories |
| GET | /api/locations | Get all cities |

---

## ⚠️ COMMON ERRORS & FIXES

| Error | Fix |
|-------|-----|
| `ORA-01017: invalid username/password` | Check dbConfig in server.js |
| `ORA-12541: no listener` | Start Oracle service: Windows Services → OracleServiceXE → Start |
| `Cannot find module 'oracledb'` | Run `npm install` in backend folder |
| `ECONNREFUSED localhost:3000` | Start server: `node server.js` |
| Page loads but no vehicles | Check Oracle connection, server must be running |
| `ORA-00001: unique constraint` | Email already exists in Users table |

---

## 📝 FOR YOUR DBMS LAB REPORT

Your project demonstrates:
- ✅ **Relational Schema**: 5 normalized tables with PK/FK constraints
- ✅ **Normalization**: 1NF, 2NF, 3NF applied
- ✅ **CRUD Operations**: INSERT, SELECT, UPDATE, DELETE
- ✅ **JOIN Queries**: Multi-table joins (see Section B in 03_queries.sql)
- ✅ **Frontend Integration**: Oracle DB → Node.js → HTML/CSS/JS
- ✅ **Persistent Storage**: Data survives browser refresh (stored in Oracle)

---

*AutoTrade DBMS Project | Bahria University, Islamabad | Spring 2026*
