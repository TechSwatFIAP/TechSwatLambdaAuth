"use strict";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "token")
}));

const jwt = require("jsonwebtoken");
const { validateCredentials, generateToken } = require("../src/service/authService");

describe("authService", () => {
  test("validateCredentials rejects invalid CPF", async () => {
    const result = await validateCredentials("123", "123456");
    expect(result).toBe(false);
  });

  test("validateCredentials rejects invalid OTP", async () => {
    const result = await validateCredentials("529.982.247-25", "000000");
    expect(result).toBe(false);
  });

  test("validateCredentials accepts valid CPF + OTP", async () => {
    const result = await validateCredentials("529.982.247-25", "123456");
    expect(result).toBe(true);
  });

  test("generateToken signs JWT with expected payload", async () => {
    const token = await generateToken("529.982.247-25", "secret");
    expect(token).toBe("token");
    expect(jwt.sign).toHaveBeenCalledWith(
      { sub: "user:52998224725", scope: "user" },
      "secret",
      { expiresIn: "15m" }
    );
  });
});
