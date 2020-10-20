const mongoose = require("mongoose");
const { Schema } = mongoose;
const urlSchema = new Schema({
  original_url: { type: String, required: true },
  short_url: {
    type: String,
    required: true,
  },
});
module.exports = urlSchema;
