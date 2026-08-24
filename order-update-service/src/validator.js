function validateOrder(row) {
  if (!row.event_id || row.event_id.trim() === "") {
    return {
      valid: false,
      reason: "event_id is blank",
    };
  }

  if (!row.symbol || row.symbol.trim() === "") {
    return {
      valid: false,
      reason: "symbol is blank",
    };
  }

  if (row.transaction_type !== "BUY" && row.transaction_type !== "SELL") {
    return {
      valid: false,
      reason: "transaction_type must be BUY or SELL",
    };
  }

  const quantity = Number(row.quantity);

  if (
    row.quantity === undefined ||
    row.quantity === null ||
    row.quantity.trim() === "" ||
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    return {
      valid: false,
      reason: "quantity must be a positive integer",
    };
  }

  return {
    valid: true,
    event: {
      event_id: row.event_id,
      symbol: row.symbol,
      transaction_type: row.transaction_type,
      quantity: quantity,
    },
  };
}

module.exports = validateOrder;