/**
 * Created by wuxiaoran on 2017/7/13.
 */
const mongoose = require('mongoose');

const attractionSchema = mongoose.Schema(
  {
    name: String,
    description: String,
    location: {
      lat: Number,
      lng: Number,
    },
    history: {
      event: String,
      notes: String,
      email: String,
      date: {
        type: Date,
        default: Date.now(),
      },
    },
    updateId: String,
    approved: Boolean,
  },
  {
    collection: 'attractions',
  },
);

const Attraction = mongoose.model('Attraction', attractionSchema);

module.exports = Attraction;
