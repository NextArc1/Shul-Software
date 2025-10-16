#!/bin/bash
# PostgreSQL Backup Script for Shul Display Application
# This script creates automated backups of the PostgreSQL database

# Load environment variables
set -a
source /root/Shul-Software/.env
set +a

# Configuration
BACKUP_DIR="/root/Shul-Software/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="shul_display_backup_${TIMESTAMP}.sql.gz"
CONTAINER_NAME="shul_postgres"

# Keep backups for 30 days
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

echo "Starting backup at $(date)"

# Create backup using docker exec
docker exec -t ${CONTAINER_NAME} pg_dump -U ${DB_USER} ${DB_NAME} | gzip > "${BACKUP_DIR}/${BACKUP_FILE}"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: ${BACKUP_FILE}"

    # Remove old backups
    find "${BACKUP_DIR}" -name "shul_display_backup_*.sql.gz" -mtime +${RETENTION_DAYS} -delete
    echo "Old backups older than ${RETENTION_DAYS} days removed"

    # Show disk usage
    echo "Current backup directory size:"
    du -sh "${BACKUP_DIR}"

    # List recent backups
    echo "Recent backups:"
    ls -lht "${BACKUP_DIR}" | head -5
else
    echo "ERROR: Backup failed!" >&2
    exit 1
fi

echo "Backup process finished at $(date)"
