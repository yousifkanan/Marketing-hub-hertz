# Deployment Instructions for Marketing Hub by YK

To host this application on the web (e.g., Vercel) and keep your data, follow these steps:

## 1. Setup MongoDB Atlas (Database)
1.  Create a free account at [mongodb.com](https://www.mongodb.com/cloud/atlas).
2.  Create a new Cluster and a database named `marketing_hub`.
3.  Go to **Database Access** and create a user with a password.
4.  Go to **Network Access** and allow access from `0.0.0.0/0` (anywhere).
5.  Click **Connect** -> **Connect your application** and copy the **Connection String**.

## 2. Environment Variables
In your deployment platform (like Vercel), add these environment variables:
- `MONGODB_URI`: Your MongoDB connection string (replace `<password>` with your user's password).
- `JWT_SECRET`: A random long string for security.

## 3. GitHub Push
Push your code to a GitHub repository:
```bash
git init
git add .
git commit -m "Convert to MongoDB for deployment"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

## 4. Deploy to Vercel
1.  Import the repository into [Vercel](https://vercel.com).
2.  Add the environment variables during the setup.
3.  Deploy!

Your data will now be stored in the cloud and persist across all users and deployments.
