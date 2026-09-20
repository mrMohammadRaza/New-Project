const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    type: {
      type: String,
      enum: ['HUMIDITY_ALERT', 'DISEASE_WARNING', 'WEATHER_ALERT', 'SYSTEM'],
      default: 'HUMIDITY_ALERT'
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    humidity: {
      type: Number,
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
