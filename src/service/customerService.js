"use strict";

const jwt = require("jsonwebtoken");
const { getRequiredEnv } = require("../config/env");

function buildServiceToken(cpf) {
  const secret = getRequiredEnv("JWT_SECRET");
  return jwt.sign({ sub: `user:${cpf}`, scope: "user" }, secret, { expiresIn: "1m" });
}

/**
 * Fetch the status of a customer from the users API.
 * @param {string} cpf - normalized CPF (digits only)
 * @returns {Promise<string|null>} "active", "inactive", or null if not found / on error
 */
async function getCustomerStatus(cpf) {
  try {
    const baseUrl = getRequiredEnv("CUSTOMER_API_URL");
    const token = buildServiceToken(cpf);
    const response = await fetch(
      `${baseUrl}/api/v1/users/document?documentNumber=${encodeURIComponent(cpf)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.active === true ? "active" : "inactive";
  } catch (_err) {
    return null;
  }
}

module.exports = { getCustomerStatus };
