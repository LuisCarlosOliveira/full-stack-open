const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    const transformed = { ...returnedObject };
    transformed.id = transformed._id.toString();
    delete transformed._id;
    delete transformed.__v;
    return transformed;
  },
});

module.exports = mongoose.model('User', userSchema);
