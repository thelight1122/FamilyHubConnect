
# Family Hub Connect

This is an all-in-one app to organize your family's life, manage chores, set rewards, and stay connected.

## Prerequisites

*   Node.js (v18 or later recommended)
*   npm (v9 or later) or another package manager like yarn or pnpm
*   A Supabase account
*   A Google Cloud project with the Gemini API and Calendar API enabled.
*   A Google Cloud OAuth 2.0 Client ID for web applications.

## Setup Instructions

### 1. Clone the Repository
Clone this project to your local machine.

### 2. Install Dependencies
Navigate to the project directory and run:
```bash
npm install
```

### 3. Set up Supabase
- Go to [Supabase](https://supabase.com/) and create a new project.
- In your project, navigate to the **SQL Editor**.
- Copy the entire content of `schema.sql.txt` and run it to create the database tables and policies.
- **Deploy Serverless Functions**:
    - You will need to use the Supabase CLI to deploy the functions located in the `supabase/functions` directory. Follow the [Supabase Functions guide](https://supabase.com/docs/guides/functions/deploy) for detailed instructions.

## Configuration

### Frontend (`.env` file)
Create a new file named `.env` in the root of your project by copying the example file:
```bash
cp .env.example .env
```
Now, open the `.env` file and fill in the required values from your Supabase project's API settings. **Important**: For Vite, frontend environment variables must be prefixed with `VITE_`.
```
VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

### Backend (Supabase Function Secrets)
These secrets must be set in your Supabase project dashboard under **Project Settings > Functions**.
```bash
# Get this from your Google Cloud project (Gemini API)
GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"

# Get these from your Google Cloud OAuth 2.0 Client ID settings
GOOGLE_CLIENT_ID="YOUR_GOOGLE_OAUTH_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_OAUTH_CLIENT_SECRET"
```

### Google OAuth Redirect URI
For Google OAuth to work, you must configure the correct redirect URIs in both your Google Cloud Console and your Supabase secrets.

1.  **In Supabase Secrets:** Set the `GOOGLE_REDIRECT_URI` secret. This must point to the `/googleCallback` route of your running application.
    ```bash
    # For local development using the default Vite port:
    GOOGLE_REDIRECT_URI="http://localhost:3000/googleCallback"
    
    # For a local production preview, e.g., on port 4173:
    # GOOGLE_REDIRECT_URI="http://localhost:4173/googleCallback"
    ```

2.  **In Google Cloud Console:** Under your OAuth 2.0 Client ID settings, add the same URI to the "Authorized redirect URIs" list. Also, add the base URL (e.g., `http://localhost:3000`) to the "Authorized JavaScript origins".

## Running Locally

### Development Server
This is best for active development with hot-reloading.
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Production Build & Preview
This simulates a production environment by building the app and serving the static files.
```bash
# 1. Build the application for production
npm run build

# 2. Preview the production build
npm run preview
```
The preview command will start a local static web server. Check the terminal output for the URL (e.g., `http://localhost:4173`).

## Deployment

Follow these steps to deploy the application on a local server.

### 1. Final Code Check
For a real deployment, the application must connect to your Supabase backend, not use mock data.

-   Open the file: `src/components/App.tsx`
-   Find the constant `IS_TESTING_MODE`.
-   **Change its value from `true` to `false`**.
    ```typescript
    // Before
    const IS_TESTING_MODE = true;

    // After
    const IS_TESTING_MODE = false;
    ```

### 2. Build the App
Run the build command to generate the optimized, static application files in the `dist/` directory.
```bash
npm run build
```

### 3. Serve the `dist` Directory
You can use any local static web server to host the contents of the `dist` directory.

-   **Using Vite's Preview (Recommended):**
    ```bash
    npm run preview
    ```
    This command is the simplest way to test the production build locally.

-   **Using a global `serve` package:**
    ```bash
    # If you don't have 'serve' installed: npm install -g serve
    serve -s dist
    ```
    This will serve the `dist` folder and handle SPA routing.

**Remember:** Whichever server and port you use, ensure the `GOOGLE_REDIRECT_URI` in your Supabase secrets matches its URL (e.g., `http://localhost:3000/googleCallback`).
