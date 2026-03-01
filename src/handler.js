"use strict";

const { loadEnv, getRequiredEnv } = require("./config/env");
const { normalizeCpf, isValidCpf } = require("./util/cpf");
const { jsonResponse, errorResponse } = require("./util/response");
const { validateCredentials, generateToken } = require("./service/authService");

loadEnv();

/**
 * Safely parse a JSON body for API Gateway HTTP API v2 events.
 * @param {object} event
 * @returns {object}
 */
function parseJsonBody(event) {
  if (!event || !event.body) {
    return {};
  }

  let raw = event.body;
  if (event.isBase64Encoded) {
    raw = Buffer.from(event.body, "base64").toString("utf8");
  }

  try {
    return JSON.parse(raw);
  } catch (_err) {
    return {};
  }
}

/**
 * AWS Lambda handler for API Gateway HTTP API v2.
 * @param {object} event
 * @returns {Promise<{statusCode:number, headers: object, body: string}>}
 */
exports.handler = async (event) => {
  try {
    const body = parseJsonBody(event);
    const cpf = normalizeCpf(body.cpf);
    const otp = String(body.otp || "");

    if (!isValidCpf(cpf)) {
      return errorResponse(400, "Invalid CPF");
    }

    const isValid = await validateCredentials(cpf, otp);
    if (!isValid) {
      return errorResponse(401, "Invalid credentials");
    }

    const secret = getRequiredEnv("JWT_SECRET");
    const token = await generateToken(cpf, secret);

    return jsonResponse(200, { token });
  } catch (_err) {
    return errorResponse(500, "Unexpected error");
  }
};
