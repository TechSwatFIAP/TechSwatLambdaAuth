"use strict";

const { jsonResponse, errorResponse } = require("../src/util/response");

describe("response utils", () => {
  test("jsonResponse returns standard shape", () => {
    const result = jsonResponse(200, { ok: true });
    expect(result).toEqual({
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true })
    });
  });

  test("errorResponse returns error payload", () => {
    const result = errorResponse(400, "Invalid CPF");
    expect(result).toEqual({
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Invalid CPF" })
    });
  });
});
