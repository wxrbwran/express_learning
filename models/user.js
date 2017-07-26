/**
 * Created by wxr on 17/7/15.
 */
const mongoose = require('mongoose');

const userSchema = mongoose.schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  }
}, {
  collection: 'users'
});