"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { useAuthContext } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface AuthFormProps {
  mode: "signin" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Validation states
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [nameError, setNameError] = useState("")

  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuthContext()
  const router = useRouter()

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      return "Email is required"
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }
    return ""
  }

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required"
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long"
    }
    if (mode === "signup") {
      if (!/(?=.*[a-z])/.test(password)) {
        return "Password must contain at least one lowercase letter"
      }
      if (!/(?=.*[A-Z])/.test(password)) {
        return "Password must contain at least one uppercase letter"
      }
      if (!/(?=.*\d)/.test(password)) {
        return "Password must contain at least one number"
      }
    }
    return ""
  }

  const validateName = (name: string) => {
    if (mode === "signup") {
      if (!name) {
        return "Full name is required"
      }
      if (name.length < 2) {
        return "Name must be at least 2 characters long"
      }
    }
    return ""
  }

  // Handle input changes with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (emailError) {
      setEmailError(validateEmail(value))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    if (passwordError) {
      setPasswordError(validatePassword(value))
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    if (nameError) {
      setNameError(validateName(value))
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const emailValidation = validateEmail(email)
    const passwordValidation = validatePassword(password)
    const nameValidation = validateName(name)
    
    setEmailError(emailValidation)
    setPasswordError(passwordValidation)
    setNameError(nameValidation)
    
    // If there are validation errors, don't submit
    if (emailValidation || passwordValidation || nameValidation) {
      return
    }
    
    setLoading(true)

    try {
      const result =
        mode === "signup" ? await signUpWithEmail(email, password, name) : await signInWithEmail(email, password)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: mode === "signup" ? "Account created successfully!" : "Signed in successfully!",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    try {
      const result = await signInWithGoogle()
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Signed in with Google successfully!",
        })
        router.push("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Welcome Section (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center items-start p-12 text-primary-foreground">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center mb-4">
              <div className="w-6 h-6 bg-primary-foreground rounded-sm"></div>
            </div>
            <span className="text-xl font-semibold">HisabKitab</span>
          </div>
          
          {/* Welcome Text */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              Track your expenses effortlessly and take control of your financial journey with our intuitive expense tracker.
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full transform translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full transform translate-x-1/3 -translate-y-1/3"></div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Theme Toggle - positioned at top right */}
          <div className="flex justify-end mb-6">
            <ThemeToggle />
          </div>
          
          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {mode === "signup" ? "Create Account" : "Welcome Back!"}
            </h2>
            <p className="text-muted-foreground">
              {mode === "signup" ? "Start tracking your expenses today" : "Login to your account to continue"}
            </p>
          </div>

          {/* Auth Form */}
          <div className="space-y-6">
            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={handleNameChange}
                      onBlur={() => setNameError(validateName(name))}
                      className={`pl-10 h-12 ${nameError ? "border-red-500 focus:border-red-500" : ""}`}
                      required
                    />
                  </div>
                  {nameError && (
                    <p className="text-sm text-red-500 mt-1">{nameError}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => setEmailError(validateEmail(email))}
                    className={`pl-10 h-12 ${emailError ? "border-red-500 focus:border-red-500" : ""}`}
                    required
                  />
                </div>
                {emailError && (
                  <p className="text-sm text-red-500 mt-1">{emailError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => setPasswordError(validatePassword(password))}
                    className={`pl-10 pr-10 h-12 ${passwordError ? "border-red-500 focus:border-red-500" : ""}`}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                )}
                {mode === "signup" && !passwordError && password && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Password must contain:</p>
                    <ul className="ml-4 space-y-1">
                      <li className={password.length >= 6 ? "text-green-600" : ""}>
                        • At least 6 characters
                      </li>
                      <li className={/(?=.*[a-z])/.test(password) ? "text-green-600" : ""}>
                        • One lowercase letter
                      </li>
                      <li className={/(?=.*[A-Z])/.test(password) ? "text-green-600" : ""}>
                        • One uppercase letter
                      </li>
                      <li className={/(?=.*\d)/.test(password) ? "text-green-600" : ""}>
                        • One number
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium bg-rose-600 hover:bg-rose-700 text-white"
                disabled={loading || emailError !== "" || passwordError !== "" || nameError !== "" || !email || !password || (mode === "signup" && !name)}
              >
                {loading ? "Please wait..." : mode === "signup" ? "Create Account" : "LOGIN"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <Button
              onClick={handleGoogleAuth}
              disabled={loading}
              variant="outline"
              className="w-full h-12 text-base font-medium"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <a href="/auth/signin" className="text-primary hover:underline font-medium">
                    Sign in
                  </a>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <a href="/auth/signup" className="text-primary hover:underline font-medium">
                    Sign up
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
