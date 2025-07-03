const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const reviewSchema = new Schema({
  comment: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true }); // automatically adds createdAt and updatedAt

module.exports = mongoose.model("Review",reviewSchema);
