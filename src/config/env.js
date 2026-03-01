"use strict";

const dotenv = require("dotenv");

/**
 * Load environment variables from .env when available.
 */
function loadEnv() {
  dotenv.config();
}

/**
 * Get required environment variable or throw.
 * @param {string} key
 * @returns {string}
 */
function getRequiredEnv(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

module.exports = {
  loadEnv,
  getRequiredEnv
};
