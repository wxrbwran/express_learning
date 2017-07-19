/**
 * Created by wuxiaoran on 2017/7/12.
 */
const express = require('express');
const router = express.Router();
const Vacation = require('../models/vacation');
const VacationInSeasonListener = require('../models/vacationInSeasonListener');

function convertFromUSD(value, currency) {
  switch (currency) {
    case 'USD':
      return value * 1;
    case 'GBP':
      return value * 0.6;
    case 'BTC':
      return value * 0.0023707918444761;
    default:
      return NaN;
  }
}

router.get('/', function(req, res, next) {
  Vacation.find({ available: true }, function(err, vacations) {
    const currency = req.session.currency || 'USD';
    const context = vacations.map(vacation => {
      console.log(vacation);
      return {
        sku: vacation.sku,
        name: vacation.name,
        description: vacation.description,
        price: convertFromUSD(vacation.displayPrice(), currency),
        inSeason: vacation.inSeason,
      };
    });
    res.render('vacation', {
      vacations: context,
    });
  });
});

router.get('/set-currency/:currency', function(req, res) {
  req.session.currency = req.params.currency;
  return res.redirect(303, '/vacation');
});

router.get('/notify-me', function(req, res, next) {
  res.render('notify-me', {
    sku: req.query.sku,
  });
});
router.post('/notify-me', function(req, res, next) {
  VacationInSeasonListener.update(
    { email: req.body.email },
    { $addToSet: { sku: req.body.sku } },
    { upsert: true },
    err => {
      if (err) {
        console.log(err.stack);
        req.session.flash = {
          type: 'danger',
          intro: 'Ooops!',
          message: 'there was an error...',
        };
        return res.redirect(303, '/vacation');
      } else {
        req.session.flash = {
          type: 'success',
          intro: 'Thank you!',
          message: 'You will be notified when this vacation is in season.',
        };
        return res.redirect(303, '/vacation');
      }
    },
  );
});

module.exports = router;
