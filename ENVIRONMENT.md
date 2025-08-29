# Environment Setup Guide

## 🔒 Security Configuration

This project uses environment variables to store sensitive Firebase configuration. **Never commit actual credentials to version control.**

## 📋 Quick Setup

### Option 1: Automated Setup
```bash
npm run setup
```

### Option 2: Manual Setup
1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

## 🔑 Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Scroll down to **Your apps** section
5. Select your web app or create one
6. Copy the configuration values

## 🚀 Deployment

### Vercel Deployment

#### Using Vercel CLI:
```bash
# Set environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID

# Deploy
vercel --prod
```

#### Using Vercel Dashboard:
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add each variable with the `Production` environment selected

### Other Platforms
- **Netlify**: Add variables in Site Settings > Environment Variables
- **Railway**: Add variables in Settings > Environment
- **Heroku**: Use `heroku config:set VARIABLE_NAME=value`

## 🔍 Validation

Check if your environment is properly configured:
```bash
npm run env:check
```

## 📁 File Structure

```
├── .env.local          # Your actual credentials (DO NOT COMMIT)
├── .env.example        # Template file (safe to commit)
├── lib/
│   ├── config.ts       # Environment validation
│   └── firebase.ts     # Firebase initialization
└── scripts/
    └── setup-env.js    # Automated setup script
```

## ⚠️ Security Notes

- ✅ `.env.local` is in `.gitignore` 
- ✅ All variables are prefixed with `NEXT_PUBLIC_`
- ✅ Environment validation prevents runtime errors
- ❌ Never hardcode credentials in source code
- ❌ Never commit `.env.local` to version control

## 🐛 Troubleshooting

### "Missing required environment variables" error
- Ensure `.env.local` exists and contains all required variables
- Check variable names match exactly (case-sensitive)
- Restart your development server after adding variables

### Firebase initialization fails
- Verify all Firebase credentials are correct
- Check Firebase project is active and billing is enabled
- Ensure your domain is added to Firebase authorized domains

### Variables not loading in production
- Ensure environment variables are set in your deployment platform
- Check that variable names include the `NEXT_PUBLIC_` prefix
- Verify the build process can access the variables
