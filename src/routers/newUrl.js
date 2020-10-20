const express = require("express");
const validateUrl = require("../validateUrl");
const router = new express.Router();
const mongoose = require("mongoose");
const shortId = require("shortid");
const shortUrl = shortId.generate();
const urlSchema = require("../db/createModal");
const Short_url = mongoose.model("Short_url", urlSchema);
router.post("/short_url/new", (req, res) => {
  const { original_url } = req.body;
  hostName = new URL(original_url).hostname;
  validateUrl(hostName)
    .then((result) => {
      if (result) {
        const newDoc = new Short_url({
          original_url: original_url,
          short_url: shortUrl,
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
module.exports = router;
