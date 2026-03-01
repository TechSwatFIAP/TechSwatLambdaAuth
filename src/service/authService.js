"use strict";

const jwt = require("jsonwebtoken");
const { normalizeCpf, isValidCpf } = require("../util/cpf");

/**
 * Simulate credential validation.
 * @param {string} cpf
 * @param {string} otp
 * @returns {Promise<boolean>}
 */
async function validateCredentials(cpf, otp) {
  const normalized = normalizeCpf(cpf);
  if (!isValidCpf(normalized)) {
    return false;
  }

  // Simulated OTP validation (replace with real provider in production).
  return otp === "123456";
}

/**
 * Generate JWT token for a user.
 * @param {string} cpf
 * @param {string} secret
 * @returns {Promise<string>}
 */
async function generateToken(cpf, secret) {
  const normalized = normalizeCpf(cpf);
  const payload = {
    sub: `user:${normalized}`,
    scope: "user"
  };

  return jwt.sign(payload, secret, { expiresIn: "15m" });
}

module.exports = {
  validateCredentials,
  generateToken
};
