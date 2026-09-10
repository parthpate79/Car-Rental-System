export const isBookedNow = (car, now = Date.now()) =>
  (car.bookedTimeSlots || []).some(slot =>
    new Date(slot.from).getTime() <= now && new Date(slot.to).getTime() > now
  );

export function safeReturnPath(value) {
  return typeof value === 'string' && value.startsWith('/') &&
    !value.startsWith('//') && !value.includes('\\') && !/[\r\n]/.test(value)
    ? value : '/';
}
