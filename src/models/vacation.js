/**
 * Created by wuxiaoran on 2017/7/11.
 */
const mongoose = require('mongoose');

const vacationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '请填写姓名!'],
    },
    slug: String,
    category: String,
    sku: String,
    description: String,
    priceInCents: {
      type: Number,
      min: [0.1, '太小了!'],
      max: 9999999,
    },
    tags: [String],
    inSeason: Boolean,
    available: Boolean,
    requiresWaiver: Boolean,
    maximumGuests: Number,
    notes: String,
    packagesSold: Number,
  },
  {
    collection: 'vacations',
  },
);

vacationSchema.methods.displayPrice = function() {
  return `${(this.priceInCents / 100).toFixed(2)}`;
};

// virtual比methods 效率高

// vacationSchema.virtual('displayPrice').get(function() {
//   return `${(this.priceInCents / 100).toFixed(2)}`;
// });

const Vacation = mongoose.model('Vacation', vacationSchema);

module.exports = Vacation;
