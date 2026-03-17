#!/usr/bin/env node
"use strict";

require("dotenv").config();
const jwt = require("jsonwebtoken");

const cpf    = process.argv[2];

if (!cpf) {
  console.error("Uso: npm run dev -- <CPF>");
  process.exit(1);
}
const secret = process.env.JWT_SECRET;

if (!secret) {
  console.error("JWT_SECRET not set in .env");
  process.exit(1);
}

const token = jwt.sign(
  { sub: `user:${cpf}`, scope: "user" },
  secret,
  { expiresIn: "24h" }
);

process.stdout.write(token + "\n");
