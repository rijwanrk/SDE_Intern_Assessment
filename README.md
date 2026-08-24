# Order Position Service

A two-service Node.js application that reads order events from a CSV file, validates and deduplicates them, sends accepted events to a Position Maintaining Service over HTTP, and maintains the current net position for each symbol.

## Architecture

The application consists of two independent services:

1. Order Update Service
2. Position Maintaining Service

Flow:

CSV File
   ↓
Order Update Service
   ↓
Validation
   ↓
Duplicate Event Check
   ↓
HTTP POST /events
   ↓
Position Maintaining Service
   ↓
Position Calculation
   ↓
GET /position


## Order Update Service

Responsibilities:

- Read order events from CSV.
- Validate incoming events.
- Reject invalid events.
- Handle duplicate event IDs.
- Process events in CSV order.
- Send accepted events to the Position Maintaining Service.
- Apply a configurable 50 events/second throttle.

### Validation Rules

An event is valid when:

- `event_id` is present.
- `symbol` is present.
- `transaction_type` is either `BUY` or `SELL`.
- `quantity` is a positive integer.

Invalid events are rejected.

For duplicate `event_id`, the first valid event wins.


## Position Maintaining Service

Responsibilities:

- Receive accepted events through HTTP.
- Maintain net position for each symbol.
- BUY increases the position.
- SELL decreases the position.
- Allow negative positions.
- Ignore duplicate event IDs.
- Return current positions through `/position`.


## API Endpoints

### POST /events

Receives an order event.

Example:

```json
{
  "event_id": "evt-1000",
  "symbol": "RELIANCE",
  "transaction_type": "BUY",
  "quantity": 100
}

```text
Order Update Service: 9/9 tests passed
Position Service: 7/7 tests passed