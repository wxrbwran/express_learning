/**
 * Created by wuxiaoran on 2017/7/13.
 */
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    customerId: String,
    orderNumber: Number,
    date: Date,
    status: Boolean,
  },
  {
    collection: 'orders',
  },
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
