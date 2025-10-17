# Firebase Admin Setup

## Getting Your Service Account Key

To use Firebase Admin SDK on the server side, you need to set up authentication:

### Option 1: Service Account JSON (Recommended for Local Development)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `mj-courses`
3. Click the gear icon ⚙️ → Project settings
4. Go to "Service accounts" tab
5. Click "Generate new private key"
6. Save the JSON file securely (DO NOT commit to git!)
7. Add to your `.env` file:

```env
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"mj-courses",...}'
```

OR set the path to the JSON file:

```env
GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json
```

### Option 2: Application Default Credentials (For Production)

When deploying to Google Cloud (Cloud Functions, Cloud Run, etc.), the Firebase Admin SDK will automatically use Application Default Credentials. No additional setup needed.

## Environment Variables

Add these to your `.env` file:

```env
# Firebase Admin (choose one option above)
FIREBASE_SERVICE_ACCOUNT='...' # Option 1: JSON string
# OR
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json

# Firebase Project
FIREBASE_PROJECT_ID=mj-courses
```

## Security Notes

- **NEVER** commit the service account JSON file to version control
- Add `serviceAccountKey.json` to `.gitignore`
- Keep the service account key secure and rotate it periodically
- Use environment variables or secret management for production
