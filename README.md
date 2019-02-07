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
