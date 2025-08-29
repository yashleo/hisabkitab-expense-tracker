import { type NextRequest, NextResponse } from "next/server"

// Mock user storage (in production, this would be a database)
const users = new Map<string, { id: string; email: string; password: string; name: string; createdAt: Date }>()

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, name } = await request.json()

    if (action === "signup") {
      // Check if user already exists
      if (users.has(email)) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 })
      }

      // Create new user
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        password, // In production, hash this password
        name,
        createdAt: new Date(),
      }

      users.set(email, newUser)

      return NextResponse.json({
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          createdAt: newUser.createdAt,
        },
      })
    }

    if (action === "signin") {
      const user = users.get(email)

      if (!user || user.password !== password) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      })
    }

    if (action === "google") {
      // Mock Google authentication
      const mockGoogleUser = {
        id: "google_" + Math.random().toString(36).substr(2, 9),
        email: "demo@google.com",
        name: "Demo Google User",
        createdAt: new Date(),
      }

      return NextResponse.json({ user: mockGoogleUser })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
