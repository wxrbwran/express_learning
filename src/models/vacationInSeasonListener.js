/**
 * Created by wuxiaoran on 2017/7/12.
 */
const mongoose = require('mongoose');

const vacationInSeasonListener = mongoose.Schema(
  {
    email: String,
    sku: [String],
  },
  {
    collection: 'vacationInSeasonListeners',
  },
);

const VacationInSeasonListener = mongoose.model(
  'VacationInSeasonListener',
  vacationInSeasonListener,
);

module.exports = VacationInSeasonListener;
