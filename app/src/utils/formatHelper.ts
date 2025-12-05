export const maskPhoneNumber = (value: string) => {
  // Remove todos os caracteres não numéricos
  const digits = value.replace(/\D/g, '');

  // Limita a 11 dígitos (DDD + 9 dígitos)
  const truncatedDigits = digits.slice(0, 11);

  let maskedValue = '';

  if (truncatedDigits.length > 0) {
    maskedValue = `(${truncatedDigits.slice(0, 2)}`;
  }
  if (truncatedDigits.length > 2) {
    maskedValue += `) ${truncatedDigits.slice(2, 7)}`;
  }
  if (truncatedDigits.length > 7) {
    maskedValue += `-${truncatedDigits.slice(7)}`;
  }

  return maskedValue;
};
