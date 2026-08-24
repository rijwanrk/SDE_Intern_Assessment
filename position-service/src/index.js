const express = require("express");

const {
  processEvent,
  getPositions
} = require("./positionManager");

const app = express();

app.use(express.json());

const PORT = 3001;


app.post("/events", (req, res) => {
  const result = processEvent(req.body);


  if (result.message === "Invalid event") {
    return res.status(400).json(result);
  }


  return res.status(200).json(result);
});


app.get("/position", (req, res) => {
  res.status(200).json(getPositions());
});



if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Position Service running on port ${PORT}`);
  });
}

module.exports = app;