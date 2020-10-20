require("dotenv").config();
const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const blogSchema = require("./db/createModal");
const path = require("path");
const bodyParser = require("body-parser");
const db = mongoose.connection;
const validateUrl = require("./validateUrl");
const urlSchema = require("./db/createModal");
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

console.log(path.join(__dirname, "../public/index.html"));
const Short_url = mongoose.model("Short_url", urlSchema);
app.get("/", (req, res) => {
  console.log(req);
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
app.get("/hello", (req, res) => {
  console.log(req.connection.remoteAddress);
  res.json({ mssg: "hello Amr" });
});
app.post("/short_url/new", (req, res) => {
  const { original_url } = req.body;
  hostName = new URL(original_url).hostname;
  validateUrl(hostName)
    .then((result) => {
      if (result) {
        const newDoc = new Short_url({
          original_url: original_url,
        });
        newDoc
          .save()
          .then((doc) => {
            console.log("doc saved");
            res.json(newDoc);
          })
          .catch((err) => {
            console.log("cannot save new Doc!");
          });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});
// the user enters the short url and it will redirect to the linked url with the short url
app.get("/api/shorturl/:shortUrl", (req, res) => {
  console.log(req.params);
  Short_url.findById(req.params.shortUrl).then((doc) => {
    res.redirect(doc.original_url);
  });
});

app.listen(3000, () => {
  console.log("listening");
});
