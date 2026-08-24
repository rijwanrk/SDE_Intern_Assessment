const validateOrder = require("../src/validator");

describe("Order Validation", () => {

  test("should accept a valid BUY order", () => {
    const row = {
      event_id: "evt-001",
      symbol: "RELIANCE",
      transaction_type: "BUY",
      quantity: "100"
    };

    const result = validateOrder(row);

    expect(result.valid).toBe(true);
    expect(result.event.quantity).toBe(100);
  });


  test("should accept a valid SELL order", () => {
    const row = {
      event_id: "evt-002",
      symbol: "TCS",
      transaction_type: "SELL",
      quantity: "50"
    };

    const result = validateOrder(row);

    expect(result.valid).toBe(true);
    expect(result.event.quantity).toBe(50);
  });


  test("should reject invalid transaction type", () => {
    const row = {
      event_id: "evt-003",
      symbol: "INFY",
      transaction_type: "HOLD",
      quantity: "100"
    };

    const result = validateOrder(row);

    expect(result.valid).toBe(false);
  });


  test("should reject zero quantity", () => {
    const row = {
      event_id: "evt-004",
      symbol: "INFY",
      transaction_type: "BUY",
      quantity: "0"
    };

    const result = validateOrder(row);

    expect(result.valid).toBe(false);
  });


  test("should reject negative quantity", () => {
    const row = {
      event_id: "evt-005",
      symbol: "INFY",
      transaction_type: "BUY",
      quantity: "-10"
    };

    const result = validateOrder(row);

    expect(result.valid).toBe(false);
  });


  test("should reject non-integer quantity", () => {
    const row = {
      event_id: "evt-006",
      symbol: "INFY",
      transaction_type: "BUY",
      quantity: "10.5"
    };

    const result = validateOrder(row);

    expect(result.valid).toBe(false);
  });


  test("should reject blank quantity", () => {
    const row = {
      event_id: "evt-007",
      symbol: "INFY",
      transaction_type: "BUY",
      quantity: ""
    };

    const result = validateOrder(row);

    expect(result.valid).toBe(false);
  });


  test("should reject blank event_id", () => {
    const row = {
      event_id: "",
      symbol: "INFY",
      transaction_type: "BUY",
      quantity: "100"
    };

    const result = validateOrder(row);

    expect(result.valid).toBe(false);
  });


  test("should reject blank symbol", () => {
    const row = {
      event_id: "evt-008",
      symbol: "",
      transaction_type: "BUY",
      quantity: "100"
    };

    const result = validateOrder(row);

    expect(result.valid).toBe(false);
  });

});