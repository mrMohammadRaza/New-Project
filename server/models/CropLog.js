const mongoose = require('mongoose');

const CropLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    imageUrl: {
      type: String,
      required: [true, 'Crop diagnosis image URL is required']
    },
    diseaseName: {
      type: String,
      required: [true, 'Disease name is required'],
      trim: true
    },
    treatmentPlan: {
      type: String,
      required: [true, 'Treatment plan is required']
    },
    confidence: {
      type: Number,
      default: 0.94
    },
    severity: {
      type: String,
      enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
      default: 'HIGH'
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CropLog', CropLogSchema);
