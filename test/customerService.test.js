"use strict";

const { getCustomerStatus } = require("../src/service/customerService");

describe("customerService", () => {
  beforeEach(() => {
    process.env.CUSTOMER_API_URL = "https://api.example.com";
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete process.env.CUSTOMER_API_URL;
    delete global.fetch;
  });

  test("returns customer status when API responds successfully", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ status: "active" })
    });

    const status = await getCustomerStatus("52998224725");

    expect(status).toBe("active");
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.example.com/customers/52998224725"
    );
  });

  test("returns null when API responds with non-ok status", async () => {
    global.fetch.mockResolvedValue({ ok: false });

    const status = await getCustomerStatus("52998224725");

    expect(status).toBeNull();
  });

  test("returns null when API response has no status field", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({})
    });

    const status = await getCustomerStatus("52998224725");

    expect(status).toBeNull();
  });

  test("returns null when fetch throws a network error", async () => {
    global.fetch.mockRejectedValue(new Error("network error"));

    const status = await getCustomerStatus("52998224725");

    expect(status).toBeNull();
  });
});
