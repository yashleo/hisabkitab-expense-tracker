export interface MockUser {
  id: string
  name: string
  email: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

class MockAuthService {
  private users: Map<string, MockUser> = new Map()
  private currentUser: MockUser | null = null
  private listeners: ((user: MockUser | null) => void)[] = []

  constructor() {
    // Add a demo user
    this.users.set("demo@example.com", {
      id: "demo-user-id",
      name: "Demo User",
      email: "demo@example.com",
      phone: "+1234567890",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  async signIn(email: string, password: string) {
    // Mock authentication - accept any password for demo
    const user = this.users.get(email)
    if (user) {
      this.currentUser = user
      this.notifyListeners()
      return { user, error: null }
    }
    return { user: null, error: "User not found" }
  }

  async signUp(email: string, password: string, name: string, phone?: string) {
    if (this.users.has(email)) {
      return { user: null, error: "User already exists" }
    }

    const user: MockUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.users.set(email, user)
    this.currentUser = user
    this.notifyListeners()
    return { user, error: null }
  }

  async signOut() {
    this.currentUser = null
    this.notifyListeners()
    return { error: null }
  }

  getCurrentUser() {
    return this.currentUser
  }

  onAuthStateChanged(callback: (user: MockUser | null) => void) {
    this.listeners.push(callback)
    // Immediately call with current user
    callback(this.currentUser)

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.currentUser))
  }
}

export const mockAuth = new MockAuthService()
