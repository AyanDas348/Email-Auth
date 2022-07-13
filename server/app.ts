//run npm start to deploy the code
//require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
//const cors = require("cors");
//const fs = require("fs");
//const router = require("./routes/auth");

const app = express();
//const http = require("http").createServer(app);

//Static folder
app.use(express.static(path.join(__dirname, 'public')))

app.get("/", () => {
  console.log({ message: "hello world" });
});

//Bodyparser middleware
app.use(bodyParser.urlencoded({extended: true}));

//middlewares
//app.use(express.json({ limit: "5mb" }));
//app.use(express.urlencoded({ extended: true }));
//app.use(
// cors({
//    origin: [process.env.CLIENT_ORIGIN, process.env.LOCALHOST_ORIGIN],
//  })
//);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Backend server started successfully on ${port}`);
});

