require("dotenv").config();
const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const blogSchema = require("./db/createModal");
const path = require("path");
const bodyParser = require("body-parser");
const db = mongoose.connection;
// const validateUrl = require("./validateUrl");
const urlSchema = require("./db/createModal");
const router = require("./routers/newUrl");

// console.log(shortUrl, 1);
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
db.on("error", (err) => {
  console.log(err, "error in database");
});
db.once("open", () => {
  console.log("database connected");
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

console.log(path.join(__dirname, "../public/index.html"));
const Short_url = mongoose.model("Short_url", urlSchema);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// the user enters the short url and it will redirect to the linked url with the short url
app.get("/api/shorturl/:shortUrl", async (req, res) => {
  try {
    const urlDoc = await Short_url.findOne({ short_url: req.params.shortUrl });
    if (!urlDoc) res.status(400).json({ error: "" });
    res.status(300).redirect(urlDoc.original_url);
  } catch (e) {
    res.status(400).send("cannot find this short url");
  }
});

app.listen(3000, () => {
  console.log("listening");
});
