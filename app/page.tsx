import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BarChart3, Calendar, PieChart, Shield, Smartphone, Users } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">HisabKitab</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <div className="flex items-center space-x-3">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Track Your Expenses
              <span className="text-primary block">Effortlessly</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Take control of your finances with HisabKitab. Monitor spending, categorize expenses, and gain insights
              into your financial habits with our intuitive expense tracking app.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Tracking Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative max-w-3xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-primary/10 rounded-lg p-4 text-center">
                  <div className="w-8 h-8 bg-primary rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-bold">₹</span>
                  </div>
                  <p className="text-sm font-medium">₹12,450</p>
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
                <div className="bg-secondary/10 rounded-lg p-4 text-center">
                  <Calendar className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <p className="text-sm font-medium">28 Days</p>
                  <p className="text-xs text-muted-foreground">Tracked</p>
                </div>
                <div className="bg-accent/10 rounded-lg p-4 text-center">
                  <PieChart className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-sm font-medium">8 Categories</p>
                  <p className="text-xs text-muted-foreground">Organized</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-4 text-center">
                  <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">₹2,100</p>
                  <p className="text-xs text-muted-foreground">Saved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              Everything You Need to Manage Your Money
            </h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Powerful features designed to make expense tracking simple, insightful, and effective.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Easy Expense Entry</h3>
                <p className="text-muted-foreground">
                  Quickly add expenses with amount, category, location, and description. Simple forms that don't get in
                  your way.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <PieChart className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Smart Categories</h3>
                <p className="text-muted-foreground">
                  Organize expenses into categories like food, transport, shopping, and more. Get insights into your
                  spending patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Calendar View</h3>
                <p className="text-muted-foreground">
                  View your expenses in a beautiful calendar layout. Track daily, weekly, and monthly spending at a
                  glance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Visual Analytics</h3>
                <p className="text-muted-foreground">
                  Beautiful charts and graphs help you understand your spending habits and make better financial
                  decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your financial data is encrypted and secure. We respect your privacy and never share your information.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Community Features</h3>
                <p className="text-muted-foreground">
                  Connect with others, share tips, and learn from a community of people managing their finances
                  effectively.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Join thousands of users who are already tracking their expenses and building better financial habits with
            HisabKitab.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Sign In to Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground">HisabKitab</h3>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                The simple, powerful expense tracker that helps you understand and control your spending habits.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="hover:text-foreground transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signin" className="hover:text-foreground transition-colors">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 HisabKitab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
