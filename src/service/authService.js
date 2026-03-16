"use strict";

const jwt = require("jsonwebtoken");
const { normalizeCpf, isValidCpf } = require("../util/cpf");
const { getCustomerStatus } = require("./customerService");

/**
 * Validate credentials and customer status.
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
  if (otp !== "123456") {
    return false;
  }

  // Validate that the customer account is active.
  const status = await getCustomerStatus(normalized);
  return status === "active";
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
