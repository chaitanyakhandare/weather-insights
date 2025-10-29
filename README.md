# 🌦️ Weather Insights — Fullstack Weather & AI Insights App

A **fullstack web application** built with **Django (Backend)** and **React + Vite + TypeScript (Frontend)**.
It provides **real-time weather data**, **AI-generated weather reports**, and an elegant dashboard interface.

---

## 🧠 Project Overview

WeatherAI allows users to:

* 🌍 Add and manage cities
* 🌤️ Fetch **real-time weather data** using **WeatherAPI**
* 🤖 Generate **AI-powered weather insights** using **Gemini API**
* 💾 Store all data in a **Supabase PostgreSQL database**
* 📊 Visualize reports and weather stats in a modern UI

This project demonstrates **end-to-end fullstack development**, **REST API design**, and **frontend-backend integration**.

### Note: The backend is hosted on Render’s free tier, so it may take up to 1 minute to wake up after inactivity.

---

## 🗂️ Folder Structure

```
project-root/
├── backend/
│   ├── .venv/
│   ├── root/
│   ├── weather/
│   ├── .env
│   ├── .gitignore
│   ├── db.sqlite3
│   ├── manage.py
│   ├── Profile
│   ├── requirements.txt
│   └── .render-build.sh
│
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── index.html
```

---

## ⚙️ Backend Setup (Django)

### 1️⃣ Navigate to the backend folder

```bash
cd backend
```

### 2️⃣ Create and activate a virtual environment

**Windows:**

```bash
python -m venv .venv
.venv\Scripts\activate
```

**Mac/Linux:**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Create a `.env` file

### 5️⃣ Run migrations

```bash
python manage.py migrate
```

### 6️⃣ Start the Django development server

```bash
python manage.py runserver
```

Backend will start at → **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## 💻 Frontend Setup (React + Vite + TypeScript)

### 1️⃣ Navigate to the frontend folder

```bash
cd ../frontend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run the frontend server

```bash
npm run dev
```

Frontend will start at → **[http://localhost:5173](http://localhost:5173)**

---

## 🔗 Connecting Backend & Frontend

Make sure both servers are running:

* 🐍 **Django:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
* ⚛️ **React:** [http://localhost:5173](http://localhost:5173)

In `backend/root/settings.py`, ensure this is configured:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

---

## 🔑 Environment Variables

Create a `.env` file inside the **backend/** directory using the template below 👇

### `.env.example`

```env
# ========================
# 🔐 Django Configuration
# ========================
SECRET_KEY=your_django_secret_key_here
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

# ========================
# 🗄️ Database (Supabase PostgreSQL)
# ========================
DATABASE_URL=postgresql://postgres:yourpassword@yourproject.supabase.co:5432/postgres

# ========================
# 🌐 Supabase API
# ========================
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_KEY=your_supabase_service_role_key

# ========================
# ☀️ Weather API
# ========================
WEATHER_API_KEY=your_weatherapi_key_here

# ========================
# 🤖 Gemini AI API
# ========================
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🧩 Technologies Used

| Category     | Tools & Frameworks                   |
| ------------ | ------------------------------------ |
| **Frontend** | React, TypeScript, Vite, TailwindCSS |
| **Backend**  | Django, Django REST Framework        |
| **Database** | Supabase (PostgreSQL)                |
| **APIs**     | WeatherAPI, Google Gemini API        |
| **Language** | Python, JavaScript (TypeScript)      |

---

## 📦 API Endpoints (Backend)

| Method   | Endpoint                         | Description                     |
| -------- | -------------------------------- | ------------------------------- |
| `GET`    | `/getcities/`                    | Fetch all saved cities          |
| `POST`   | `/addcity/`                      | Add a new city                  |
| `DELETE` | `/deletecity/<id>/`              | Delete a city                   |
| `GET`    | `/fetch/?city=<city_name>`       | Fetch live weather data         |
| `GET`    | `/fetchreport/?city=<city_name>` | Get AI-generated weather report |

---

## 🧠 AI Weather Report

When a city is selected:

* Weather data is fetched from **WeatherAPI**
* Data is analyzed using **Gemini AI**
* Gemini generates a **natural-language weather insight**
* The frontend displays charts and the AI’s report elegantly

---

## 🧪 Testing Locally

### 🔍 Test the backend API

Visit:

```
http://127.0.0.1:8000/fetch/?city=London
```

### 🌐 Test the full app

Run both servers and open:

```
http://localhost:5173
```
