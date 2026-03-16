const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  author:     { type: String, required: true },
  rating:     { type: Number, min: 1, max: 10, required: true },
  date:       { type: String },
  text:       { type: String, required: true },
  tags:       [String],
  proofImage: { type: String },
});

const featureItemSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  available: { type: Boolean, default: false },
});

const featureCategorySchema = new mongoose.Schema({
  label: String,
  items: [featureItemSchema],
});

const facilitySchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  address:    { type: String, default: 'Address not specified' },
  phone:      { type: String },
  hours:      { type: String, default: 'Contact for hours' },
  verified:   { type: Boolean, default: false },
  score:      { type: Number, min: 0, max: 10, default: 5.0 },
  categories: [String],
  images:     [String],
  coords: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  alert: {
    type:    { type: String, enum: ['amber', 'red'], default: undefined },
    message: { type: String },
  },
  features: {
    wheelchair: featureCategorySchema,
    visual:     featureCategorySchema,
    hearing:    featureCategorySchema,
    mental:     featureCategorySchema,
    cognitive:  featureCategorySchema,
    sensory:    featureCategorySchema,
  },
  reviews: [reviewSchema],
}, { timestamps: true });

module.exports = mongoose.model('Facility', facilitySchema);
