#!/bin/sh
# Nightly backup of the database and uploaded files. Add to cron:  0 2 * * * /var/www/dmk-legal-wing/deploy/backup.sh
set -e
DEST=/var/backups/dmk-legal-wing
STAMP=$(date +%F)
mkdir -p "$DEST"
mysqldump --single-transaction dmk_legal_wing | gzip > "$DEST/db-$STAMP.sql.gz"
tar -czf "$DEST/uploads-$STAMP.tar.gz" -C /var/www/dmk-legal-wing uploads
find "$DEST" -type f -mtime +30 -delete
