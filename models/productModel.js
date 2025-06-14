const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productCode: {
    type: String,
  },
  color: {
    type: String,
  },
  colorName: {
    type: String,
  },
  slug: {
    type: String,
  },
  category: {
    type: String,
  },
  productImage: [
    {
      url: String,
      public_id: String,
    },
  ],
  isFurniture: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
  },
  discountedPrice: {
    type: Number,
  },
  productDimensions: {
    type: String,
  },
  storage: {
    type: String,
  },
  pillowIncluded: {
    type: String,
  },
  careInstructions: {
    type: String,
  },
  frameMaterial: {
    type: String,
  },
  seatLength: {
    type: String,
  },
  seatHeight: {
    type: String,
  },
  seatDepth: {
    type: String,
  },
  seatCapacity: {
    type: String,
  },
  date: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    default: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("product", productSchema);
