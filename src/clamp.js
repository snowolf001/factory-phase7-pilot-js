export function clamp(value, minimum, maximum) {
  if (!Number.isFinite(value) || !Number.isFinite(minimum) || !Number.isFinite(maximum)) {
    throw new TypeError('inputs must be finite numbers');
  }
  if (minimum > maximum) throw new RangeError('minimum must not exceed maximum');
  return Math.min(maximum, Math.max(minimum, value));
}
