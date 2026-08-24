const request = require("supertest");

const app = require("../src/index");

const {
  processEvent,
  getPositions
} = require("../src/positionManager");

describe("Position Manager", () => {

  test("should increase position for BUY", () => {
    const event = {
      event_id: "evt-buy-001",
      symbol: "RELIANCE",
      transaction_type: "BUY",
      quantity: 100
    };

    const result = processEvent(event);

    expect(result.processed).toBe(true);
    expect(getPositions().RELIANCE).toBe(100);
  });

  test("should decrease position for SELL", () => {
  const event = {
    event_id: "evt-sell-001",
    symbol: "TCS",
    transaction_type: "SELL",
    quantity: 50
  };

  const result = processEvent(event);

  expect(result.processed).toBe(true);
  expect(getPositions().TCS).toBe(-50);
});

test("should maintain positions for multiple symbols", () => {
  const relianceEvent = {
    event_id: "evt-multi-001",
    symbol: "RELIANCE",
    transaction_type: "BUY",
    quantity: 200
  };

  const infyEvent = {
    event_id: "evt-multi-002",
    symbol: "INFY",
    transaction_type: "BUY",
    quantity: 150
  };

  processEvent(relianceEvent);
  processEvent(infyEvent);

  expect(getPositions().RELIANCE).toBe(300);
  expect(getPositions().INFY).toBe(150);
});

test("should ignore duplicate event_id", () => {
  const event = {
    event_id: "evt-duplicate-001",
    symbol: "HDFC",
    transaction_type: "BUY",
    quantity: 100
  };

  const firstResult = processEvent(event);
  const secondResult = processEvent(event);

  expect(firstResult.processed).toBe(true);
  expect(secondResult.processed).toBe(false);
  expect(secondResult.duplicate).toBe(true);

  expect(getPositions().HDFC).toBe(100);
});

test("should correctly calculate zero position", () => {
  const buyEvent = {
    event_id: "evt-zero-001",
    symbol: "WIPRO",
    transaction_type: "BUY",
    quantity: 100
  };

  const sellEvent = {
    event_id: "evt-zero-002",
    symbol: "WIPRO",
    transaction_type: "SELL",
    quantity: 100
  };

  processEvent(buyEvent);
  processEvent(sellEvent);

  expect(getPositions().WIPRO).toBe(0);
});

test("should allow negative position", () => {
  const event = {
    event_id: "evt-negative-001",
    symbol: "ICICI",
    transaction_type: "SELL",
    quantity: 75
  };

  processEvent(event);

  expect(getPositions().ICICI).toBe(-75);
});

});