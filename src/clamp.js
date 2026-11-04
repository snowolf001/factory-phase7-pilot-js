export function clamp(value, minimum, maximum) {
  if (minimum > maximum) throw new RangeError('minimum must not exceed maximum');
  return Math.min(maximum, Math.max(minimum, value));
}
