export const formatPhoneNumber = (phone) => {
  if (!phone) return '-';
  // If phone already includes country code
  if (phone.startsWith('+88')) {
    return phone;
  }
  // Otherwise, add country code
  return `+88${phone}`;
}
