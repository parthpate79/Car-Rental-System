# DriveEase Car Rental

A car rental marketplace built with React, Redux, Ant Design, Express and MongoDB.

Live site: https://car-rental-system-phi-one.vercel.app/

## Features

- Public fleet browsing with name, city, fuel, seating, hourly price and availability filters.
- Account sign-in, rental reservations, booking receipts and booking management.
- Pay at Pickup with an itemized rental, optional driver and service fee breakdown.
- Owner listings, review status and earnings.
- Protected admin fleet, listing approvals and revenue management.
- Responsive navigation and an automated rental guide.

## Local development

Install server dependencies with `npm ci` at the root and client dependencies with `npm ci --prefix client`.

Configure the server's `.env` with `MONGO_URL`, `JWT_SECRET` and the existing upload provider settings. Set `client/.env` to `REACT_APP_API_URL=http://localhost:5000` for local development. Never commit secret values.

Run `npm run dev` in one terminal and `npm start --prefix client` in another. Open http://localhost:3000/.

## Verification and publishing

See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel and Render configuration, test commands, payment limitations and the database credential rotation follow-up.
