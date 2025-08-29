// Mock authentication service for development/testing
export interface MockUser {
  uid: string
  displayName: string
  email: string
  phoneNumber?: string
}

class MockAuth {
  private currentUser: MockUser | null = null
  private listeners: ((user: MockUser | null) => void)[] = []
  private users: Map<string, { email: string; password: string; name: string }> = new Map()

  constructor() {
    // Check for existing session
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("mockUser")
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser)
      }

      // Load saved users
      const savedUsers = localStorage.getItem("mockUsers")
      if (savedUsers) {
        this.users = new Map(JSON.parse(savedUsers))
      }
    }
  }

  async signUpWithEmail(email: string, password: string, name: string) {
    return new Promise<{ user: MockUser | null; error: string | null }>((resolve) => {
      setTimeout(() => {
        // Check if user already exists
        if (this.users.has(email)) {
          resolve({ user: null, error: "User already exists with this email" })
          return
        }

        // Create new user
        this.users.set(email, { email, password, name })

        const mockUser: MockUser = {
          uid: "mock-user-" + Date.now(),
          displayName: name,
          email: email,
        }

        this.currentUser = mockUser

        if (typeof window !== "undefined") {
          localStorage.setItem("mockUser", JSON.stringify(mockUser))
          localStorage.setItem("mockUsers", JSON.stringify(Array.from(this.users.entries())))
        }

        // Notify listeners
        this.listeners.forEach((listener) => listener(mockUser))

        resolve({ user: mockUser, error: null })
      }, 1000)
    })
  }

  async signInWithEmail(email: string, password: string) {
    return new Promise<{ user: MockUser | null; error: string | null }>((resolve) => {
      setTimeout(() => {
        const userData = this.users.get(email)

        if (!userData || userData.password !== password) {
          resolve({ user: null, error: "Invalid email or password" })
          return
        }

        const mockUser: MockUser = {
          uid: "mock-user-" + Date.now(),
          displayName: userData.name,
          email: email,
        }

        this.currentUser = mockUser

        if (typeof window !== "undefined") {
          localStorage.setItem("mockUser", JSON.stringify(mockUser))
        }

        // Notify listeners
        this.listeners.forEach((listener) => listener(mockUser))

        resolve({ user: mockUser, error: null })
      }, 1000)
    })
  }

  async signInWithGoogle() {
    // Simulate Google sign-in flow
    return new Promise<{ user: MockUser | null; error: string | null }>((resolve) => {
      setTimeout(() => {
        const mockUser: MockUser = {
          uid: "mock-google-user-" + Date.now(),
          displayName: "Demo Google User",
          email: "demo@gmail.com",
          phoneNumber: "+1234567890",
        }

        this.currentUser = mockUser

        if (typeof window !== "undefined") {
          localStorage.setItem("mockUser", JSON.stringify(mockUser))
        }

        // Notify listeners
        this.listeners.forEach((listener) => listener(mockUser))

        resolve({ user: mockUser, error: null })
      }, 1000) // Simulate network delay
    })
  }

  async signOut() {
    return new Promise<{ error: string | null }>((resolve) => {
      setTimeout(() => {
        this.currentUser = null

        if (typeof window !== "undefined") {
          localStorage.removeItem("mockUser")
        }

        // Notify listeners
        this.listeners.forEach((listener) => listener(null))

        resolve({ error: null })
      }, 500)
    })
  }

  onAuthStateChanged(callback: (user: MockUser | null) => void) {
    this.listeners.push(callback)

    // Immediately call with current user
    setTimeout(() => callback(this.currentUser), 0)

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
}

export const mockAuth = new MockAuth()
