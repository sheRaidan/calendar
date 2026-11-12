# Resume builder demo plan

## Goal and scope

Build a public, single-resume learning demo that lets visitors add, edit, and delete work-experience items and see all saved items below the form. The API supports CRUD using native Netlify Functions and MongoDB Atlas. Data is fictional; authentication, automated tests, and production-grade abuse prevention are out of scope.

## Proposed structure

- `public/`: static HTML, CSS, and browser JavaScript. The page contains a static resume header and footer, an item-entry form, a status area, and a `<template>` for dynamic resume items.
- `netlify/functions/`: separate native function handlers for the plural read and singular create, update, and delete routes; keep the database connection and Mongoose model in focused modules.
- `netlify.toml`: publish `public` and configure the functions directory.
- `package.json`: declare ESM with `"type": "module"`, application dependencies, and a `dev` script that runs `npx netlify-cli dev`. Do not add Netlify CLI as a dependency.
- `.env.example`: document the single MongoDB connection string variable without real credentials.
- `.gitignore`: exclude `.env`, dependencies, and Netlify-generated local files.
- `README.md`: describe prerequisites, local development, API behavior, and deployment through the Netlify dashboard.

## Data model

Create a Mongoose `ResumeItem` model bound explicitly to the `resume_items` collection. Use Mongoose's built-in casting and validation rather than strict type checks. The proposed fields are:

| Field | Type | Validation and meaning |
| --- | --- | --- |
| `job_title` | String | Required, trimmed; role or position. |
| `start_year` | Number | Required, with reasonable year bounds. |
| `end_year` | Number | Optional, with the same bounds; blank means the role is current. |
| `employer` | String | Required, trimmed; employer name. |
| `accomplishment` | String | Required, trimmed; a short description of an accomplishment. |

Use compatible length limits on text fields in the form and schema. The form should guide users toward valid whole-year input; Mongoose will still perform its normal casting and validation for API requests. No additional index is needed. Use Mongoose's default document identifier and do not reshape or filter retrieved documents before sending them to the browser.

## API and database

1. Use Mongoose and a Node.js version supported by both Mongoose and Netlify's function runtime.
2. Read a single `MONGODB_URI` environment variable containing the Atlas connection string and database name. Connect lazily and reuse a cached connection or connection promise across warm function invocations; clear a failed promise so a later request can retry.
3. Expose these JSON endpoints through Netlify Functions:
   - `GET /api/resume-items`: fetch all documents from `resume_items` and return them as an array, without transforming the retrieved data.
   - `POST /api/resume-item`: accept and validate an item, save it, and return the saved document with HTTP 201.
   - `PUT /api/resume-item?id=<id>`: replace an item's editable fields and return it.
   - `DELETE /api/resume-item?id=<id>`: delete an item and return HTTP 200 with a JSON confirmation and the deleted ID. PUT and DELETE return HTTP 404 when an item is not found. Invalid JSON, IDs, and fields return HTTP 400; unexpected failures return HTTP 500.
4. Configure each function's path so both URLs work locally and after deployment. Avoid exposing connection strings or internal error details. Do not add authentication or an index.

## Browser experience

1. Use a semantic native form with labeled controls, appropriate `required`, length, numeric, and year constraints. Mark optional end year clearly. Disable submission while a request is in flight.
2. Use the Constraint Validation API to show actionable inline messages on invalid fields and clear them when corrected. Preserve entered values if the POST fails; show a useful form-level error for server or network failures.
3. On page load, fetch the GET endpoint and render every returned item below the form. Show accessible loading, empty, and error states.
4. Clone the `<template>` for each item and populate its elements using `textContent`, including a readable indication for a current role when `end_year` is absent. Never insert user-supplied data as HTML.
5. Let visitors edit an item in the form, cancel editing, or confirm deletion. After a successful POST, PUT, or DELETE, fetch the list again so the displayed resume reflects the database. Provide feedback if the subsequent refresh fails.

## Local setup and deployment

1. Copy `.env.example` to `.env` and set `MONGODB_URI` to the Atlas connection string, including the intended database. Keep credentials out of Git; do not overwrite an existing `.env`.
2. Install application dependencies and start the local Netlify development server using `npm run dev`. Document how local environment variables are loaded and the local URL printed by the CLI.
3. Push the project to GitHub. In the Netlify web dashboard, connect the repository, set `MONGODB_URI` as a runtime environment variable for the appropriate deployment contexts, and deploy using the repository configuration. Confirm Atlas network access and database-user permissions allow the Netlify function to connect.
4. Keep secrets out of browser assets and source control. Because the API is public and unauthenticated, anyone who can reach it can read and add records; use fictional data and a dedicated, least-privileged database account. Public deployment may require additional abuse controls before use beyond this demo.

## Manual verification

Automated tests are outside the requested scope. Verify the finished demo manually, both locally and on Netlify:

- An empty collection produces the empty state; existing documents render below the form.
- Missing or invalid form values produce inline feedback, and a valid item persists and appears after submission and page reload.
- An item with no end year renders as current; user-entered markup displays as text rather than executing.
- Invalid JSON or invalid model data receives a client-error response; a database connection failure produces a safe error and does not expose credentials.
- `GET` returns the retrieved documents without application-level reshaping, and direct requests to both API endpoints work through the Netlify routing configuration.
