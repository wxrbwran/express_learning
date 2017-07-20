/**
 * Created by wuxiaoran on 2017/7/14.
 */
const Customer = require('../models/customer');
const customerViewModel = require('../viewModels/customer');

module.exports = {
  registerRoutes(app) {
    app.get('/customer/:id', this.home);
    app.get('/customer/:id/preferences', this.preferences);
    app.get('/orders/:id', this.orders);
    app.get('/customer/:id/update', this.ajaxUpdate);
  },
  home(req, res, next) {
    const customer = Customer.findById(req.params.id);
    console.log(customer);
    if (!customer) {
      return next(); // 404
    }
    res.render('/customer/home', customerViewModel(customer));
  },
  preferences(req, res, next) {
    const customer = Customer.findById(req.params.id);
    if (!customer) {
      return next(); // 404
    }
    res.render('/customer/preferences', customerViewModel(customer));
  },
  orders(req, res, next) {
    const customer = Customer.findById(req.params.id);
    if (!customer) {
      return next(); // 404
    }
    res.render('/customer/orders', customerViewModel(customer));
  },
  ajaxUpdate(req, res, next) {
    const customer = Customer.findById(req.params.id);
    if (!customer) {
      return res.json({
        status: 'error',
        data: null,
        message: '用户ID不存在!',
      });
    }
    if (req.body.firstName) {
      if (
        typeof req.body.firstName !== 'string' ||
        req.body.firstName.trim() === ''
      ) {
        return res.json({
          status: 'error',
          data: null,
          message: '不合法的firstName!',
        });
      }
      customer.save();
      return res.json({
        status: 'success',
        data: customer,
      });
    }
  },
};
