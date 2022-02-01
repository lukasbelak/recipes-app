const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

// eslint-disable-next-line no-undef
module.exports = Category = mongoose.model(
  "Category",
  CategorySchema,
  "categories"
);
