# 🪧 Express CRUD with json files as db

## 📋 About

Simple API for storing inventory

### 🚀 Goals

- POST: **/api/item** - object with item {codeName: 'string 2-50chars', description: 'string 0-500 chars'}; adds id, creation time to object and stores it in separate json file
- GET: **/api/inventory** - get all inventory
- GET: **/api/inventory/[id]** - get all item information by id
- GET: **/api/inventory-page** -get first page with default items per page
- GET: **/api/inventory-page/[page]** -get page with default items list size.
- GET: **/api/inventory-page/[page]/[size]** -get page with items list specified length(size).
- return sorted by name, creation time items list for inventory-page routes.
- return url to previous and next page for inventory-page routes.
- possibility to change items per page settings when starting server:
  - default: 5;
  - minimum: 2;
  - maximum: 20;

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
