"use strict";

jest.mock("jsonwebtoken", () => ({ sign: jest.fn(() => "service-token") }));

const { getCustomerStatus } = require("../src/service/customerService");

describe("customerService", () => {
  beforeEach(() => {
    process.env.CUSTOMER_API_URL = "http://localhost:8080";
    process.env.JWT_SECRET = "test-secret";
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete process.env.CUSTOMER_API_URL;
    delete process.env.JWT_SECRET;
    delete global.fetch;
    jest.clearAllMocks();
  });

  test("returns 'active' when API responds with active true", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ active: true })
    });

    const status = await getCustomerStatus("52998224725");

    expect(status).toBe("active");
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/api/v1/users/document?documentNumber=52998224725",
      expect.objectContaining({ headers: { Authorization: "Bearer service-token" } })
    );
  });

  test("passes cpf in service token sub claim", async () => {
    const jwt = require("jsonwebtoken");
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ active: true })
    });

    await getCustomerStatus("52998224725");

    expect(jwt.sign).toHaveBeenCalledWith(
      { sub: "user:52998224725", scope: "user" },
      "test-secret",
      { expiresIn: "1m" }
    );
  });

  test("returns 'inactive' when API responds with active false", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ active: false })
    });

    const status = await getCustomerStatus("52998224725");

    expect(status).toBe("inactive");
  });

  test("returns null when API responds with 404", async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 404 });

    const status = await getCustomerStatus("52998224725");

    expect(status).toBeNull();
  });

  test("returns null when API responds with non-ok status", async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 });

    const status = await getCustomerStatus("52998224725");

    expect(status).toBeNull();
  });

  test("returns null when fetch throws a network error", async () => {
    global.fetch.mockRejectedValue(new Error("network error"));

    const status = await getCustomerStatus("52998224725");

    expect(status).toBeNull();
  });
});
