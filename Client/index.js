const express = require("express");
const app = express();
app.set("view engine", "ejs");

const path = require("path");
const axios = require("axios");

const sys = require("util");
const win = require("node-windows");

const port = 8000;
const LOCAL_URL = "http://localhost:3000/synchronization";
const HEROKU_URL = "https://blooming-falls-51922.herokuapp.com/synchronization";

// app.get("/", (req, res) => res.sendFile(path.join(__dirname + "/index.html")));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/synchronization", (req, res) => {
  console.log("start setting time!");
  let timeBefore = new Date().getTime();
  console.log("time before: " + timeBefore);
  axios
    .get(HEROKU_URL)
    .then(response => {
      // calculate RTT = Time after sending HTTP request - time before sending HTTP request
      let timeAfter = new Date();
      let RTT = timeAfter.getTime() - timeBefore;

      let serverTime = new Date(response.data);

      // calculate the new time = Server time + RTT / 2;
      let newTime = new Date(serverTime.getTime() + RTT / 2);

      // get formatted date and time string to set system time
      let day = newTime.getDate();
      let month = newTime.getUTCMonth() + 1;
      let year = newTime.getFullYear();
      let formattedDate = `${year}-${month}-${day}`;
      let hour = newTime.getHours();
      let minute = newTime.getMinutes();
      let second = newTime.getSeconds();
      let formattedTime = `${hour}:${minute}:${second}`;

      // set system time by executing native commands
      let setServerDate = win.elevate(
        `cmd /c date ${formattedDate}`,
        undefined,
        execCallback
      );

      let setServerTime = win.elevate(
        `cmd /c time ${formattedTime}`,
        undefined,
        execCallback
      );

      // prepare the data we need and pass it to the view
      let data = {
        serverTime: serverTime,
        clientTime: timeAfter,
        RTT: RTT,
        calculatedTime: newTime
      };

      res.render("synchronization", { data: data });
    })
    .catch(err => {
      console.log(err);
      Promise.reject(err);
    });
});

app.listen(port, () => console.log(`Client is on port ${port}!`));

function setTime() {}

function execCallback(error, stdout, stderr) {
  if (error) {
    console.log(error);
  } else {
    console.log(stdout);
  }
}
