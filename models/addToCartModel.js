const mongoose = require('mongoose');

const addToCartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product', // Reference to your Product model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Reference to your User model 
    required: true,
  },
  quantity: {
    type: Number, 
    default: 1,
  },
  
},{
    timestamps:true
});

module.exports = mongoose.model('AddToCart', addToCartSchema);