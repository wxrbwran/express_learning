/**
 * Created by wuxiaoran on 2017/7/13.
 */
const mongoose = require('mongoose');
const Order = require('./order');

const customerSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: String,
    firstName: String,
    lastName: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
    salesNotes: [{
        data: {
            type: Date,
            default: Date.now(),
        },
        salespersonId: Number,
        notes: String,
    }]
},{
    collection: 'customers'
});

customerSchema.methods.getOrder = function () {
    return Order.find({ customerId: this._id });
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
