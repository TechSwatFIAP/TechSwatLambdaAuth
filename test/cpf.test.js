"use strict";

const { normalizeCpf, isValidCpf } = require("../src/util/cpf");

describe("cpf utils", () => {
  test("normalizeCpf removes non-digits", () => {
    expect(normalizeCpf("529.982.247-25")).toBe("52998224725");
  });

  test("isValidCpf accepts a valid CPF", () => {
    expect(isValidCpf("52998224725")).toBe(true);
  });

  test("isValidCpf rejects repeated digits", () => {
    expect(isValidCpf("00000000000")).toBe(false);
  });

  test("isValidCpf rejects invalid check digits", () => {
    expect(isValidCpf("52998224724")).toBe(false);
  });

  test("isValidCpf rejects invalid length", () => {
    expect(isValidCpf("123")).toBe(false);
  });
});
