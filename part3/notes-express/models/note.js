const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5,
  },
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    const transformed = { ...returnedObject };
    transformed.id = transformed._id.toString();
    delete transformed._id;
    delete transformed.__v;
    return transformed;
  },
});

module.exports = mongoose.model('Note', noteSchema);
