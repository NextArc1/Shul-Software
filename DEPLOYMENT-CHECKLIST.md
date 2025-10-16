# Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment

### Code Preparation
- [ ] All features tested locally
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Backend migrations created and tested
- [ ] All tests passing
- [ ] Code committed to Git
- [ ] `.env.example` updated with all required variables

### Infrastructure
- [ ] DigitalOcean droplet created ($6/month, Ubuntu 22.04)
- [ ] Droplet IP address noted
- [ ] Domain name registered
- [ ] Cloudflare account created (free tier)

---

## Initial Server Setup

### Docker Installation
- [ ] SSH into droplet
- [ ] Update system: `apt update && apt upgrade -y`
- [ ] Install Docker: `curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh`
- [ ] Install Docker Compose: `apt install docker-compose -y`
- [ ] Verify installations: `docker --version && docker-compose --version`

### Firewall Configuration (UFW)
- [ ] Install UFW: `apt install ufw -y`
- [ ] Allow SSH: `ufw allow 22/tcp` ⚠️ **DO THIS FIRST!**
- [ ] Allow HTTP: `ufw allow 80/tcp`
- [ ] Allow HTTPS: `ufw allow 443/tcp`
- [ ] Enable firewall: `ufw enable`
- [ ] Verify: `ufw status verbose`

### Domain & DNS
- [ ] Point domain nameservers to Cloudflare
- [ ] Add A record: `@` → Droplet IP (Proxied)
- [ ] Add A record: `www` → Droplet IP (Proxied)
- [ ] Set Cloudflare SSL to "Full (strict)"
- [ ] Enable "Always Use HTTPS"
- [ ] Wait for DNS propagation (5-30 minutes)

---

## Application Deployment

### Repository Setup
- [ ] Clone repository: `git clone YOUR_REPO_URL`
- [ ] Navigate to directory: `cd Shul-Software`

### Environment Configuration
- [ ] Copy `.env.example` to `.env`: `cp .env.example .env`
- [ ] Edit `.env` file: `nano .env`
  - [ ] Generate new `SECRET_KEY`
  - [ ] Set `DEBUG=False`
  - [ ] Set `ALLOWED_HOSTS` to your domain
  - [ ] Set strong `DB_PASSWORD`
  - [ ] Configure email settings
  - [ ] Set `SITE_URL` to your domain
  - [ ] Set `CORS_ALLOWED_ORIGINS` to your domain

### Nginx Configuration
- [ ] Edit `nginx/conf.d/default.conf`
- [ ] Replace all `yourdomain.com` with your actual domain
- [ ] Save file

### Frontend Build
- [ ] Navigate to frontend: `cd frontend`
- [ ] Install dependencies: `npm install`
- [ ] Build production: `npm run build`
- [ ] Verify build folder exists: `ls -la build/`
- [ ] Return to root: `cd ..`

### Docker Deployment
- [ ] Build and start containers: `docker-compose up -d --build`
- [ ] Verify all containers running: `docker-compose ps`
- [ ] Check logs for errors: `docker-compose logs`

### Database Setup
- [ ] Run migrations: `docker-compose exec django python manage.py migrate`
- [ ] Create superuser: `docker-compose exec django python manage.py createsuperuser`
- [ ] Collect static files: `docker-compose exec django python manage.py collectstatic --noinput`

---

## SSL Certificate Setup

### Option A: Let's Encrypt (Certbot)
- [ ] Install Certbot: `apt install certbot -y`
- [ ] Stop nginx: `docker-compose stop nginx`
- [ ] Get certificate: `certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com`
- [ ] Restart nginx: `docker-compose start nginx`
- [ ] Enable auto-renewal: `systemctl enable certbot.timer`

### Option B: Cloudflare Origin Certificate
- [ ] Generate origin certificate in Cloudflare dashboard
- [ ] Save certificate to `/etc/letsencrypt/live/yourdomain.com/fullchain.pem`
- [ ] Save private key to `/etc/letsencrypt/live/yourdomain.com/privkey.pem`
- [ ] Set permissions: `chmod 644 fullchain.pem && chmod 600 privkey.pem`
- [ ] Restart nginx: `docker-compose restart nginx`

---

## Automated Backups

### Backup Script Setup
- [ ] Make scripts executable: `chmod +x scripts/*.sh`
- [ ] Test backup: `./scripts/backup-database.sh`
- [ ] Verify backup created: `ls -lh backups/`
- [ ] Add to crontab: `crontab -e`
- [ ] Add line: `0 2 * * * /root/Shul-Software/scripts/backup-database.sh >> /var/log/shul-backup.log 2>&1`
- [ ] Verify cron job: `crontab -l`

---

## Post-Deployment Verification

### Application Testing
- [ ] Visit `https://yourdomain.com` in browser
- [ ] Verify SSL certificate (green padlock)
- [ ] Test user registration
- [ ] Test user login
- [ ] Test shul settings page
- [ ] Test zmanim display
- [ ] Test custom times creation
- [ ] Test all three custom time modes
- [ ] Test admin panel at `/admin/`
- [ ] Test display page (Shul Display button)

### Performance Checks
- [ ] Check container health: `docker-compose ps`
- [ ] Check resource usage: `docker stats`
- [ ] Check disk space: `df -h`
- [ ] Review logs for errors: `docker-compose logs --tail=100`

### Security Verification
- [ ] Firewall enabled: `ufw status`
- [ ] SSL certificate valid (check in browser)
- [ ] `DEBUG=False` in `.env`
- [ ] Strong database password set
- [ ] Cloudflare proxy enabled (orange cloud)
- [ ] HTTP redirects to HTTPS
- [ ] Admin panel requires authentication

---

## Monitoring Setup

### Log Monitoring
- [ ] Set up log rotation for Docker
- [ ] Configure log aggregation (optional)
- [ ] Set up error alerting (optional)

### Uptime Monitoring
- [ ] Set up external monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Configure alerts for downtime
- [ ] Test alert system

---

## Documentation

### Team Handoff
- [ ] Document server IP and credentials (secure location)
- [ ] Document domain registrar login
- [ ] Document Cloudflare login
- [ ] Document email account credentials
- [ ] Create runbook for common tasks
- [ ] Share access with team members

---

## Maintenance Schedule

### Daily
- [ ] Automated database backups (via cron)
- [ ] Automated zmanim calculations (via Celery Beat)

### Weekly
- [ ] Review application logs
- [ ] Check disk space usage
- [ ] Review backup logs

### Monthly
- [ ] System updates: `apt update && apt upgrade`
- [ ] Review and clean old Docker images: `docker system prune`
- [ ] Test backup restoration
- [ ] Review performance metrics
- [ ] Update dependencies (if needed)

---

## Rollback Plan

If deployment fails:
- [ ] Document error messages
- [ ] Roll back to previous version: `git checkout PREVIOUS_COMMIT`
- [ ] Rebuild containers: `docker-compose up -d --build`
- [ ] Restore database if needed: `./scripts/restore-database.sh`
- [ ] Investigate issue before redeploying

---

## Success Criteria

Deployment is successful when:
- ✅ Website loads at `https://yourdomain.com`
- ✅ SSL certificate is valid
- ✅ All containers are running
- ✅ Users can register and login
- ✅ Zmanim display correctly
- ✅ Custom times work in all three modes
- ✅ Admin panel accessible
- ✅ Automated backups configured
- ✅ No errors in logs
- ✅ Firewall configured
- ✅ Cloudflare proxy active

---

## Quick Commands Reference

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# Update application
git pull && ./scripts/deploy.sh

# Backup database
./scripts/backup-database.sh

# Restore database
./scripts/restore-database.sh /path/to/backup.sql.gz

# View firewall status
ufw status verbose

# Check disk space
df -h

# Check resource usage
docker stats
```

---

**After completing this checklist, your Shul Display application will be live and secure!** 🎉
