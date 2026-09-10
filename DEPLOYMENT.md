# DriveEase deployment

Production frontend: https://car-rental-system-phi-one.vercel.app/

Production API: https://car-rental-system-letest.onrender.com/

## Vercel

- Repository: `parthpate79/Car-Rental-System`, production branch `main`.
- Root directory: `client`; build command: `npm run build`; output: `build`.
- Set `REACT_APP_API_URL` to the production API URL. The local `client/.env` points to localhost and must not be deployed.
- The client rewrite allows refreshes and direct links to booking and admin routes.

## Render

- Root directory: repository root; install: `npm ci`; start: `npm start`.
- Required secrets: `MONGO_URL`, `JWT_SECRET`; retain existing Cloudinary variables for uploads.
- `FRONTEND_URL` may contain the frontend origin; the production Vercel origin is also in the server allowlist.
- Deploy the same commit to both services. Verify the API health endpoint, public fleet, sign-in and protected admin routes after deployment.

## Payment behavior

Pay at Pickup is supported. Card checkout is disabled because the previous test-token flow did not charge or verify payments. Do not enable real card payments until server-side payment verification and refund handling are implemented and tested.

## Security follow-up

The previously tracked `client/atlas-credentials.env` is removed from Git tracking but retained locally. Rotate the exposed MongoDB credentials and update Render's secret environment variables. Earlier commits still contain the old file; this change does not rewrite Git history.

## Checks

```powershell
$env:CI='true'
npm test --prefix client -- --watchAll=false --runInBand
node --test tests/booking-validation.test.cjs
$env:REACT_APP_API_URL='https://car-rental-system-letest.onrender.com'
npm run build --prefix client
```

Authenticated bookings and admin writes should be smoke-tested with a designated test account and vehicle. Avoid creating charges or changing real customer bookings during deployment verification.
