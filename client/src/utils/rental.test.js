import { isBookedNow, safeReturnPath } from './rental';
import { answerQuestion } from './assistant';

test('past and future reservations do not count as cars currently rented', () => {
 const now = new Date('2026-09-10T12:00:00Z').getTime();
 expect(isBookedNow({ bookedTimeSlots: [{ from: '2026-09-09', to: '2026-09-10' }] }, now)).toBe(false);
 expect(isBookedNow({ bookedTimeSlots: [{ from: '2026-09-11', to: '2026-09-12' }] }, now)).toBe(false);
 expect(isBookedNow({ bookedTimeSlots: [{ from: '2026-09-10', to: '2026-09-11' }] }, now)).toBe(true);
 expect(isBookedNow({ bookedTimeSlots: [{ from: 'invalid', to: 'invalid' }] }, now)).toBe(false);
});
test('return paths retain booking dates but reject external redirects', () => {
 expect(safeReturnPath('/booking/123?from=1&to=2')).toBe('/booking/123?from=1&to=2');
 for (const value of ['//example.com', '/\\example.com', 'https://example.com', null]) expect(safeReturnPath(value)).toBe('/');
});
test('assistant answers specific booking questions before generic car intent', () => {
 expect(answerQuestion('How do I cancel my car booking?').action).toBe('Manage my bookings');
 expect(answerQuestion('Can I pay by card?').text).toContain('not currently available');
 expect(answerQuestion('list my car').href).toBe('/list-your-car');
 expect(answerQuestion('weather tomorrow').text).toContain('cannot access your account');
});
