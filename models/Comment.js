const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  _user: {
    type: Schema.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
    required: true,
  },
  _comment: {
    type: Schema.ObjectId,
    ref: "Comment",
  },
});

// eslint-disable-next-line no-native-reassign
module.exports = Comment = mongoose.model("Comment", CommentSchema, "comments");
