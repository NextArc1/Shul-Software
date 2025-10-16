# Shul Display - Jewish Prayer Times Display System

A comprehensive web application for synagogues to display daily Zmanim (Jewish prayer times), weekly schedules, and custom events on digital displays.

## Features

- ✅ **Automatic Zmanim Calculation** - Daily prayer times calculated for any location
- ✅ **Custom Times** - Three calculation modes:
  - Daily (each day's own calculation)
  - Weekly Target Day (show specific weekday's time all week)
  - Specific Calendar Date (plan holidays in advance)
- ✅ **Multiple Display Themes** - Wood/Gold, Marble/Gold, and custom styling
- ✅ **Multi-language Support** - Hebrew, English, Ashkenazi, Sephardi
- ✅ **Drag-and-Drop Interface** - Easy customization of display layout
- ✅ **Jewish Calendar Integration** - Daf Yomi, Parsha, Omer, holidays
- ✅ **Memorial Boxes** - Ilui Nishmat and Refuah Shleima lists
- ✅ **Background Tasks** - Automated daily zmanim calculations
- ✅ **Master Admin Portal** - Approve new registrations, manage global settings

## Tech Stack

### Backend
- Django 5.0 (Python)
- Django REST Framework
- PostgreSQL database
- Redis (caching + Celery broker)
- Celery (background tasks)

### Frontend
- React 18
- React Router
- Material-UI
- React Beautiful DnD (drag-and-drop)

### Deployment
- Docker + Docker Compose
- Nginx (web server)
- Gunicorn (WSGI server)
- Let's Encrypt SSL
- Cloudflare CDN (optional)

## Quick Start (Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your settings

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Start Celery (in separate terminal)

```bash
cd backend
celery -A shul_display worker --loglevel=info
```

### Start Celery Beat (in another terminal)

```bash
cd backend
celery -A shul_display beat --loglevel=info
```

## Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete production deployment guide.

### Quick Deploy (DigitalOcean $6/month droplet)

```bash
# On your server
git clone https://github.com/YOUR_USERNAME/Shul-Software.git
cd Shul-Software

# Configure environment
cp .env.example .env
nano .env  # Edit with your settings

# Build frontend
cd frontend && npm install && npm run build && cd ..

# Start with Docker
docker-compose up -d --build

# Run migrations
docker-compose exec django python manage.py migrate
docker-compose exec django python manage.py createsuperuser
docker-compose exec django python manage.py collectstatic --noinput
```

## Architecture

```
┌─────────────────┐
│   Cloudflare    │  (CDN + SSL + DDoS Protection)
└────────┬────────┘
         │
┌────────▼────────┐
│     Nginx       │  (Reverse Proxy + Static Files)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│Django│  │ React│
│ API  │  │ SPA  │
└───┬──┘  └──────┘
    │
┌───┴───────────┐
│  PostgreSQL   │
│     Redis     │
│  Celery Beat  │
│ Celery Worker │
└───────────────┘
```

## Environment Variables

Key environment variables (see `.env.example` for full list):

```env
# Django
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com

# Database
DB_NAME=shul_display
DB_USER=shul_user
DB_PASSWORD=your-password
DB_HOST=postgres
DB_PORT=5432

# Redis
REDIS_URL=redis://redis:6379/0

# Email
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

## Custom Time Modes

### Daily Mode
Each day shows its own calculated time.
```
Example: "Daily Shacharis" at Netz - 30 min
→ Monday shows Monday's Netz - 30
→ Tuesday shows Tuesday's Netz - 30
```

### Weekly Target Day
Show a specific weekday's time throughout the week.
```
Example: "Friday Mincha" displayed Sun-Fri
→ All days show Friday's Shkiah - 10 min
→ Updates weekly automatically
```

### Specific Calendar Date
Show a specific date's time (for holidays).
```
Example: "First Day Sukkos" on Oct 17, 2025
→ Shows Oct 17's Netz + 30 min
→ Displays until manually deleted
```

## API Endpoints

### Authentication
- `POST /api/register/` - Register new shul
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout

### Zmanim
- `GET /api/zmanim/` - Get zmanim for date range
- `GET /api/zmanim/available-fields/` - Get all available zmanim fields
- `POST /api/zmanim/calculate/` - Trigger zmanim calculation

### Custom Times
- `GET /api/custom-times/` - List all custom times
- `POST /api/custom-times/` - Create custom time
- `PUT /api/custom-times/{id}/` - Update custom time
- `DELETE /api/custom-times/{id}/` - Delete custom time

### Shul Settings
- `GET /api/shul/` - Get shul settings
- `PUT /api/shul/` - Update shul settings
- `GET /api/shul-display-layout/` - Get display layout
- `PUT /api/shul-display-layout/` - Update display layout

## Maintenance

### View Logs
```bash
docker-compose logs -f
```

### Backup Database
```bash
./scripts/backup-database.sh
```

### Restore Database
```bash
./scripts/restore-database.sh /path/to/backup.sql.gz
```

### Update Application
```bash
./scripts/deploy.sh
```

## Scaling

- **0-50 shuls**: $6 droplet (1GB RAM)
- **50-150 shuls**: $12 droplet (2GB RAM) + managed PostgreSQL
- **150-300 shuls**: $18 droplet (4GB RAM) + managed PostgreSQL
- **300+ shuls**: Multiple app servers + load balancer

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
- Check the [Deployment Guide](DEPLOYMENT.md)
- Review application logs: `docker-compose logs -f`
- Open an issue on GitHub

## Acknowledgments

- Zmanim calculations powered by [zmanim Python library](https://pypi.org/project/zmanim/)
- Prayer times based on halachic calculations
- Built for the Jewish community with ❤️

---

**Made with dedication to help Jewish communities worldwide** 🕍
