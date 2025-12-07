# Single Server Deployment Guide

## Deploy Both Frontend and Backend on One Server

This guide shows how to host everything on a single VPS (Virtual Private Server) with your custom domain.

## Option 1: DigitalOcean Droplet (Recommended)

**Cost:** $6/month (1GB RAM, 25GB SSD)

### Step 1: Create Server

1. Go to https://www.digitalocean.com
2. Sign up and add payment method
3. Create → Droplets
4. Choose:
   - **Image:** Ubuntu 22.04 LTS
   - **Plan:** Basic ($6/month)
   - **Datacenter:** Closest to your users
   - **Authentication:** SSH key or password
5. Create Droplet
6. Note your server IP: `123.45.67.89`

### Step 2: Connect to Server

```powershell
# Using SSH
ssh root@123.45.67.89
```

### Step 3: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Python
apt install python3 python3-pip -y

# Install Nginx (web server)
apt install nginx -y

# Install Certbot (for SSL)
apt install certbot python3-certbot-nginx -y
```

### Step 4: Upload Your Project

**From your local machine:**

```powershell
# Using SCP (replace with your server IP)
scp -r "c:\Users\user\Desktop\Work Projects\AI500" root@123.45.67.89:/var/www/
```

**Or clone from GitHub:**

```bash
# On server
cd /var/www
git clone https://github.com/det3ctiv3/AI500.git
cd AI500
```

### Step 5: Setup Backend API

```bash
# Navigate to project
cd /var/www/AI500

# Install Python dependencies
pip3 install -r requirements.txt

# Create environment file
nano .env
```

Add this content:
```
OPENAI_API_KEY=sk-proj-your-key-here
ENVIRONMENT=production
```

Save and exit (Ctrl+X, Y, Enter)

**Create systemd service for auto-start:**

```bash
nano /etc/systemd/system/fieldscore-api.service
```

Add this content:
```ini
[Unit]
Description=FieldScore AI API
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/AI500
Environment="PATH=/usr/local/bin:/usr/bin:/bin"
ExecStart=/usr/bin/python3 -m uvicorn api:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Save and exit.

```bash
# Enable and start service
systemctl daemon-reload
systemctl enable fieldscore-api
systemctl start fieldscore-api

# Check status
systemctl status fieldscore-api
```

### Step 6: Configure Nginx (Web Server)

```bash
nano /etc/nginx/sites-available/fieldscore
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend - Serve static files
    location / {
        root /var/www/AI500;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API - Proxy to FastAPI
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static assets
    location /assets {
        root /var/www/AI500;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Save and exit.

```bash
# Enable site
ln -s /etc/nginx/sites-available/fieldscore /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 7: Update Frontend API URL

On your server:
```bash
nano /var/www/AI500/assets/js/main.js
```

Change:
```javascript
// From:
const API_URL = 'http://localhost:8000';

// To (same domain with /api prefix):
const API_URL = 'https://yourdomain.com/api';
```

Save and exit.

### Step 8: Connect Domain

**In your domain registrar (Namecheap/GoDaddy):**

Add DNS records:
```
Type   Name   Value
A      @      123.45.67.89  (your server IP)
A      www    123.45.67.89
```

Wait 5-30 minutes for DNS propagation.

Test: `http://yourdomain.com` (should show your website)

### Step 9: Enable HTTPS (SSL)

```bash
# Get free SSL certificate from Let's Encrypt
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose: Redirect HTTP to HTTPS (option 2)
```

Certbot automatically:
- Generates SSL certificate
- Updates Nginx config
- Sets up auto-renewal

Your site is now live at: `https://yourdomain.com`

### Step 10: Configure Firewall

```bash
# Allow SSH, HTTP, HTTPS
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

## Option 2: Shared Hosting (cPanel)

**Providers with Python support:**
- A2 Hosting ($3/month)
- HostGator ($3/month)
- Namecheap ($2/month)

**Limitations:**
- Limited Python version control
- No systemd services
- May not support FastAPI well
- Better for static sites only

**Setup (if hosting supports Python):**

1. Upload files via FTP/cPanel File Manager
2. Set up Python app in cPanel
3. Configure .htaccess for routing:

```apache
RewriteEngine On

# API routes
RewriteRule ^api/(.*)$ /cgi-bin/api.py/$1 [L]

# Frontend routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

## Option 3: Docker on VPS (Advanced)

**Create `docker-compose.yml`:**

```yaml
version: '3.8'

services:
  frontend:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend

  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    command: uvicorn api:app --host 0.0.0.0 --port 8000
```

**Create `Dockerfile`:**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Deploy:**

```bash
# On server
cd /var/www/AI500
docker-compose up -d
```

## Complete File Structure on Server

```
/var/www/AI500/
├── index.html
├── assets/
│   ├── css/styles.css
│   └── js/main.js
├── data/
├── docs/
├── api.py
├── requirements.txt
└── .env (environment variables)
```

## Maintenance Commands

**View API logs:**
```bash
journalctl -u fieldscore-api -f
```

**Restart API:**
```bash
systemctl restart fieldscore-api
```

**Restart Nginx:**
```bash
systemctl restart nginx
```

**Update code:**
```bash
cd /var/www/AI500
git pull
systemctl restart fieldscore-api
```

**Renew SSL (automatic, but manual command):**
```bash
certbot renew
```

## Monitoring

**Check if API is running:**
```bash
curl http://localhost:8000/docs
```

**Check Nginx status:**
```bash
systemctl status nginx
```

**View website:**
```bash
curl http://localhost
```

## Cost Comparison

### Single Server (VPS)
- DigitalOcean: $6/month
- Domain: $10-15/year
- **Total: $6/month + $15/year = ~$87/year**

### Separate Hosting (PaaS)
- Railway Backend: $5/month
- Netlify Frontend: Free
- Domain: $10-15/year
- **Total: $5/month + $15/year = ~$75/year**

### Shared Hosting
- A2/HostGator: $3-5/month (includes domain first year)
- **Total: $36-60/year**
- **Note:** May not support FastAPI properly

## Advantages of Single Server

**Pros:**
- Full control over environment
- No vendor lock-in
- Can host multiple projects
- Better performance (no external API calls)
- Learning experience with Linux

**Cons:**
- Need to manage server updates
- Responsible for security
- Need basic Linux knowledge
- Manual SSL renewal (though automated with certbot)

## Recommended Setup for Beginners

1. **Start with:** Railway (backend) + Netlify (frontend)
   - Easiest deployment
   - No server management
   - Free/cheap

2. **Move to VPS when:**
   - You need more control
   - Want to save costs at scale
   - Have multiple projects
   - Comfortable with Linux

## Security Checklist

- [ ] Enable firewall (ufw)
- [ ] Use SSH keys (disable password login)
- [ ] Keep system updated: `apt update && apt upgrade`
- [ ] Use strong passwords
- [ ] Enable fail2ban for brute-force protection
- [ ] Regular backups
- [ ] Monitor server resources
- [ ] Set up SSL certificate
- [ ] Use environment variables for secrets

## Backup Strategy

**Automated backup script:**

```bash
#!/bin/bash
# /root/backup.sh

BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup project files
tar -czf $BACKUP_DIR/fieldscore_$DATE.tar.gz /var/www/AI500

# Keep only last 7 backups
ls -t $BACKUP_DIR/*.tar.gz | tail -n +8 | xargs rm -f
```

**Setup cron job:**
```bash
crontab -e
```

Add:
```
0 2 * * * /root/backup.sh
```

This backs up daily at 2 AM.

## Quick Deployment Script

Save this as `deploy.sh` on your server:

```bash
#!/bin/bash

echo "Deploying FieldScore AI..."

# Navigate to project
cd /var/www/AI500

# Pull latest code
git pull

# Install dependencies
pip3 install -r requirements.txt

# Restart services
systemctl restart fieldscore-api
systemctl restart nginx

echo "Deployment complete!"
```

Make executable:
```bash
chmod +x deploy.sh
```

Run:
```bash
./deploy.sh
```

## Testing Deployment

1. **Test API directly:**
   ```bash
   curl https://yourdomain.com/api/docs
   ```

2. **Test frontend:**
   ```bash
   curl https://yourdomain.com
   ```

3. **Test full flow:**
   - Open browser: `https://yourdomain.com`
   - Click "Try Our Demo"
   - Submit form
   - Check chatbot

4. **Check SSL:**
   - Look for padlock in browser
   - Visit: `https://www.ssllabs.com/ssltest/`

## Troubleshooting

**API not responding:**
```bash
systemctl status fieldscore-api
journalctl -u fieldscore-api -n 50
```

**Nginx errors:**
```bash
nginx -t
tail -f /var/log/nginx/error.log
```

**Permission issues:**
```bash
chown -R www-data:www-data /var/www/AI500
chmod -R 755 /var/www/AI500
```

**Port already in use:**
```bash
lsof -i :8000
kill -9 <PID>
```

## Support Resources

- DigitalOcean Tutorials: https://www.digitalocean.com/community/tutorials
- Nginx Documentation: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/docs/
- Ubuntu Server Guide: https://ubuntu.com/server/docs

Your application is now running on a single server with your custom domain!
