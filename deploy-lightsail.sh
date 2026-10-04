#!/bin/bash
# One-Click Lightsail Deployment Script for Irfan & Shahana Daily App

echo "✨ Updating packages..."
sudo apt update -y

echo "✨ Installing Nginx & Unzip..."
sudo apt install -y nginx unzip

echo "✨ Cleaning default html..."
sudo rm -rf /var/www/html/*

echo "✨ Unzipping daily-app.zip..."
if [ -f "daily-app.zip" ]; then
    sudo unzip -o daily-app.zip -d /var/www/html/
    echo "✅ App unzipped to /var/www/html/"
else
    echo "⚠️ daily-app.zip not found in current folder! Looking in dist/..."
    if [ -d "dist" ]; then
        sudo cp -r dist/* /var/www/html/
        echo "✅ dist copied to /var/www/html/"
    fi
fi

# Configure Nginx for Single Page Application routing
sudo cat << 'EOF' > /etc/nginx/sites-available/default
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html index.htm;

    server_name _;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}
EOF

echo "✨ Restarting Nginx web server..."
sudo systemctl restart nginx
sudo systemctl enable nginx

echo "🎉 DEPLOYMENT COMPLETE! 24/7 Web App is LIVE!"
echo "Open your Lightsail Public IP in any browser: http://$(curl -s ifconfig.me)"
