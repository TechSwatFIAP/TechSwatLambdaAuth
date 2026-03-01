"use strict";

/**
 * Build a JSON response for API Gateway HTTP API v2.
 * @param {number} statusCode
 * @param {object} payload
 * @returns {{statusCode:number, headers: object, body: string}}
 */
function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  };
}

/**
 * Build an error response.
 * @param {number} statusCode
 * @param {string} message
 * @returns {{statusCode:number, headers: object, body: string}}
 */
function errorResponse(statusCode, message) {
  return jsonResponse(statusCode, { error: message });
}

module.exports = {
  jsonResponse,
  errorResponse
};
