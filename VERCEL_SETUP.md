# Vercel Environment Variables Setup

## Required Environment Variables for Production

To make Firebase Admin SDK work in production (Vercel), you need to set these environment variables in your Vercel dashboard:

### 1. FIREBASE_SERVICE_ACCOUNT
- **Value**: Your entire `serviceAccountKey.json` content as a single-line JSON string
- **How to get it**: Run `cat serviceAccountKey.json | tr -d '\n'` in your project root
- **Environment**: Production, Preview, Development (all three)

### 2. FIREBASE_PROJECT_ID
- **Value**: `mj-courses` (or your Firebase project ID)
- **Environment**: Production, Preview, Development (all three)

### 3. STRIPE_SECRET_KEY
- **Value**: Your Stripe secret key (starts with `sk_`)
- **Environment**: Production, Preview, Development

### 4. STRIPE_PUBLIC_KEY
- **Value**: Your Stripe publishable key (starts with `pk_`)
- **Environment**: Production, Preview, Development

### 5. VUEFIRE_API_KEY
- **Value**: Your Firebase Web API key
- **Environment**: Production, Preview, Development

## How to Add Environment Variables to Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project: `mj-courses-nuxtjs`
3. Click on **Settings** → **Environment Variables**
4. Add each variable:
   - Click **Add New**
   - Enter the **Name** (e.g., `FIREBASE_SERVICE_ACCOUNT`)
   - Paste the **Value**
   - Select environments: **Production**, **Preview**, **Development**
   - Click **Save**
5. After adding all variables, **redeploy your application**:
   - Go to **Deployments**
   - Click the three dots (**...**) on the latest deployment
   - Click **Redeploy**

## Important Notes

- Never commit `serviceAccountKey.json` to Git (already in `.gitignore`)
- The service account JSON must be a valid single-line JSON string
- After adding/updating env variables, you must redeploy for changes to take effect
- You can verify the variables are set by checking the Vercel build logs

## Local Development

For local development, the app will automatically use `serviceAccountKey.json` from the project root. No additional setup needed.

## Troubleshooting

If you see "Could not load the default credentials" error:
1. Check that `FIREBASE_SERVICE_ACCOUNT` is set in Vercel
2. Verify the JSON is valid (use a JSON validator)
3. Redeploy the application
4. Check Vercel function logs for detailed error messages
