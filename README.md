## Overview

This project includes an REST-based service (implemented using Node.js + Express) to host the RESTful service that sends the server time to client, data is formatted in JASON, and a client web application (implemented using Node.js + Express + EJS) that accesses the server, sets its own time to the system time of the server, so that both machines are synchronized. The delayed is calculated using one half the client-to-server-to-client round trip time, RTT.

## How to run

first, clone the project by running

```
git clone git@github.com:andrewyang07/Simple-Clock-Synchronization.git
```

and then install node packages by running

```bash
npm install
cd Client
npm install
```

after that start the client, server is already running under heroku: (https://blooming-falls-51922.herokuapp.com/synchronization), and the url of the server is already hard-coded into client, so all we need to do is start the client.

```bash
cd Client
node index.js
```

go to `localhost:8000` to visit the client, click on the button to sync the time

## Design

#### Server

the server is just a simple node.js server that provides RESTful API that sends its system time to the client.

```javascript
app.get("/synchronization", (req, res) => {
  let today = new Date();
  res.json(today);
});
```

#### Client

Client consists of two parts: front-end and back-end

##### front end

The front end part of the client is a web page that has the button to allow user to sync the client time with the server, which is done by sending the API request to the back-end part of the client.
Besides that, front end also displays beautiful UI that shows the current time of Vancouver

```html
<a class="btn btn-primary btn-lg active" href="/synchronization"
  >Click Here to Synchronize Client Time with Server</a
>
```

##### back end

The back end simply listens to the `/synchronization` route, as long as it gets the request from the client, it starts syncing time with server

```javascript
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
```

After syncing the time it then passing the results from synchronization and renders a page that displays the result of synchronization, please see screenshots under `Screenshots` folder to see more details.

```javascript
// prepare the data we need and pass it to the view
let data = {
  serverTime: serverTime,
  clientTime: timeAfter,
  RTT: RTT,
  calculatedTime: newTime
};

res.render("synchronization", { data: data });
```
