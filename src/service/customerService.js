"use strict";

const { getRequiredEnv } = require("../config/env");

/**
 * Fetch the status of a customer from the customer API.
 * @param {string} cpf - normalized CPF (digits only)
 * @returns {Promise<string|null>} customer status or null if not found / on error
 */
async function getCustomerStatus(cpf) {
  const baseUrl = getRequiredEnv("CUSTOMER_API_URL");

  try {
    const response = await fetch(`${baseUrl}/customers/${cpf}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.status || null;
  } catch (_err) {
    return null;
  }
}

module.exports = { getCustomerStatus };
