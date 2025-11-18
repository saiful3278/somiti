# Transaction Firestore Data Flow

## Overview
- Transactions are stored in the `transactions` collection in Firestore.
- Each transaction carries a `userId` that links the record to a member/user.
- UI pages fetch transactions through service methods that return normalized objects for rendering.

## Firestore Setup
- Firestore is initialized and exported as `db`.
- Reference: `src/firebase/config.js:24`.

## Transactions Collection
- Collection: `transactions`.
- Common fields used across UI/services:
  - `userId` (string): Member/user identifier associated with the transaction
  - `memberName` (string): Display name associated with the transaction
  - `amount` (number): Transaction amount in BDT
  - `transactionType` or `type` (string): Logical type (`monthly_deposit`, `share_purchase`, `donation`, `expense`, `loan_disbursement`, etc.)
  - `paymentMethod` (string): e.g., `cash`, `mobile_banking`, `bank_transfer`
  - `status` (string): `completed`, `pending`, `failed`
  - `createdAt` (Timestamp): Firestore server timestamp when created
  - `updatedAt` (Timestamp): Firestore server timestamp when last updated

## Writing Transactions
- Method: `TransactionService.addTransaction`
- Reference: `src/firebase/transactionService.js:25–33`.
- Behavior:
  - Writes a new document to `transactions` with `createdAt` and `updatedAt` set via `serverTimestamp()`.
- Example payload:
```json
{
  "userId": "USER_abc123",
  "memberName": "আব্দুল কাদের",
  "amount": 1200,
  "transactionType": "monthly_deposit",
  "paymentMethod": "cash",
  "status": "completed",
  "description": "জানুয়ারি মাসিক জমা"
}
```
- Return shape: `{ success: true, id: "<docId>" }` or `{ success: false, error: "message" }`.

## Querying Transactions
### All Transactions
- Method: `TransactionService.getAllTransactions`
- Reference: `src/firebase/transactionService.js:80–91`.
- Query: `collection(db, 'transactions')` + `orderBy('createdAt','desc')`, then `getDocs(q)`.
- Result shape: `{ success: true, data: Array<{ id, ...fields }> }`.

### By User ID
- Method: `TransactionService.getTransactionsByUserId(userId)`
- Reference: `src/firebase/transactionService.js:60–72`.
- Query: `where('userId', '==', userId)` + `orderBy('createdAt','desc')`, then `getDocs(q)`.
- Use when filtering for a single member/user.

### Recent Transactions
- Method: `TransactionService.getRecentTransactions(limitCount)`
- Reference: `src/firebase/transactionService.js:40–51`.
- Query: `orderBy('createdAt','desc')` + `limit(limitCount)`.

## UI Integration
### Transactions Page
- Fetch on mount, format, and render.
- References:
  - Fetch lifecycle: `src/components/Transactions.jsx:17–54`.
  - Formatting to UI fields: `src/components/Transactions.jsx:25–38`.
  - Date/time from Firestore `Timestamp`: `src/components/Transactions.jsx:32–37`.
- Fields normalized to:
  - `id`, `type`, `amount`, `method`, `description`, `member`, `date`, `time`.

### Cashier Dashboard
- Loads transactions via the same service for summaries and breakdowns.
- Reference: `src/components/CashierDashboard.jsx:246–253`.

## Timestamps
- Firestore `Timestamp` is converted to JS `Date` using `new Date(createdAt.seconds * 1000)`.
- Example usage for UI formatting:
  - Date: `toLocaleDateString('bn-BD')`
  - Time: `toLocaleTimeString('bn-BD')`
- References: `src/components/Transactions.jsx:32–37`.

## Error Handling Contract
- All service methods return `{ success, data|error }`.
- Errors are logged and bubbled up; callers should handle `!success` and default to empty arrays where needed.

## Real-Time Option (Optional)
- Current implementation uses one-time reads via `getDocs`.
- A real-time subscription can be added with `onSnapshot(query(...))` and an unsubscribe function for live updates.
- If implemented, prefer mirroring the same normalization as existing `getAllTransactions` to keep UI consistent.

## Linking Members and Transactions
- The `userId` in a transaction associates it with a member.
- During member registration elsewhere, the backend returns a `user_id`; member documents use that ID, and transactions store it in `userId` for lookups.
- Example lookup flow:
  - Register member, obtain `user_id`.
  - Write transactions including that `userId`.
  - Fetch via `getTransactionsByUserId(user_id)` for per-member history.

## Quick Recipes
- Write a new transaction for a member:
```text
call TransactionService.addTransaction({ userId, memberName, amount, transactionType, paymentMethod, status, description })
```
- Fetch all transactions for dashboard:
```text
call TransactionService.getAllTransactions()
```
- Fetch a member’s transactions:
```text
call TransactionService.getTransactionsByUserId(userId)
```