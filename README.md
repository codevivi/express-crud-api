# 🪧 Express CRUD with json files as db

## 📋 About

Simple API for storing inventory

### 🚀 Goals

- POST: /api/item - object with item; adds id, creation time to object and stores it in separate json file
- GET: /api/inventory - get all inventory
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
