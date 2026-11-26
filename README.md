# DMK Legal Wing website

React.js front end, Python Flask API, MySQL database.

```
client/   React (Vite) public site and /admin panel
server/   Flask API, models, seed data
deploy/   nginx, systemd, MySQL setup, backup script
```

Public pages: Home, About, Ideology, Organisation, Districts, Activities, News, Legal resources, Gallery, Contact. Tamil and English, switchable from the header.
Admin (`/admin`): News, Activities, Legal resources, Gallery albums and photos, Office bearers, District organisers, Page text (Home, About, Ideology), Contact messages, Change password.

## 1. Run it on your computer

Needs Python 3.10+, Node 18+, MySQL 8 (or leave `DATABASE_URL` out and it uses a local SQLite file for a quick look).

```bash
# API
cd server
python -m venv venv && source venv/bin/activate     # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                # then edit it
python seed.py                                      # creates tables, loads districts, office bearers, page text, first admin
flask --app wsgi run --port 5000

# Front end, in a second terminal
cd client
npm install
npm run dev                                         # http://localhost:5173  (proxies /api and /uploads to port 5000)
```

`seed.py` prints the first admin's email and, if `ADMIN_PASSWORD` was empty, a temporary password. Sign in at `/admin` and change it under Password.

## 2. Put it on the client's server (Ubuntu + nginx)

```bash
sudo mkdir -p /var/www/dmk-legal-wing/{uploads,client-dist}
sudo chown -R www-data:www-data /var/www/dmk-legal-wing/uploads

# database
mysql -u root -p < deploy/mysql-setup.sql           # edit the password inside first

# API
cd /var/www/dmk-legal-wing/server
python3 -m venv venv && venv/bin/pip install -r requirements.txt
cp .env.example .env && nano .env                   # set SECRET_KEY, JWT_SECRET_KEY, DATABASE_URL, UPLOAD_DIR, COOKIE_SECURE=true, ADMIN_*
venv/bin/python seed.py
sudo cp ../deploy/dmk-legal-wing.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now dmk-legal-wing

# front end (build on any machine, copy dist/ to the server)
cd client && npm install && npm run build
rsync -a dist/ user@server:/var/www/dmk-legal-wing/client-dist/

# nginx + https
sudo cp deploy/nginx.conf /etc/nginx/sites-available/dmk-legal-wing   # set server_name
sudo ln -s /etc/nginx/sites-available/dmk-legal-wing /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d legalwing.example.org
```

Generate the two secrets with `python3 -c "import secrets; print(secrets.token_hex(32))"`.
Schedule `deploy/backup.sh` with cron.

## 3. Linking it with the main website

Easiest: serve this site on a subdomain such as `legalwing.<their-domain>` and link to it from the main site's menu.

To mount it under a path such as `/legal-wing/` instead: build with `VITE_BASE=/legal-wing/ npm run build`, serve `dist/` from that path in nginx, and proxy `/api/` and `/uploads/` as in `deploy/nginx.conf` (keep them on the same domain so the admin login cookie works). An iframe is possible, but cookies for the admin panel work most reliably when `/admin` is opened directly rather than inside a frame.

## 4. Editing content

Everything on the site is editable from `/admin` except the layout. Bilingual fields (office bearers, page text) have English and Tamil boxes. News, activities, legal resources and gallery captions are written in whichever language the editor types.

## 5. Before launch, check

- Names, spellings and phone numbers in Office bearers and District organisers against the client's latest list.
- The seeded text for Home, About and Ideology is a starting draft. Replace it with the client's approved wording (Admin, Page text).
- Fonts load from Google Fonts. If the client's server must not call outside services, download Anek Tamil, Noto Serif Tamil and Source Serif 4, host them in `client/public/fonts` and change the `<link>` in `client/index.html` to `@font-face` rules.
- Change `server/.env` secrets and the admin password. Keep `COOKIE_SECURE=true` once https is on.

## Security notes

Passwords are hashed. Login sessions use httpOnly cookies with CSRF protection. Login and the contact form are rate limited (limits are per worker process; use `RATELIMIT_STORAGE_URI=redis://...` for exact limits). Uploads are limited to images and PDFs, checked by file signature, renamed, and served with a restrictive policy. News text is shown as plain text, so pasted HTML cannot run.
