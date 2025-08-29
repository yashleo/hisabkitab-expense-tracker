// Firestore error handling utilities
export const handleFirestoreError = (error: any): string => {
  if (error?.code === 'failed-precondition' && error?.message?.includes('requires an index')) {
    const indexUrl = extractIndexUrl(error.message)
    console.warn('🔍 Firestore Index Required:', {
      message: 'This query requires a Firestore index',
      solution: 'Click the link below to create the required index',
      indexUrl: indexUrl || 'Check the Firebase Console for index creation'
    })
    
    return `Query requires a Firestore index. ${indexUrl ? `Create it here: ${indexUrl}` : 'Check the Firebase Console to create the required index.'}`
  }
  
  if (error?.code === 'permission-denied') {
    return 'Permission denied. Please ensure you are logged in and have access to this data.'
  }
  
  if (error?.code === 'unavailable') {
    return 'Service temporarily unavailable. Please try again in a moment.'
  }
  
  if (error?.code === 'not-found') {
    return 'Requested data not found.'
  }
  
  return error?.message || 'An unexpected error occurred'
}

const extractIndexUrl = (errorMessage: string): string | null => {
  const urlMatch = errorMessage.match(/https:\/\/console\.firebase\.google\.com[^\s]+/)
  return urlMatch ? urlMatch[0] : null
}

// Development helper for index creation
export const logIndexRequirement = (collectionName: string, fields: string[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 Index may be required for ${collectionName}:`, {
      collection: collectionName,
      fields: fields,
      note: 'If you get an index error, use the provided URL to create the index'
    })
  }
}
