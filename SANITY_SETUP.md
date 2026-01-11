# Sanity CMS Migration Guide

This document outlines the steps to migrate the existing static JSON news portal to Sanity CMS.

## 1. Create a Sanity Project

If you haven't already, create a new Sanity project at [https://sanity.io/manage](https://sanity.io/manage). Note your **Project ID** and **Dataset** (default: `production`). You'll also need a **write token** for data migration.

## 2. Set Up Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Sanity credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual values:

```
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_TOKEN=your-write-token-optional

# For migration script (Node.js)
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_TOKEN=your-write-token
```

## 3. Configure CORS Origins

To allow your frontend (running locally) to query Sanity, add your local development URL to Sanity's CORS settings:

1. Go to [https://sanity.io/manage](https://sanity.io/manage)
2. Select your project.
3. Navigate to **API** → **CORS Origins**.
4. Add the following origin:
   - `http://localhost:5173` (Vite default)
   - `http://localhost:3000` (if using another port)
5. Ensure **Allow credentials** is checked (if using token).
6. Save.

## 4. Install Sanity Studio (Optional)

If you want to run Sanity Studio locally for content management:

```bash
cd sanity-studio
npm install
npm run dev
```

The studio will be available at `http://localhost:3333`.

## 5. Run Data Migration

Before running the migration, ensure you have Node.js installed and dependencies installed in the root project (if not, run `npm install` in the project root). Then install the required packages for the migration script:

```bash
npm install @sanity/client axios dotenv
```

Now execute the migration script:

```bash
node scripts/migrate-to-sanity.js
```

This will:
- Download images from the original URLs
- Upload them as Sanity assets
- Create Category and Article documents in your Sanity dataset
- Preserve original IDs for backward compatibility

## 6. Update Frontend Dependencies

Ensure your frontend has the Sanity client installed:

```bash
npm install @sanity/client
```

## 7. Run the Application

Start the Vite dev server as usual:

```bash
npm run dev
```

The application will now fetch data from Sanity instead of the static JSON files. Verify that the news listing and detail pages work correctly.

## 8. Deploy Sanity Studio (Optional)

To deploy Sanity Studio for your team, run:

```bash
cd sanity-studio
npm run deploy
```

Follow the prompts to deploy to Sanity's hosted studio.

## 9. Troubleshooting

- **CORS errors**: Double‑check your CORS origins in the Sanity manage panel.
- **Missing images**: The migration script may fail to download some external images. You can manually upload them via the Studio.
- **Environment variables**: Ensure `.env.local` is loaded by Vite (requires `VITE_` prefix).
- **Loader errors**: Check browser console for network errors; verify project ID and dataset.

## 10. Schema Reference

The Sanity schema is defined in `sanity-studio/schema.ts`. You can modify it according to your needs and redeploy the studio.

--- 

Congratulations! Your news portal is now powered by Sanity CMS.