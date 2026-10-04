# 🚀 Hosting Your Couple Web App 24/7 on AWS

This guide shows you how to host your **Daily Love & Photo Web App** online **24 hours a day, 7 days a week** on AWS so both of you can access it anytime from your smartphones or laptops.

---

## 🌟 Method 1: AWS Amplify (Recommended — Easiest, Fastest & Free)

AWS Amplify is Amazon's dedicated service for modern web apps. It gives you:
- **100% 24/7 Uptime** with global Amazon CloudFront CDN
- **Free Automatic SSL Certificate (`https://`)**
- Free permanent domain (e.g. `https://main.d123abc.amplifyapp.com`)
- Zero server maintenance, completely within AWS Free Tier

### ⏱️ Quick 2-Minute Drag-and-Drop Deploy:

1. **Build the production web app:**
   Open PowerShell in this folder and run:
   ```powershell
   npm run build
   ```
   *(This creates an optimized, ready-to-host `dist` folder).*

2. **Open AWS Amplify Console:**
   Go to [https://console.aws.amazon.com/amplify](https://console.aws.amazon.com/amplify) and sign in.

3. **Deploy:**
   - Click **"Deploy an app"** (or **"New app" > "Host web app"**).
   - Choose **"Deploy without Git provider"** and click **Continue**.
   - Enter App name: `Our Love Story`.
   - Environment name: `production`.
   - **Drag and drop the `dist` folder** (or zip the `dist` folder and drag it in).
   - Click **"Save and deploy"**!

4. **Done! 🎉**
   Within 30 seconds, AWS Amplify will generate a live URL. Bookmark it or add it to your iPhone/Android home screen!

---

## 🔄 Automatic Continuous Deployment (via GitHub)

If you have a GitHub account:
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Daily Couple App"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/your-repo-name.git
   git push -u origin main
   ```
2. In **AWS Amplify Console**, choose **"Host web app" > "GitHub"**.
3. Select your repository. AWS Amplify will detect `amplify.yml` automatically and deploy. Every time you push a change or new photo, AWS will rebuild and update your live site 24/7!

---

## 📱 How to Install on Your Phone (PWA Style)
Once your AWS Amplify URL is live:
- **iPhone / iOS**: Open the URL in Safari &rarr; Tap the **Share** button &rarr; Tap **"Add to Home Screen"**.
- **Android**: Open the URL in Chrome &rarr; Tap the **three dots menu** &rarr; Tap **"Install App"** or **"Add to Home Screen"**.
It will now look and open just like an app installed from the App Store!
