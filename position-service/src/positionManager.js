const positions = {};
const processedEventIds = new Set();

function processEvent(event) {
  const {
    event_id,
    symbol,
    transaction_type,
    quantity
  } = event;

  if (processedEventIds.has(event_id)) {
    return {
      processed: false,
      duplicate: true,
      message: "Duplicate event ignored"
    };
  }

  
  if (
    !event_id ||
    !symbol ||
    (transaction_type !== "BUY" && transaction_type !== "SELL") ||
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    return {
      processed: false,
      duplicate: false,
      message: "Invalid event"
    };
  }


  processedEventIds.add(event_id);

  if (transaction_type === "BUY") {
    positions[symbol] = (positions[symbol] || 0) + quantity;
  }

  if (transaction_type === "SELL") {
    positions[symbol] = (positions[symbol] || 0) - quantity;
  }

  return {
    processed: true,
    duplicate: false,
    message: "Event processed successfully"
  };
}

function getPositions() {
  return { ...positions };
}

module.exports = {
  processEvent,
  getPositions
};