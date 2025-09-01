"use client"

export default function DebugPage() {
  const envVars = {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Debug</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        <pre>{JSON.stringify(envVars, null, 2)}</pre>
      </div>
      
      <h2 className="text-xl font-bold mt-6 mb-4">Status</h2>
      <div className="space-y-2">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span>{key}:</span>
            <span className={value ? "text-green-600" : "text-red-600"}>
              {value ? "✅ Set" : "❌ Missing"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
