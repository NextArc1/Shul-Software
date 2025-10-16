#!/bin/bash
# PostgreSQL Restore Script for Shul Display Application
# Usage: ./restore-database.sh <backup_file.sql.gz>

# Check if backup file was provided
if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file.sql.gz>"
    echo "Available backups:"
    ls -lht /root/Shul-Software/backups/*.sql.gz | head -10
    exit 1
fi

BACKUP_FILE=$1
CONTAINER_NAME="shul_postgres"

# Load environment variables
set -a
source /root/Shul-Software/.env
set +a

# Check if backup file exists
if [ ! -f "${BACKUP_FILE}" ]; then
    echo "ERROR: Backup file not found: ${BACKUP_FILE}"
    exit 1
fi

echo "WARNING: This will restore the database from backup and overwrite current data!"
echo "Backup file: ${BACKUP_FILE}"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

echo "Starting restore at $(date)"

# Stop Django and Celery services to prevent database access during restore
echo "Stopping application services..."
docker-compose stop django celery_worker celery_beat

# Restore database
echo "Restoring database..."
gunzip < "${BACKUP_FILE}" | docker exec -i ${CONTAINER_NAME} psql -U ${DB_USER} ${DB_NAME}

if [ $? -eq 0 ]; then
    echo "Restore completed successfully"

    # Restart services
    echo "Restarting application services..."
    docker-compose start django celery_worker celery_beat

    echo "Restore process finished at $(date)"
else
    echo "ERROR: Restore failed!" >&2
    echo "Restarting services anyway..."
    docker-compose start django celery_worker celery_beat
    exit 1
fi
