const Rest = require('connect-rest');

const Attraction = require('../models/attraction');

const options = {
  context: '/api',
  domain: require('domain').create(),
};

const rest = Rest.create(options);

/* GET users listing. */
rest.get('/tours', function(req, res, next) {
  const tours = [
    { id: 0, name: 'Hood River', price: 99.99 },
    { id: 1, name: 'Oregon Coast', price: 149.95 },
  ];
  res.json({
    status: 'success',
    data: tours,
  });
});

rest.get('/attractions', function(req, res, next) {
  Attraction.find({ approved: true }, (err, attractions) => {
    if (err) {
      return res.send(500, `Error: ${err.stack}`);
    }
    res.json({
      status: 'success',
      data: attractions.map(attraction => {
        return {
          name: attraction.name,
          id: attraction._id,
          description: attraction.description,
          location: attraction.location,
        };
      }),
    });
  });
});

rest.post('/attraction', function(req, res, next) {
  const attraction = new Attraction({
    name: req.body.name,
    description: req.body.description,
    location: {
      lat: req.body.lat,
      lng: req.body.lng,
    },
    history: {
      event: 'created',
      email: req.body.email,
      date: new Date(),
    },
    approved: false,
  });
  attraction.save((err, a) => {
    if (err) {
      res.send(500, `error:${err.stack}`);
    }
    res.json({
      status: 'success',
      data: {
        id: a._id,
      },
    });
  });
});

rest.get('/attraction/:id', function(req, res, next) {
  Attraction.findById(req.params.id, (err, attraction) => {
    if (err) {
      return res.send(500, `Error: ${err.stack}`);
    }
    res.json({
      status: 'success',
      data: {
        name: attraction.name,
        id: attraction._id,
        description: attraction.description,
        location: attraction.location,
      },
    });
  });
});

module.exports = rest.processRequest();
