const test = require('node:test');
const assert = require('node:assert/strict');
const Car = require('../models/carModel');
const Booking = require('../models/bookingModel');
const router = require('../routes/bookingsRoute');
const handler = router.stack.find(layer => layer.route?.path === '/bookcar').route.stack.at(-1).handle;
const carId = '507f1f77bcf86cd799439011';
const from = new Date(Date.now() + 86400000).toISOString();
const to = new Date(Date.now() + 90000000).toISOString();

async function request(body) {
 const response = { status(code) { this.code = code; return this; }, json(data) { this.body = data; return this; } };
 await handler({ body, user: { _id: carId } }, response);
 return response;
}

test('invalid, past and reversed booking dates are rejected before database access', async () => {
 for (const range of [{ from: 'invalid', to }, { from: '2000-01-01', to }, { from: to, to: from }]) {
  const response = await request({ car: carId, bookedTimeSlots: range });
  assert.equal(response.code, 400);
 }
});

test('unavailable cars and unverified card payments cannot create bookings', async () => {
 const originalFind = Car.findById;
 const originalCreate = Booking.create;
 let created = false;
 Booking.create = async () => { created = true; throw new Error('Must not create'); };
 try {
  Car.findById = async () => ({ isActive: false });
  assert.equal((await request({ car: carId, bookedTimeSlots: { from, to } })).code, 404);
  Car.findById = async () => ({ _id: carId, bookedTimeSlots: [], rentPerHour: 100 });
  const response = await request({ car: carId, bookedTimeSlots: { from, to }, paymentMethod: 'card', token: { id: 'fake-token' } });
  assert.equal(response.code, 400);
  assert.match(response.body.message, /Online payments are not available/);
  assert.equal(created, false);
 } finally {
  Car.findById = originalFind;
  Booking.create = originalCreate;
 }
});
