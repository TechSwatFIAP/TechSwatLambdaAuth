#!/usr/bin/env node
"use strict";

require("dotenv").config({ path: process.env.ENV_FILE || ".env" });
const { handler } = require("../src/handler");
const baseEvent = require("../event.json");

const cpf = process.argv[2];
const otp = process.argv[3] || "123456";

if (!cpf) {
  console.error("Uso: npm run invokeCpfLambda -- <CPF> [OTP]");
  process.exit(1);
}

const event = { ...baseEvent, body: JSON.stringify({ cpf, otp }) };

handler(event).then((r) => console.log(JSON.stringify(r, null, 2)));
