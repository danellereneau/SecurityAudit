# Deployment Guide - Subscription Manager

This guide covers multiple deployment options from quick preview to full production.

---

## 🚀 Quick Start Options

### Option 1: Frontend-Only Preview (5 minutes)

**Best for:** Quick UI demonstration without backend functionality

#### Deploy to Vercel (Recommended - Easiest)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy from frontend directory:**
   ```bash
   cd frontend
   vercel
   ```

3. **Follow prompts:**
   - Login/signup to Vercel
   - Confirm project settings
   - Deploy!

**Result:** You'll get a live URL like `https://subscription-manager-xyz.vercel.app`

#### Deploy to Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   cd frontend
   netlify deploy --prod
   ```

3. **Or use Netlify Drop:**
   - Build locally: `npm run build`
   - Visit [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag the `build` folder

---

### Option 2: Full-Stack Deployment (30-60 minutes)

**Best for:** Complete application with database and backend API

---

## 🔥 Recommended: Render.com (Free Tier Available)

Render provides free hosting for both frontend and backend with PostgreSQL.

### Step 1: Prepare the Application

Create deployment configuration files:

#### Backend - Create `render.yaml`:

Already in root directory (see below).

#### Backend - Update `package.json` scripts:

Make sure your `backend/package.json` has:
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "postinstall": "prisma generate"
  }
}
```

### Step 2: Deploy to Render

1. **Push your code to GitHub** (already done!)

2. **Sign up at [render.com](https://render.com)**

3. **Create a new Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repo: `danellereneau/SecurityAudit`
   - Branch: `claude/subscription-manager-app-HWrTC`

4. **Configure Backend Service:**
   - **Name:** `subscription-manager-api`
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

5. **Add Environment Variables:**
   ```
   DATABASE_URL=<will be provided by Render PostgreSQL>
   JWT_SECRET=<generate a random string>
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=<your frontend URL - will get this after deploying frontend>
   ```

6. **Create PostgreSQL Database:**
   - Click "New +" → "PostgreSQL"
   - **Name:** `subscription-manager-db`
   - **Database:** `subscription_manager`
   - **User:** `postgres`
   - **Instance Type:** Free
   - Copy the Internal Database URL

7. **Update Backend Environment Variables:**
   - Add the `DATABASE_URL` from step 6
   - Click "Save"

8. **Run Database Migration:**
   - In Render dashboard, go to your web service
   - Shell tab → Run:
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

9. **Deploy Frontend:**
   - Click "New +" → "Static Site"
   - Connect same GitHub repo
   - **Name:** `subscription-manager-app`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

10. **Add Frontend Environment Variable:**
    ```
    REACT_APP_API_BASE_URL=<your backend URL from step 4>/api/v1
    ```

11. **Update Backend CORS:**
    - Go back to backend service environment variables
    - Update `CORS_ORIGIN` with your frontend URL
    - Redeploy

**Result:** Full-stack app live on Render!
- Frontend: `https://subscription-manager-app.onrender.com`
- Backend: `https://subscription-manager-api.onrender.com`

---

## 🐳 Docker Deployment (Advanced)

### Option 3: Deploy with Docker

Create Docker configurations for containerized deployment.

---

## ☁️ Other Deployment Platforms

### Railway.app (Easy Full-Stack)

1. **Sign up at [railway.app](https://railway.app)**
2. **New Project** → Deploy from GitHub
3. **Add PostgreSQL** from Railway marketplace
4. **Configure services** similar to Render steps above

### Heroku (Paid Only Now)

1. **Install Heroku CLI**
2. **Create app:** `heroku create subscription-manager-api`
3. **Add PostgreSQL:** `heroku addons:create heroku-postgresql:mini`
4. **Deploy:** `git push heroku main`

### AWS/GCP/Azure (Production-Grade)

Full cloud deployment with:
- **Frontend:** S3 + CloudFront (AWS) or Cloud Storage + CDN (GCP)
- **Backend:** EC2, ECS, or Lambda (AWS) or App Engine (GCP)
- **Database:** RDS PostgreSQL (AWS) or Cloud SQL (GCP)

---

## 🎯 Recommended Path

**For Quick Preview:**
```
Frontend → Vercel (5 min)
Backend → Mock data in frontend
```

**For Full Demo:**
```
Full Stack → Render.com (Free, 30-60 min)
Both frontend + backend + database
```

**For Production:**
```
Containerized → Docker + Cloud provider
CI/CD pipeline with GitHub Actions
```

---

## 📝 Pre-Deployment Checklist

Before deploying, ensure:

### Backend:
- [ ] `.env.example` is complete (don't commit `.env`)
- [ ] `PORT` uses `process.env.PORT || 5000`
- [ ] CORS configured for your frontend URL
- [ ] Database migrations are ready
- [ ] Seed data script works

### Frontend:
- [ ] API URL uses environment variable
- [ ] Build runs successfully: `npm run build`
- [ ] No hardcoded localhost URLs
- [ ] Environment variables configured

### Database:
- [ ] PostgreSQL 14+ available
- [ ] Migrations tested
- [ ] Seed data loads correctly

---

## 🔧 Environment Variables Reference

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ENABLE_CRON=true
```

### Frontend (.env)
```bash
REACT_APP_API_BASE_URL=https://your-backend.com/api/v1
REACT_APP_ENV=production
```

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` format
- Ensure database is accessible from deployment platform
- Verify PostgreSQL version compatibility

### "CORS error"
- Update `CORS_ORIGIN` in backend to match frontend URL
- Include protocol (https://)
- Redeploy backend after change

### "Module not found"
- Run `npm install` in correct directory
- Check `package.json` dependencies
- Clear build cache and rebuild

### "Prisma Client not generated"
- Add to build command: `npx prisma generate`
- Or add to `package.json` postinstall script

### "Port already in use"
- Ensure using `process.env.PORT`
- Check deployment platform port assignment

---

## 🚀 Quick Commands

### Local Development
```bash
# Backend
cd backend
npm install
npx prisma migrate dev
npm run seed
npm run dev

# Frontend
cd frontend
npm install
npm start
```

### Build for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Deploy to Vercel (Frontend)
```bash
cd frontend
vercel --prod
```

### Deploy to Render
Push to GitHub → Render auto-deploys from branch

---

## 📊 Cost Comparison

| Platform | Frontend | Backend | Database | Total/Month |
|----------|----------|---------|----------|-------------|
| **Vercel + Render** | Free | Free | Free | $0 |
| **Netlify + Railway** | Free | Free | Free | $0 |
| **Vercel + Heroku** | Free | $7 | Included | $7 |
| **AWS (EC2 + RDS)** | ~$5 | ~$10 | ~$15 | ~$30 |

**Free Tier Limitations:**
- Render: Server sleeps after 15 min inactivity (cold start ~30s)
- Railway: 500 hours/month, $5 credit
- Vercel: Unlimited for personal projects

---

## 🎓 Next Steps After Deployment

1. **Test all features** in production environment
2. **Monitor errors** with logging service (Sentry, LogRocket)
3. **Set up CI/CD** with GitHub Actions
4. **Add domain name** (optional)
5. **Enable HTTPS** (usually automatic on these platforms)
6. **Set up database backups**
7. **Monitor performance** and optimize

---

## 🔗 Useful Links

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Railway Docs:** https://docs.railway.app
- **Netlify Docs:** https://docs.netlify.com
- **Prisma Deployment:** https://www.prisma.io/docs/guides/deployment

---

## Need Help?

If you encounter issues:
1. Check deployment logs on platform dashboard
2. Review environment variables
3. Test locally first with production build
4. Check platform-specific documentation
5. Verify database connection and migrations
