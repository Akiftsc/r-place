'use strict';

const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();
const Brush = require("./schemas/brushSchema");
require('dotenv').config()



app.use(cors());
app.use(express.json());
app.use(express.static('../public'));

mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true, }
);

mongoose.connection.on("error", console.error.bind(console, "connection error: "));
mongoose.connection.once("open", function () {
    console.log("Connected successfully");
});

app.get("/map", async (req, res) => {
    const data = await Brush.find();
    res.json(data);
})


module.exports = app;
