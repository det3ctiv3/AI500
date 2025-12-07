# Deployment Guide

## Overview

This guide covers deploying FieldScore AI to production servers and connecting a custom domain.

## Architecture

```
Frontend (Netlify/Vercel) → Backend API (Railway/Render) → Database (Optional)
         ↓
    Custom Domain
```

## Part 1: Deploy Backend API

### Option A: Railway (Recommended)

**Step 1: Prepare for Deployment**

Create `Procfile` in project root:
```
web: uvicorn api:app --host 0.0.0.0 --port $PORT
```

Create `runtime.txt`:
```
python-3.11.0
```

Update `requirements.txt`:
```
fastapi==0.104.0
uvicorn[standard]==0.24.0
pydantic==2.5.0
numpy==1.26.0
joblib==1.3.2
openai==1.3.0
scikit-learn==1.3.0
xgboost==2.0.0
python-multipart==0.0.6
```

**Step 2: Deploy to Railway**

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Python and installs dependencies
6. Your API will be live at: `https://your-app.railway.app`

**Step 3: Configure Environment Variables**

In Railway dashboard:
- Click your project → Variables
- Add: `PORT=8000` (Railway provides this automatically)
- Add: `OPENAI_API_KEY=your-key-here`

**Step 4: Get API URL**

Copy the deployment URL: `https://your-app-name.up.railway.app`

### Option B: Render

1. Go to https://render.com
2. Sign up and click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: fieldscore-api
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`
5. Add environment variable: `OPENAI_API_KEY`
6. Click "Create Web Service"

Your API URL: `https://fieldscore-api.onrender.com`

### Option C: DigitalOcean App Platform

1. Create account at https://cloud.digitalocean.com
2. Click "Create" → "Apps"
3. Connect GitHub repository
4. Configure build settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Run Command**: `uvicorn api:app --host 0.0.0.0 --port 8080`
5. Choose $5/month plan
6. Deploy

## Part 2: Deploy Frontend

### Option A: Netlify (Easiest)

**Method 1: Drag and Drop**

1. Go to https://app.netlify.com/drop
2. Drag your project folder (or just `index.html` and `assets/`)
3. Get URL: `https://random-name.netlify.app`

**Method 2: Git Integration**

1. Push code to GitHub
2. Go to https://app.netlify.com
3. Click "Add new site" → "Import an existing project"
4. Connect GitHub and select repository
5. Configure:
   - **Build command**: (leave empty)
   - **Publish directory**: `.` or `/`
6. Click "Deploy site"

**Update API URL in Frontend**

Edit `assets/js/main.js`:
```javascript
// Change from:
const API_URL = 'http://localhost:8000';

// To your Railway/Render URL:
const API_URL = 'https://your-app.railway.app';
```

Commit and push changes. Netlify auto-deploys.

### Option B: Vercel

1. Install Vercel CLI:
```powershell
npm install -g vercel
```

2. Deploy:
```powershell
cd "c:\Users\user\Desktop\Work Projects\AI500"
vercel
```

3. Follow prompts, get URL: `https://your-app.vercel.app`

### Option C: GitHub Pages (Free)

1. Create `.nojekyll` file in project root
2. Push to GitHub
3. Go to repository Settings → Pages
4. Source: Deploy from branch `main` → `/root`
5. Save and wait 2-3 minutes
6. URL: `https://det3ctiv3.github.io/AI500`

## Part 3: Connect Custom Domain

### Buy Domain

**Recommended Registrars:**
- Namecheap: https://www.namecheap.com (~$10/year)
- Google Domains: https://domains.google (~$12/year)
- GoDaddy: https://www.godaddy.com (~$15/year)

Example: Buy `fieldscore.ai` or `fieldscore.com`

### Connect Domain to Netlify

**Step 1: Add Domain in Netlify**

1. Go to your Netlify site dashboard
2. Click "Domain settings"
3. Click "Add custom domain"
4. Enter your domain: `fieldscore.ai`
5. Click "Verify"

**Step 2: Configure DNS**

Go to your domain registrar (Namecheap/Google):

**Option A: Use Netlify DNS (Recommended)**

1. In Netlify, copy nameservers:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```

2. In domain registrar, update nameservers to Netlify's
3. Wait 24-48 hours for DNS propagation

**Option B: Use Custom DNS**

Add these records in your domain registrar:

| Type | Name | Value |
|------|------|-------|
| A | @ | 75.2.60.5 |
| CNAME | www | your-site.netlify.app |

**Step 3: Enable HTTPS**

1. In Netlify → Domain settings
2. Click "HTTPS" → "Verify DNS configuration"
3. Click "Provision certificate"
4. Wait 5-10 minutes for SSL activation

Your site is now live at: `https://fieldscore.ai`

### Connect Domain to Vercel

1. Go to Vercel project dashboard
2. Click "Settings" → "Domains"
3. Enter domain: `fieldscore.ai`
4. Vercel provides DNS records:
   ```
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
   ```
5. Add these records to your domain registrar
6. Wait for verification (5-30 minutes)

### Connect Subdomain for API

**For Railway:**

1. Railway dashboard → Settings → Domains
2. Click "Generate Domain" (free .railway.app domain)
3. Or add custom domain: `api.fieldscore.ai`
4. Add CNAME record in domain registrar:
   ```
   CNAME  api  your-app.up.railway.app
   ```

**For Render:**

1. Render dashboard → Settings
2. Click "Add Custom Domain"
3. Enter: `api.fieldscore.ai`
4. Add CNAME record:
   ```
   CNAME  api  fieldscore-api.onrender.com
   ```

## Part 4: Update Configuration

### Update Frontend API URL

Edit `assets/js/main.js`:

```javascript
// Production API URL
const API_URL = 'https://api.fieldscore.ai';
// or
const API_URL = 'https://your-app.railway.app';
```

### Update CORS Settings

Edit `api.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://fieldscore.ai",
        "https://www.fieldscore.ai",
        "http://localhost:3000"  # Keep for local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Part 5: Environment Variables

### Backend (Railway/Render)

Add these environment variables in platform dashboard:

```
PORT=8000
OPENAI_API_KEY=sk-proj-your-key-here
ENVIRONMENT=production
```

### Frontend (Netlify/Vercel)

For security, move API key to backend. Create proxy endpoint:

**In `api.py`, add:**

```python
@app.post("/chat")
async def chat_endpoint(message: str):
    """Proxy endpoint for OpenAI API"""
    import openai
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are FieldScore AI assistant..."},
            {"role": "user", "content": message}
        ]
    )
    
    return {"reply": response.choices[0].message.content}
```

**In `assets/js/main.js`, update:**

```javascript
async function getChatbotResponse(userMessage) {
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });
        
        const data = await response.json();
        return data.reply;
    } catch (error) {
        return getFallbackResponse(userMessage);
    }
}
```

## Complete Deployment Checklist

**Backend**
- [ ] Create Procfile and runtime.txt
- [ ] Update requirements.txt with all dependencies
- [ ] Deploy to Railway/Render
- [ ] Add OPENAI_API_KEY environment variable
- [ ] Test API endpoint: `https://your-api.railway.app/docs`
- [ ] Configure CORS with production domain

**Frontend**
- [ ] Update API_URL in main.js to production backend
- [ ] Remove or secure OpenAI API key (use backend proxy)
- [ ] Deploy to Netlify/Vercel
- [ ] Test all features (demo form, chatbot)

**Domain**
- [ ] Purchase domain from registrar
- [ ] Add custom domain to Netlify/Vercel
- [ ] Update DNS records (A or CNAME)
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Enable HTTPS/SSL certificate
- [ ] Test: https://yourdomain.com
- [ ] Add subdomain for API: api.yourdomain.com

**Security**
- [ ] Move API keys to environment variables
- [ ] Enable HTTPS on all endpoints
- [ ] Configure CORS properly
- [ ] Add rate limiting (optional)
- [ ] Set up error monitoring (Sentry)

## Estimated Costs

**Free Tier (Suitable for Demo)**
- Frontend: Netlify/Vercel (Free)
- Backend: Railway ($5/month) or Render (Free tier)
- Domain: $10-15/year
- OpenAI API: ~$0.10/day for light usage

**Total: ~$5-10/month + $10-15/year domain**

**Production Tier**
- Frontend: Netlify Pro ($19/month)
- Backend: Railway Pro ($20/month)
- Database: PostgreSQL on Railway ($5/month)
- Domain: $10-15/year
- OpenAI API: $20-50/month

**Total: ~$64-94/month**

## Testing Deployment

1. Test API directly: `https://your-api.railway.app/docs`
2. Test frontend: `https://fieldscore.ai`
3. Test demo form submission
4. Test chatbot functionality
5. Check browser console for errors (F12)
6. Test on mobile devices
7. Verify HTTPS certificate (green padlock)

## Troubleshooting

**API not responding:**
- Check Railway/Render logs
- Verify environment variables set
- Test endpoint directly: `/docs`

**CORS errors:**
- Update CORS origins in api.py
- Redeploy backend

**Domain not working:**
- Wait 24-48 hours for DNS propagation
- Check DNS records with: https://dnschecker.org
- Verify nameservers updated

**SSL certificate issues:**
- Wait 10-30 minutes after DNS verification
- Re-provision certificate in Netlify/Vercel

## Support Resources

- Railway Docs: https://docs.railway.app
- Netlify Docs: https://docs.netlify.com
- Vercel Docs: https://vercel.com/docs
- FastAPI Deployment: https://fastapi.tiangolo.com/deployment

## Quick Deploy Commands

```powershell
# 1. Push to GitHub
cd "c:\Users\user\Desktop\Work Projects\AI500"
git init
git add .
git commit -m "Initial deployment"
git remote add origin https://github.com/det3ctiv3/AI500.git
git push -u origin main

# 2. Deploy backend (Railway CLI)
railway login
railway init
railway up

# 3. Deploy frontend (Vercel CLI)
vercel --prod
```

Your application is now live!
