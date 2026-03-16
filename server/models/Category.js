const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id:    { type: String, required: true, unique: true },
  label: { type: String, required: true },
  icon:  { type: String },
  color: { type: String },
});

module.exports = mongoose.model('Category', categorySchema);
