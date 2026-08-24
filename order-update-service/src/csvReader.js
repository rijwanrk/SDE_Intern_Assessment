const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");

const validateOrder = require("./validator");

const filePath = "./order_updates.csv";
const POSITION_SERVICE_URL = "http://localhost:3001/events";

// First valid event for an ID wins
const processedEventIds = new Set();

// 50 events / second = 20ms minimum gap
const THROTTLE_MS = 20;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendEvent(event) {
  try {
    const response = await axios.post(
      POSITION_SERVICE_URL,
      event
    );

    console.log(
      `Event sent successfully: ${event.event_id}`
    );

    return response.data;
  } catch (error) {
    console.error(
      `Failed to send event ${event.event_id}: ${error.message}`
    );

    return null;
  }
}

async function processCSV() {
  try {
    const stream = fs
      .createReadStream(filePath)
      .pipe(csv());

    for await (const row of stream) {
      // 1. Validate
      const result = validateOrder(row);

      if (!result.valid) {
        console.log(
          `Rejected: ${result.reason}`
        );

        continue;
      }

      const event = result.event;

      // 2. Duplicate check
      if (processedEventIds.has(event.event_id)) {
        console.log(
          `Duplicate ignored: ${event.event_id}`
        );

        continue;
      }

      // 3. First valid event wins
      processedEventIds.add(event.event_id);

      console.log(
        `Accepted: ${event.event_id}`
      );

      // 4. Send to Position Service
      await sendEvent(event);

      // 5. Throttle
      await sleep(THROTTLE_MS);
    }

    console.log(
      "Input processing completed."
    );
  } catch (error) {
    console.error(
      "CSV processing failed:",
      error.message
    );
  }
}

processCSV();