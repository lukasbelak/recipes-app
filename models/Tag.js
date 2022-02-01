const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

// eslint-disable-next-line no-undef
module.exports = Tag = mongoose.model("Tag", TagSchema, "tags");
