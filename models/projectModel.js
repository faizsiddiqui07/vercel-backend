const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  projectAddress: {
    type: String,
  },
  projectImages: [
    {
      url: String,
      public_id: String,
    },
  ],
  projectOverview: {
    type: String,
  },
  landArea: {
    type: String,
  },
  builtUpArea: {
    type: String,
  },
  functionality: {
    type: [String],
  },
  amenities: {
    type: [String],
  },
  targetIRR: {
    type: String,
  },
  peRatio: {
    type: String,
  },
  possessionStatus: {
    type: String,
    enum: ['Ready to move', 'Under Construction', 'Possession Soon']
  },
  targetRentalYield: {
    type: String,
  },
  projectAmount: {
    type: Number,
  },
  bookingAmount: {
    type: Number,
  },
  ownershipPlan: {
    firstInstallment: { type: Number },
    secondInstallment: { type: Number },
    thirdInstallment: { type: Number },
    fourthInstallment: { type: Number },
    fifthInstallment: { type: Number },
    sixthInstallment: { type: Number },
    seventhInstallment: { type: Number },
  },
  unitBreakdown: {
    wholeUnit: {
      totalPropertyValue: Number,
      gst: Number,
      stampDuty: Number,
      furnishingCost: Number,
      conveyanceFees: Number,
      facilitationCharges: Number,
      total: Number
    },
    singleUnit: {
      totalPropertyValue: Number,
      gst: Number,
      stampDuty: Number,
      furnishingCost: Number,
      conveyanceFees: Number,
      facilitationCharges: Number,
      total: Number
    }
  },
  date: {
    type: String,
  },
  description: {
    type: String,
  },
  projectStatus: {
    type: String,
    enum: ['Newly Launched', 'Sold Out'],
  },
  status: {
    type: String,
    default: 'pending',
  },
  slug: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("project", projectSchema);
