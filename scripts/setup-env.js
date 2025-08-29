#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function setupEnvironment() {
  console.log('🔥 Firebase Configuration Setup')
  console.log('================================\n')
  
  console.log('Please provide your Firebase configuration values:')
  console.log('(You can find these in your Firebase Console > Project Settings > General)\n')

  const apiKey = await question('Firebase API Key: ')
  const authDomain = await question('Auth Domain (project-id.firebaseapp.com): ')
  const projectId = await question('Project ID: ')
  const storageBucket = await question('Storage Bucket (project-id.appspot.com): ')
  const messagingSenderId = await question('Messaging Sender ID: ')
  const appId = await question('App ID: ')

  const envContent = `# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=${apiKey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${authDomain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${projectId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${storageBucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId}
NEXT_PUBLIC_FIREBASE_APP_ID=${appId}

# Development Environment
NODE_ENV=development`

  const envPath = path.join(process.cwd(), '.env.local')
  
  try {
    fs.writeFileSync(envPath, envContent)
    console.log(`\n✅ Environment file created successfully at: ${envPath}`)
    console.log('\n🚀 You can now run: npm run dev')
  } catch (error) {
    console.error('\n❌ Error creating environment file:', error.message)
  }

  rl.close()
}

setupEnvironment().catch(console.error)
