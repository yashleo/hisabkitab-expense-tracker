#!/usr/bin/env node

// Simple test script to verify Firestore service
import { firestoreService } from '../lib/firestore.js'

async function testFirestore() {
  console.log('Testing Firestore service...')
  
  try {
    // Test creating a user
    console.log('Testing user creation...')
    const { user, error: userError } = await firestoreService.createUser({
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890'
    })
    
    if (userError) {
      console.error('User creation failed:', userError)
      return
    }
    
    console.log('User created:', user)
    
    // Test creating a category
    console.log('Testing category creation...')
    const { category, error: categoryError } = await firestoreService.createCategory({
      name: 'Test Category',
      icon: '🧪',
      color: '#3b82f6',
      isDefault: false,
      userId: user.id
    })
    
    if (categoryError) {
      console.error('Category creation failed:', categoryError)
      return
    }
    
    console.log('Category created:', category)
    
    // Test creating an expense
    console.log('Testing expense creation...')
    const { expense, error: expenseError } = await firestoreService.createExpense({
      userId: user.id,
      amount: 100.50,
      date: new Date(),
      category: 'Test Category',
      location: 'Test Location',
      description: 'Test expense'
    })
    
    if (expenseError) {
      console.error('Expense creation failed:', expenseError)
      return
    }
    
    console.log('Expense created:', expense)
    
    // Test fetching expenses
    console.log('Testing expense retrieval...')
    const { expenses, error: fetchError } = await firestoreService.getExpenses(user.id)
    
    if (fetchError) {
      console.error('Expense fetch failed:', fetchError)
      return
    }
    
    console.log('Expenses fetched:', expenses.length)
    
    console.log('All tests passed! ✅')
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testFirestore()
}
