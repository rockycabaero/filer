const express = require("express");
const router = express.Router();

let scanner = null;

const sendData = (req, res) => {
  let interval = setInterval(async () => {
    if (scanner) {
      const data = await scanner.getStatus();

      res.write("data: " + JSON.stringify(data) + "\n\n");
    }
  }, 1000);

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
};

router.get("/api/status", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  sendData(req, res);
});

module.exports = (_scanner) => {
  scanner = _scanner;
  return router;
};
