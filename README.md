# 🔍 Rank Tracker

Track the Google search ranking position of your keywords over time.

Built with **Next.js**, **MongoDB**, **TailwindCSS**, **NextAuth**, and **SerpAPI**.

## 🌐 Live Demo

🔗 [https://nishkun-rank-tracker.vercel.app](https://nishkun-rank-tracker.vercel.app)

---

## 🚀 Features

- ✅ Add multiple domains and keywords
- 📈 Visualize search rankings with charts
- 🔁 Daily rank checking using GitHub Actions (cron job)
- 🔒 Authenticated using NextAuth and Google Authentication
- 🌍 Real-time keyword tracking with SerpAPI

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS
- **Backend**: API Routes with Mongoose
- **Auth**: NextAuth.js with Google Authentication
- **Database**: MongoDB Atlas
- **Ranking API**: [SerpAPI](https://serpapi.com/)
- **Deployment**: Vercel
- **CRON Job**: GitHub Actions

---

## 📦 Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/nishkun/rank-tracker.git
cd rank-tracker

```
### 2.Install Dependencies
```
npm install
```
### 3. Create Environment Variables
```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
SERPAPI_API_KEY=your_serpapi_api_key
```
### 4. Run the Dev Server
```
npm run dev
```
## 🔐 Authentication
This app uses NextAuth.js with Google authentication.

To enable it:

Go to Google Cloud Console

Create a new project or use an existing one

Go to APIs & Services → Credentials

Create OAuth 2.0 Client ID

Application type: Web

Authorized redirect URI:

For dev: http://localhost:3000/api/auth/callback/google

For prod (Vercel): https://nishkun-rank-tracker.vercel.app/api/auth/callback/google

Note the Client ID and Client Secret

Then add the following to your .env.local
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```
## 🗓️ Cron Job
A GitHub Action runs daily at midnight UTC to update keyword rankings via:
```
GET /api/check-for-all-keywords
```
Location of CRON file :
```
.github/workflows/cron.yaml
```
✅ Trigger it manually from the Actions tab in GitHub if needed.

## 🙌 Contributing
PRs are welcome! For major changes, open an issue first to discuss what you'd like to change.

## 👤 Author

Built with ❤️ by [Nishant Kadu](https://github.com/nishkun)  
🔗 [LinkedIn](https://www.linkedin.com/in/nishant-kadu-24bb39280/)

