# HisabKitab - Expense Tracker

A modern, full-stack expense tracking application built with Next.js 15, Firebase, and TypeScript.

## 🚀 Features

### Authentication
- **Google OAuth** - Quick sign-in with Google account
- **Email/Password** - Traditional authentication method
- **Protected Routes** - Secure access to dashboard and expense data
- **Persistent Sessions** - Stay logged in across browser sessions

### Expense Management
- **Add Expenses** - Record expenses with amount, category, location, and description
- **Edit/Delete** - Modify or remove existing expenses
- **Date Filtering** - View expenses by date range
- **Real-time Updates** - Changes reflect immediately across the app

### Categories
- **Default Categories** - Pre-configured categories with icons and colors
  - 🍽️ Food & Dining
  - 🚗 Transportation
  - 🛍️ Shopping
  - 🏠 Bills & Utilities
  - 🎬 Entertainment
  - 🏥 Healthcare
  - 📚 Education
  - 💰 Savings & Investment
  - 🎁 Gifts & Donations
  - ✈️ Travel
  - 🔧 Maintenance & Repairs
- **Custom Categories** - Create your own categories with custom icons and colors
- **Category Analytics** - Track spending by category

### Dashboard & Analytics
- **Expense Overview** - Current month, previous month, and all-time totals
- **Monthly Trends** - Visual representation of spending patterns
- **Category Breakdown** - Pie chart showing spending distribution
- **Recent Expenses** - Quick view of latest transactions
- **Quick Actions** - Fast access to common tasks

### Data Storage
- **Firestore Database** - Scalable, real-time NoSQL database
- **User Data Isolation** - Each user's data is completely separate
- **Offline Support** - Continue using the app even without internet
- **Data Persistence** - All data is permanently stored in the cloud

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern, accessible UI components
- **Radix UI** - Headless UI primitives

### Backend
- **Firebase Auth** - Authentication service
- **Firestore** - NoSQL document database
- **Firebase SDK** - Client-side Firebase integration

### Development
- **React Hooks** - Modern state management
- **Dynamic Imports** - Code splitting and performance optimization
- **Error Boundaries** - Graceful error handling
- **Loading States** - Smooth user experience

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── expenses/          # Expense management pages
│   └── api/               # API routes
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   ├── expenses/         # Expense components
│   ├── providers/        # Context providers
│   └── ui/               # UI components (shadcn/ui)
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   ├── firestore.ts      # Firestore service layer
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## 🔥 Firebase Configuration

### Firestore Collections

#### Users Collection (`users`)
```typescript
{
  id: string
  name: string
  email: string
  phone?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### Expenses Collection (`expenses`)
```typescript
{
  id: string
  userId: string
  amount: number
  date: Timestamp
  category: string
  location?: string
  description?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### Categories Collection (`categories`)
```typescript
{
  id: string
  name: string
  icon: string
  color: string
  isDefault: boolean
  userId?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Security Rules
Firestore security rules ensure data isolation:
- Users can only access their own data
- Each document is protected by user authentication
- Read/write permissions are strictly enforced

### Indexing
Optimized Firestore indexes for:
- User-specific expense queries
- Date range filtering
- Category-based analytics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hisabkitab-expense-tracker
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Firebase Setup**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Google and Email/Password)
   - Enable Firestore Database
   - Copy your Firebase config

4. **Environment Variables**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Data Flow

### Authentication Flow
1. User signs in with Google or email/password
2. Firebase Auth creates/authenticates user
3. User data is stored in Firestore `users` collection
4. Auth context provides user state throughout app

### Expense Flow
1. User adds expense through dashboard or expense page
2. Expense data is validated and sent to Firestore service
3. Firestore service creates document in `expenses` collection
4. Real-time updates reflect changes across all components
5. Analytics are automatically recalculated

### Category Flow
1. Default categories are always available
2. Users can create custom categories
3. Custom categories are stored in `categories` collection
4. Category data is used for expense categorization and analytics

## 🔧 Development

### Key Hooks

#### `useExpenses()`
Manages expense data and operations:
```typescript
const {
  expenses,
  loading,
  error,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpensesByCategory,
  getMonthlyExpenses,
  getTotalExpenses,
  getRecentExpenses,
  refetch
} = useExpenses()
```

#### `useCategories()`
Manages category data and operations:
```typescript
const {
  categories,
  loading,
  error,
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryNames,
  getCategoryByName,
  getDefaultCategories,
  getUserCategories,
  refetch
} = useCategories()
```

#### `useAuthContext()`
Provides authentication state:
```typescript
const {
  user,
  loading,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut
} = useAuthContext()
```

### Firestore Service

The `FirestoreService` class provides a clean interface for all database operations:
- User management (create, read, update)
- Expense CRUD operations
- Category management
- Analytics queries
- Error handling
- Type safety

### Error Handling
- Comprehensive error boundaries
- User-friendly error messages
- Graceful fallbacks for offline scenarios
- Console logging for debugging

## 🎨 UI/UX Features

### Design System
- **Rose/Pink Theme** - Cohesive color scheme throughout
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Mode** - Automatic theme switching
- **Smooth Animations** - Delightful micro-interactions

### Components
- **Bento Grid Layout** - Modern dashboard design
- **Interactive Charts** - Visual data representation
- **Form Validation** - Real-time input validation
- **Loading States** - Skeleton loaders and spinners
- **Toast Notifications** - Success and error feedback

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on each push

### Firebase Hosting
1. Build the application: `pnpm build`
2. Deploy to Firebase Hosting: `firebase deploy`

## 🔒 Security

### Data Protection
- User data is isolated per Firebase Auth user
- All database operations require authentication
- Firestore security rules prevent unauthorized access
- Client-side validation with server-side enforcement

### Best Practices
- Environment variables for sensitive data
- HTTPS-only in production
- Regular security updates
- Input sanitization and validation

## 📈 Performance

### Optimization
- Dynamic imports for Firebase modules
- Code splitting at route level
- Image optimization with Next.js
- Lazy loading for non-critical components

### Caching
- React Query for server state management
- Local state for UI interactions
- Firestore offline persistence
- Browser caching for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend services
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Radix UI](https://www.radix-ui.com/) - Headless UI primitives

---

Built with ❤️ using modern web technologies
