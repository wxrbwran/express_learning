/**
 * Created by wuxiaoran on 2017/7/13.
 */

const Customer = require('../models/customer');
const { omit, extend } = require('lodash');

function smartJoin(arr, separator) {
  if (!separator) {
    separator = ' ';
  }
  return arr
    .filter(ele => {
      return ele !== undefined && ele !== null && ele.toString().trim() !== '';
    })
    .join(separator);
}

module.exports = function(customer) {
  // const customer = Customer.findById(customerId);
  // if (!customer) {
  //     return {
  //         error: `Unknown customer id: ${customerId}`
  //     }
  // }
  const orders = customer.getOrder().map(order => {
    return {
      orderNumber: order.orderNumber,
      date: order.date,
      status: order.status,
      url: `/order/${order.orderNumber}`,
    };
  });
  const minusCustomer = omit(customer, 'saleNotes');
  return extend(minusCustomer, {
    name: smartJoin([minusCustomer.firstName, minusCustomer.lastName]),
    fullAddress: smartJoin(
      [
        minusCustomer.address1,
        minusCustomer.address2,
        minusCustomer.city +
          ', ' +
          minusCustomer.state +
          ' ' +
          minusCustomer.zip,
      ],
      '<br>',
    ),
    orders: orders,
  });
};
