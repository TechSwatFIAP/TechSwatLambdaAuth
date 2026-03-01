"use strict";

/**
 * Normalize CPF by removing non-digit characters.
 * @param {string} cpf
 * @returns {string}
 */
function normalizeCpf(cpf) {
  return String(cpf || "").replace(/\D/g, "");
}

/**
 * Validate CPF using check digit algorithm.
 * @param {string} cpf
 * @returns {boolean}
 */
function isValidCpf(cpf) {
  // Step 1: CPF must have exactly 11 digits after normalization.
  if (cpf.length !== 11) {
    return false;
  }

  // Step 2: reject CPFs with all digits equal (e.g., 00000000000).
  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  // Step 3: convert digits to numbers for calculation.
  const digits = cpf.split("").map((d) => Number(d));

  // Step 4: calculate the weighted sum for the check digit positions.
  const sumWeightedDigits = (length) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) {
      const weight = length + 1 - index;
      sum += digits[index] * weight;
    }
    return sum;
  };

  // Step 5: calculate each check digit from the weighted sum.
  const calculateCheckDigit = (length) => {
    const sum = sumWeightedDigits(length);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  // Step 6: compare calculated check digits with the last two digits.
  const firstCheck = calculateCheckDigit(9);
  const secondCheck = calculateCheckDigit(10);

  return digits[9] === firstCheck && digits[10] === secondCheck;
}

module.exports = {
  normalizeCpf,
  isValidCpf
};
