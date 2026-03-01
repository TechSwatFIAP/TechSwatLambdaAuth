"use strict";

jest.mock("../src/service/authService", () => ({
  validateCredentials: jest.fn(),
  generateToken: jest.fn()
}));

const authService = require("../src/service/authService");

const buildEvent = (body) => ({
  version: "2.0",
  routeKey: "POST /auth",
  rawPath: "/auth",
  rawQueryString: "",
  headers: { "content-type": "application/json" },
  requestContext: {
    http: {
      method: "POST",
      path: "/auth",
      protocol: "HTTP/1.1",
      sourceIp: "127.0.0.1",
      userAgent: "jest"
    }
  },
  isBase64Encoded: false,
  body: JSON.stringify(body)
});

describe("handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  test("returns 400 for invalid CPF", async () => {
    const { handler } = require("../src/handler");
    const result = await handler(buildEvent({ cpf: "123", otp: "123456" }));

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ error: "Invalid CPF" });
  });

  test("returns 401 for invalid credentials", async () => {
    authService.validateCredentials.mockResolvedValue(false);

    const { handler } = require("../src/handler");
    const result = await handler(buildEvent({ cpf: "529.982.247-25", otp: "000000" }));

    expect(result.statusCode).toBe(401);
    expect(JSON.parse(result.body)).toEqual({ error: "Invalid credentials" });
  });

  test("returns 200 with token", async () => {
    authService.validateCredentials.mockResolvedValue(true);
    authService.generateToken.mockResolvedValue("jwt-token");

    const { handler } = require("../src/handler");
    const result = await handler(buildEvent({ cpf: "529.982.247-25", otp: "123456" }));

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ token: "jwt-token" });
  });

  test("returns 500 on unexpected error", async () => {
    authService.validateCredentials.mockResolvedValue(true);
    authService.generateToken.mockRejectedValue(new Error("boom"));

    const { handler } = require("../src/handler");
    const result = await handler(buildEvent({ cpf: "529.982.247-25", otp: "123456" }));

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: "Unexpected error" });
  });
});
