const express = require("express");
const app = express();
const path = require("path");
const port = 3000;

app.get("/", (req, res) => res.sendFile(path.join(__dirname + "/index.html")));

app.get("/synchronization", (req, res) => {
  let today = new Date();
  res.json(today);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
