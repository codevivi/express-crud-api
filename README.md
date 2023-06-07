# 🪧 Express CRUD with json files as db

## 📋 About

Simple API for storing inventory

### 🚀 Goals

PART 1

- Every entry must be stored in separate json file.
- Every entry must be an object with:
  - id
  - basic info
  - Entry creation time
- POST: /api/item - object with item
- GET: /api/inventory - get all inventory (optional)
- GET: /api/inventory/[id] - get all item information by id

#### 🏁 Getting started

1. Clone repository.
2. Install dependencies

   ```sh
    npm install
   ```

3. Add .env file or set environment variables with .examplenv content

4. Start server

   ```sh
    npm start
   ```

   or (with nodemon for development)

   ```sh
   npm run dev
   ```
