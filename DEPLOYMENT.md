# 🚀 Deployment Guide: Clash of DSA

This guide walks you through deploying **Clash of DSA** for your final year project presentation and public access.

---

## 🌟 Method 1: Free Cloud Deployment (Recommended)

### 1. Database: MongoDB Atlas (Free M0 Cluster)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a free shared cluster (M0).
3. Under **Database Access**, create a database user (e.g., `clash_admin` with a password).
4. Under **Network Access**, add IP address `0.0.0.0/0` (allow access from anywhere).
5. Click **Connect** > **Drivers** and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/clash-of-dsa?retryWrites=true&w=majority
   ```

---

### 2. Backend: Render (Free Web Service)
1. Sign up / Log in to [Render](https://render.com) using your GitHub account.
2. Click **New +** -> **Web Service**.
3. Connect your repository: `https://github.com/vivek-1520/my-fiinal-project`.
4. Configure the service:
   - **Name**: `clash-of-dsa-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Under **Environment Variables**, add:
   - `PORT`: `5000`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `your_random_secure_jwt_secret_key`
   - `JUDGE0_URL`: `https://judge0-ce.p.rapidapi.com`
   - `JUDGE0_API_KEY`: `your_rapidapi_judge0_key`
6. Click **Deploy Web Service**.
7. Once deployed, run the seed script to populate DSA problems:
   - In Render dashboard, open the **Shell** tab and run:
     ```bash
     node seed.js
     ```
8. Copy your backend URL (e.g. `https://clash-of-dsa-backend.onrender.com`).

---

### 3. Frontend: Vercel (Free Frontend Hosting)
1. Sign up / Log in to [Vercel](https://vercel.com) using GitHub.
2. Click **Add New...** -> **Project**.
3. Import `vivek-1520/my-fiinal-project`.
4. Configure Project:
   - **Root Directory**: Click edit and select `frontend`.
   - **Framework Preset**: `Vite`.
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. (Optional) In `frontend/src/context/AuthContext.jsx` and API calls, if connecting across domains, set the backend URL or configure Vercel proxy.
6. Click **Deploy**. Your frontend is live!

---

## 🐳 Method 2: Single-Command Docker Deployment (VPS / Local)

If presenting on a virtual machine (DigitalOcean, AWS EC2, GCP) or locally with Docker:

```bash
# Clone the repository
git clone https://github.com/vivek-1520/my-fiinal-project.git
cd my-fiinal-project

# Launch MongoDB, Backend, and Frontend reverse-proxied via Nginx
docker compose up -d --build

# Populate DSA problems inside the backend container
docker exec -it clash_backend node seed.js
```

The app will immediately be accessible at `http://localhost` (or your server's public IP).
