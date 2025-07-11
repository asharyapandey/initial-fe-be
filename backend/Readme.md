# GQL

## Introduction


## Running the App

### Prerequisites

- Node.js (v20 or later)
- npm (v10 or later)
- Docker (optional, for running with Docker)

### Without Docker

1. Copy the example environment file to `.env`:

   ```bash
   	cp .env.example .env
   ```

> Update the `.env` file with your local database credentials. Make sure to replace the placeholders with your actual database host, username, password, and database name.

2. Install packages :

   ```bash
    npm i
   ```

3. Run the application:

   ```bash
    npm run dev
   ```

4. Run the application in watch mode:
   ```bash
    npm run dev:watch
   ```

### With Docker

1. Run the application in watch mode:
   ```bash
    docker compose up
   ```
