const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const boardSchema = new mongoose.Schema({
  boardNo: {
    type: Number,
  },
  userName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  regDate: {
    type: Date,
    default: Date.now,
  },
  updDate: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

boardSchema.plugin(AutoIncrement, { inc_field: 'boardNo' });

module.exports = mongoose.model('Board', boardSchema);
