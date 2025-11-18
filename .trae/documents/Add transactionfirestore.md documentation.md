## Goal
Create `transactionfirestore.md` to explain how transaction data is written and fetched from Firestore using `user_id`, for future developers.

## Location
- File path: `transactionfirestore.md` at repository root.

## Contents Outline
### Overview
- Describe transaction data flow: write via service; fetch by `userId`; UI formatting.

### Firestore Setup
- Reference `db` initialization in `src/firebase/config.js:24` with `getFirestore(app)`.

### Collections and Core Fields
- `transactions` collection: document fields used by UI and services:
  - `userId` (string linking to member/user)
  - `memberName`, `amount`, `transactionType|type`, `paymentMethod`, `status`
  - `createdAt`, `updatedAt` (Firestore `Timestamp`)
- Note member/user linkage created during registration (member `user_id` used elsewhere).

### Writing Transactions
- Service method: `TransactionService.addTransaction` (`src/firebase/transactionService.js:25–33`)
  - Uses `addDoc(collection(db, 'transactions'), { ...transactionData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })`
  - Include sample payload showing `userId`.

### Querying Transactions
- All transactions: `getAllTransactions` (`src/firebase/transactionService.js:80–91`) using `orderBy('createdAt','desc')` and `getDocs`.
- By user: `getTransactionsByUserId(userId)` (`src/firebase/transactionService.js:60–72`) using `where('userId','==', userId)` and `orderBy('createdAt','desc')`.
- Recent: `getRecentTransactions(limit)` (`src/firebase/transactionService.js:40–51`).
- Provide example queries and expected results shape.

### UI Data Flow
- Transactions page fetch:
  - `src/components/Transactions.jsx:17–54` calls `TransactionService.getAllTransactions()` then maps fields (`id`, `type`, `amount`, `method`, `description`, `member`, `date`, `time`).
  - `createdAt.seconds` formatting for date/time (`src/components/Transactions.jsx:32–37`).
- Cashier dashboard also loads transactions via the same service:
  - `src/components/CashierDashboard.jsx:246–253` fetches and sets transactions.

### Real-Time Option (Optional)
- Note current implementation uses one-time reads (`getDocs`).
- Outline an optional `subscribeTransactions(userId?)` with `onSnapshot(query(...))` and cleanup, if real-time updates are desired.

### Error Handling and Timestamps
- All service methods return `{ success, data|error }` and log errors.
- Explain converting `Timestamp` to JS `Date` and locale formatting.

### Examples
- Sample `addTransaction` payload including `userId`.
- Sample `getTransactionsByUserId('abc123')` result.

## Steps
1. Create `transactionfirestore.md` at repo root.
2. Write sections listed above with concise examples and code references.
3. Ensure references use `file_path:line_number` for easy navigation.
4. Review for accuracy against the current code.

## Confirmation
Confirm the plan and location; then I will create the file and populate it accordingly.