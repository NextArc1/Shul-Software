# Shul Display - Production Deployment Guide

Complete guide to deploying Shul Display on a DigitalOcean $6/month droplet using Docker.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Server Setup](#initial-server-setup)
3. [Security Setup (UFW Firewall)](#security-setup)
4. [Domain and Cloudflare Setup](#domain-and-cloudflare-setup)
5. [Application Deployment](#application-deployment)
6. [SSL Certificate Setup](#ssl-certificate-setup)
7. [Database Backups](#database-backups)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)
9. [Scaling Guide](#scaling-guide)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### What You Need:
- ✅ DigitalOcean account
- ✅ Domain name (e.g., shulschedule.com)
- ✅ Cloudflare account (free tier is fine)
- ✅ Git repository with your code (GitHub/GitLab)

---

## Initial Server Setup

### Step 1: Create DigitalOcean Droplet

1. Log into DigitalOcean
2. Create new Droplet:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic - $6/month (1GB RAM, 1 vCPU, 25GB SSD)
   - **Datacenter**: Choose closest to your users
   - **Authentication**: SSH Key (recommended) or Password
   - **Hostname**: shul-display

3. Wait for droplet to be created and note the IP address

### Step 2: Connect to Your Server

```bash
ssh root@YOUR_DROPLET_IP
```

### Step 3: Install Docker and Docker Compose

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Verify installations
docker --version
docker-compose --version

# Enable Docker to start on boot
systemctl enable docker
```

---

## Security Setup

### Configure UFW Firewall

```bash
# Install UFW (usually pre-installed on Ubuntu)
apt install ufw -y

# Set default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (IMPORTANT: Do this BEFORE enabling UFW!)
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status verbose
```

**Expected output:**
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                     ALLOW       Anywhere
```

---

## Domain and Cloudflare Setup

### Step 1: Point Domain to DigitalOcean

1. Log into your domain registrar
2. Change nameservers to Cloudflare's:
   ```
   anya.ns.cloudflare.com
   doug.ns.cloudflare.com
   ```

### Step 2: Configure Cloudflare DNS

1. Log into Cloudflare
2. Add your domain
3. Add DNS records:

| Type  | Name          | Content          | Proxy Status |
|-------|---------------|------------------|--------------|
| A     | @             | YOUR_DROPLET_IP  | Proxied      |
| A     | www           | YOUR_DROPLET_IP  | Proxied      |

4. SSL/TLS Settings:
   - Go to SSL/TLS tab
   - Set encryption mode to **"Full (strict)"**
   - Enable **"Always Use HTTPS"**

### Benefits of Cloudflare:
- ✅ Free CDN (faster loading worldwide)
- ✅ DDoS protection
- ✅ Free SSL certificate
- ✅ Caching (reduces server load)

---

## Application Deployment

### Step 1: Clone Your Repository

```bash
cd /root
git clone https://github.com/YOUR_USERNAME/Shul-Software.git
cd Shul-Software
```

### Step 2: Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit with your actual values
nano .env
```

**Required variables to update:**
```env
# Generate new SECRET_KEY
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(50))")

# Set your domain
ALLOWED_HOSTS=shulschedule.com,www.shulschedule.com
SITE_URL=https://shulschedule.com
CORS_ALLOWED_ORIGINS=https://shulschedule.com,https://www.shulschedule.com

# Database (use strong passwords!)
DB_NAME=shul_display
DB_USER=shul_user
DB_PASSWORD=CHANGE_THIS_TO_STRONG_PASSWORD

# Email configuration (use Gmail App Password)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password
DEFAULT_FROM_EMAIL=noreply@shulschedule.com
FEEDBACK_EMAIL=feedback@shulschedule.com
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

### Step 3: Update Nginx Configuration

```bash
# Edit nginx config with your domain
nano nginx/conf.d/default.conf
```

Replace all instances of `yourdomain.com` with your actual domain.

### Step 4: Build React Frontend

```bash
cd frontend

# Build production React app
npm install
npm run build

# Verify build folder exists
ls -la build/
```

### Step 5: Start Docker Containers

```bash
cd /root/Shul-Software

# Build and start all containers
docker-compose up -d --build

# Check if all containers are running
docker-compose ps
```

**Expected output:**
```
NAME                  STATUS              PORTS
shul_nginx            Up                  0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
shul_django           Up                  8000/tcp
shul_postgres         Up (healthy)        5432/tcp
shul_redis            Up (healthy)        6379/tcp
shul_celery_worker    Up
shul_celery_beat      Up
```

### Step 6: Run Django Migrations

```bash
# Run database migrations
docker-compose exec django python manage.py migrate

# Create superuser (admin account)
docker-compose exec django python manage.py createsuperuser

# Collect static files
docker-compose exec django python manage.py collectstatic --noinput
```

---

## SSL Certificate Setup

### Option 1: Using Certbot (Let's Encrypt)

```bash
# Install Certbot
apt install certbot -y

# Stop nginx temporarily
docker-compose stop nginx

# Get SSL certificate
certbot certonly --standalone \
  -d shulschedule.com \
  -d www.shulschedule.com \
  --email your-email@gmail.com \
  --agree-tos \
  --no-eff-email

# Restart nginx
docker-compose start nginx

# Auto-renewal (runs twice daily)
systemctl enable certbot.timer
systemctl start certbot.timer
```

### Option 2: Using Cloudflare (Easier)

If you're using Cloudflare with "Full (strict)" SSL mode, you can generate an origin certificate:

1. Go to Cloudflare Dashboard → SSL/TLS → Origin Server
2. Create Certificate
3. Save the certificate and key to:
   - `/etc/letsencrypt/live/yourdomain.com/fullchain.pem`
   - `/etc/letsencrypt/live/yourdomain.com/privkey.pem`

---

## Database Backups

### Setup Automated Daily Backups

```bash
# Make scripts executable
chmod +x /root/Shul-Software/scripts/backup-database.sh
chmod +x /root/Shul-Software/scripts/restore-database.sh

# Test backup manually
/root/Shul-Software/scripts/backup-database.sh

# Add to crontab for daily backups at 2 AM
crontab -e
```

Add this line:
```cron
0 2 * * * /root/Shul-Software/scripts/backup-database.sh >> /var/log/shul-backup.log 2>&1
```

### Restore from Backup

```bash
# List available backups
ls -lht /root/Shul-Software/backups/

# Restore specific backup
/root/Shul-Software/scripts/restore-database.sh /root/Shul-Software/backups/shul_display_backup_YYYYMMDD_HHMMSS.sql.gz
```

---

## Monitoring and Maintenance

### View Logs

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs django
docker-compose logs nginx
docker-compose logs celery_worker

# Last 100 lines
docker-compose logs --tail=100 django
```

### Check Service Health

```bash
# Check all containers
docker-compose ps

# Check resource usage
docker stats

# Check disk space
df -h
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart django
docker-compose restart nginx

# Full rebuild (after code changes)
docker-compose down
docker-compose up -d --build
```

### Update Application

```bash
cd /root/Shul-Software

# Pull latest code
git pull

# Rebuild frontend
cd frontend
npm run build
cd ..

# Rebuild and restart containers
docker-compose down
docker-compose up -d --build

# Run any new migrations
docker-compose exec django python manage.py migrate
docker-compose exec django python manage.py collectstatic --noinput
```

---

## Scaling Guide

### When to Upgrade

**Upgrade to $12 Droplet (2GB RAM) when:**
- You have 30-50 shuls
- Memory usage consistently >80%
- Database queries slow down

**Add Managed Database ($7/month) when:**
- You have 75-100 shuls
- Database becomes bottleneck
- Need better backup/recovery

**Upgrade to $18 Droplet (4GB RAM) when:**
- You have 100-150 shuls
- CPU usage consistently >70%

### Resize Droplet (No Downtime Method)

1. DigitalOcean Dashboard → Droplets
2. Select droplet → Resize
3. Choose new plan
4. Wait for resize (5-10 minutes)
5. Server automatically reboots

---

## Troubleshooting

### Site Not Loading

```bash
# Check if nginx is running
docker-compose ps nginx

# Check nginx logs
docker-compose logs nginx

# Restart nginx
docker-compose restart nginx
```

### 502 Bad Gateway Error

```bash
# Check if Django is running
docker-compose ps django

# Check Django logs
docker-compose logs django

# Restart Django
docker-compose restart django
```

### Database Connection Errors

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Celery Tasks Not Running

```bash
# Check celery worker
docker-compose logs celery_worker

# Check celery beat
docker-compose logs celery_beat

# Restart celery services
docker-compose restart celery_worker celery_beat
```

### Out of Disk Space

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a

# Clean up old logs
journalctl --vacuum-time=7d

# Remove old backups manually
rm /root/Shul-Software/backups/shul_display_backup_OLD*.sql.gz
```

### High Memory Usage

```bash
# Check what's using memory
docker stats

# Restart all services to clear memory
docker-compose restart
```

---

## Security Checklist

- ✅ UFW firewall enabled (ports 22, 80, 443 only)
- ✅ SSH key authentication (disable password login)
- ✅ Strong database password in .env
- ✅ DEBUG=False in production
- ✅ New SECRET_KEY generated
- ✅ SSL certificate installed
- ✅ Cloudflare proxy enabled
- ✅ Automated database backups configured
- ✅ Regular system updates (`apt update && apt upgrade`)

---

## Quick Reference Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart everything
docker-compose restart

# Update application
git pull && docker-compose up -d --build

# Backup database
/root/Shul-Software/scripts/backup-database.sh

# Django shell
docker-compose exec django python manage.py shell

# Create Django admin user
docker-compose exec django python manage.py createsuperuser
```

---

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Review this guide
- Check application health: `docker-compose ps`

---

**Deployment completed! Your Shul Display application is now live at https://yourdomain.com** 🎉
