# Firestore Index Management

## Overview
This document explains how to manage Firestore indexes for the HisabKitab expense tracker.

## Common Index Errors

### "Query requires an index" Error
This is a normal part of Firestore development. When you encounter this error:

1. **Click the provided URL** - The error message contains a direct link to create the index
2. **Review the index definition** - Make sure the fields and order make sense
3. **Click "Create"** - Firebase will build the index automatically
4. **Wait for completion** - Index building can take seconds to minutes

### Example Error:
```
The query requires an index. You can create it here: 
https://console.firebase.google.com/v1/r/project/hisabkitabforall/firestore/indexes?create_composite=...
```

## Index Configuration Files

### `firestore.indexes.json`
Contains all composite indexes for the project. Common patterns:

```json
{
  "collectionGroup": "expenses",
  "fields": [
    {"fieldPath": "userId", "order": "ASCENDING"},
    {"fieldPath": "createdAt", "order": "DESCENDING"}
  ]
}
```

### `firestore.rules`
Security rules that work with the indexes to ensure data access control.

## Management Commands

```bash
# Deploy indexes to Firebase
npm run firebase:indexes

# List current indexes
npm run firebase:indexes:list

# Deploy rules and indexes together
firebase deploy --only firestore
```

## Best Practices

1. **Always filter by userId first** - For security and performance
2. **Order by timestamp fields** - Usually `createdAt` or `updatedAt`
3. **Include `__name__` for pagination** - Firestore automatically adds this
4. **Monitor query performance** - Use Firebase Console to analyze slow queries

## Index Fields Explanation

- `userId` (ascending) - Security filter, must be first
- `createdAt` (descending) - Show newest items first
- `category` (ascending) - Filter by expense category
- `date` (descending) - Filter by expense date
- `__name__` (descending) - Document ID for pagination

## Troubleshooting

### Index is "Building"
- Wait for the status to change to "Ready"
- Building time depends on existing data volume
- Queries will fail until the index is ready

### Missing Index in Production
- Indexes must be created in each environment
- Use `firebase deploy --only firestore:indexes` for consistency
- Consider using Firebase CLI for automated deployments

### Performance Issues
- Review query complexity in Firebase Console
- Consider denormalizing data for frequently accessed patterns
- Use composite indexes instead of multiple single-field queries

## Security Notes

All indexes should respect the security model:
- Users can only access their own data (`userId` filter)
- Proper Firestore rules enforce data isolation
- Indexes don't bypass security rules
