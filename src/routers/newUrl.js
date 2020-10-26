const express = require("express");
const validateUrl = require("../validateUrl");
const router = new express.Router();
const mongoose = require("mongoose");
const shortId = require("shortid");
const shortUrl = shortId.generate();
const urlSchema = require("../db/createModal");
const Short_url = mongoose.model("Short_url", urlSchema);

router.post("/short_url/new", async (req, res) => {
  const { original_url } = req.body;

  const hostName = new URL(original_url).hostname;
  try {
    const checkUniqureUrl = await Short_url.find({
      original_url: original_url,
    });
    if (checkUniqureUrl.length != 0)
      throw { error: "this url is saved before" };
    const result = await validateUrl(hostName);
    const newDoc = new Short_url({
      original_url: original_url,
      short_url: shortUrl,
    });
    const saveDoc = await newDoc.save();
    res.json({ saveDoc });
  } catch (e) {
    res.status(400).json(e);
  }
});
module.exports = router;
