// const express = require("express");


// const app = express();

// app.use(express.json());

// const positions = {};

// // Processed event IDs
// const processedEventIds = new Set();

// const PORT = 3001;

// app.post("/events", (req, res) => {
//   const event = req.body;

//   const {
//     event_id,
//     symbol,
//     transaction_type,
//     quantity
//   } = event;

//   // Check duplicate event
//   if (processedEventIds.has(event_id)) {
//     console.log(`Duplicate event ignored: ${event_id}`);

//     return res.status(200).json({
//       message: "Duplicate event ignored"
//     });
//   }

//   // Validate event
//   if (
//     !event_id ||
//     !symbol ||
//     (transaction_type !== "BUY" && transaction_type !== "SELL") ||
//     !Number.isInteger(quantity) ||
//     quantity <= 0
//   ) {
//     console.log("Invalid event:", event);

//     return res.status(400).json({
//       message: "Invalid event"
//     });
//   }

//   // First valid event wins
//   processedEventIds.add(event_id);

//   // Update position
//   if (transaction_type === "BUY") {
//     positions[symbol] = (positions[symbol] || 0) + quantity;
//   }

//   if (transaction_type === "SELL") {
//     positions[symbol] = (positions[symbol] || 0) - quantity;
//   }

//   console.log("Position updated:", positions);

//   res.status(200).json({
//     message: "Event processed successfully"
//   });
// });

// app.get("/position", (req, res) => {
//   res.json(positions);
// });

// app.listen(PORT, () => {
//   console.log(`Position Service running on port ${PORT}`);
// });



const express = require("express");

const {
  processEvent,
  getPositions
} = require("./positionManager");

const app = express();

app.use(express.json());

const PORT = 3001;

// Receive order events
app.post("/events", (req, res) => {
  const result = processEvent(req.body);

  // Invalid event
  if (result.message === "Invalid event") {
    return res.status(400).json(result);
  }

  // Valid / duplicate event
  return res.status(200).json(result);
});

// Return current positions
app.get("/position", (req, res) => {
  res.status(200).json(getPositions());
});

// Start server
// app.listen(PORT, () => {
//   console.log(`Position Service running on port ${PORT}`);
// });

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Position Service running on port ${PORT}`);
  });
}

module.exports = app;